/**
 * AUTHENTICATION PROVIDERS AND LOGIC
 *
 * This file implements the actual authentication methods for our e-commerce store.
 * It handles both Google OAuth login and traditional email/password login.
 *
 * Key Concepts for VIVA:
 * - OAuth: "Login with Google" - lets users sign in using their Google account
 * - Credentials: Traditional email/password login
 * - bcrypt: Securely hashes passwords (one-way encryption)
 * - Zod: Validates user input before processing
 * - Dual User Types: Separate tables for regular users and admin users
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { z } from 'zod'; // Input validation library
import bcrypt from 'bcryptjs'; // Password hashing library
import prisma from '@/lib/db/prisma'; // Database connection
import { sendWelcomeEmail } from '@/lib/email/sendgrid'; // Email service
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

/**
 * LOGIN VALIDATION SCHEMA
 *
 * Uses Zod to validate login form data before processing.
 * This prevents SQL injection and ensures data is in correct format.
 */
const loginSchema = z.object({
  email: z.string().email(), // Must be valid email format
  password: z.string().min(6), // Must be at least 6 characters
});

/**
 * NEXTAUTH CONFIGURATION
 *
 * Merges our custom config from auth.config.ts with authentication providers.
 */
const config = {
  ...authConfig, // Spread the base configuration (pages, callbacks)

  /**
   * AUTHENTICATION PROVIDERS
   *
   * We support two ways to login:
   * 1. Google OAuth (social login)
   * 2. Email/Password (credentials)
   */
  providers: [
    /**
     * GOOGLE OAUTH PROVIDER
     *
     * Allows users to login with their Google account.
     * Requires Google Client ID and Secret from Google Cloud Console.
     *
     * How it works:
     * 1. User clicks "Sign in with Google"
     * 2. Redirected to Google's login page
     * 3. User approves access
     * 4. Google sends user info back to our app
     * 5. We create or find the user in our database
     */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!, // From Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // From Google Cloud Console
    }),

    /**
     * EMAIL/PASSWORD (CREDENTIALS) PROVIDER
     *
     * Traditional login with email and password.
     * Checks both admin_users and regular users tables.
     */
    Credentials({
      /**
       * AUTHORIZE FUNCTION
       *
       * This function runs when someone tries to login with email/password.
       * It validates credentials and returns user data if login is successful.
       *
       * Process:
       * 1. Validate input (email format, password length)
       * 2. Check if email belongs to an admin
       * 3. If not admin, check if email belongs to regular user
       * 4. Verify password using bcrypt
       * 5. Return user object or null (null = login failed)
       */
      async authorize(credentials) {
        console.log('Auth attempt:', credentials);

        // STEP 1: Validate the login form data
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Validation failed:', parsedCredentials.error);
          return null; // Invalid format, reject login
        }

        const { email, password } = parsedCredentials.data;
        console.log('Validated email:', email);

        /**
         * STEP 2: CHECK ADMIN LOGIN
         *
         * First, check if this email belongs to an admin user.
         * Admins are stored in a separate 'admin_users' table.
         */
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        console.log('Admin found:', admin ? 'YES' : 'NO');

        if (admin) {
          console.log('Checking admin password...');

          // Compare provided password with hashed password in database
          // bcrypt.compare() safely checks if passwords match
          const passwordsMatch = await bcrypt.compare(password, admin.password_hash);
          console.log('Admin password match:', passwordsMatch);

          if (passwordsMatch) {
            console.log('Admin login successful!');

            // Return admin user object with their role from database
            return {
              id: admin.admin_id.toString(),
              email: admin.email,
              name: admin.username,
              role: admin.role, // Use role from database (admin or staff)
            };
          }
        }

        /**
         * STEP 3: CHECK REGULAR USER LOGIN
         *
         * If not an admin, check if email belongs to a regular customer.
         * Regular users are stored in 'users' table.
         */
        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log('User found:', user ? 'YES' : 'NO');

        if (user) {
          console.log('Checking user password...');

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password_hash);
          console.log('User password match:', passwordsMatch);

          if (passwordsMatch) {
            console.log('User login successful!');

            // Return regular user object with 'user' role
            return {
              id: user.user_id.toString(),
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              role: 'user', // Regular customer, not admin
            };
          }
        }

        // If we reach here, login failed (wrong email or password)
        console.log('Login failed - no match found');
        return null;
      },
    }),
  ],

  /**
   * CALLBACKS
   *
   * These functions customize NextAuth's behavior at key points.
   */
  callbacks: {
    /**
     * JWT CALLBACK
     *
     * Runs when creating or updating JWT tokens.
     * Handles Google OAuth user creation in Supabase database.
     *
     * Important: When someone logs in with Google for the first time,
     * we need to create their account in our Supabase database.
     */
    async jwt({ token, user, trigger, account }: { token: JWT; user: User | null; trigger?: string; account?: any }) {
      console.log('JWT callback - user:', user);
      console.log('JWT callback - account:', account);
      console.log('JWT callback - token before:', token);
      console.log('JWT callback - trigger:', trigger);

      // Call the base jwt callback from authConfig first (adds role to token)
      if (authConfig.callbacks?.jwt) {
        token = await authConfig.callbacks.jwt({ token, user, trigger, account } as any);
      }

      /**
       * GOOGLE SIGN-IN HANDLER
       *
       * When user logs in with Google, automatically create their account
       * in our Supabase database if they don't have one yet.
       *
       * Why we do this:
       * - Google only provides email and name
       * - We need to store this in our database to link with orders, cart, etc.
       * - First-time Google users get an account created automatically
       */
      if (account?.provider === 'google' && user?.email) {
        console.log('Google sign-in detected, checking if user exists...');

        try {
          // Check if user already exists in our database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If user doesn't exist, create them
          if (!dbUser) {
            console.log('Creating new user from Google sign-in...');

            // Split full name into first and last name
            const [firstName, ...lastNameParts] = (user.name || '').split(' ');

            // Create new user in Supabase database
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                first_name: firstName || 'User',
                last_name: lastNameParts.join(' ') || '',
                password_hash: '', // No password for OAuth users (they login via Google)
                phone: '',
              },
            });
            console.log('New user created:', dbUser.user_id);

            // Send welcome email to new user
            try {
              await sendWelcomeEmail(user.email, user.name || 'User');
              console.log('✅ Welcome email sent to:', user.email);
            } catch (emailError) {
              console.error('❌ Failed to send welcome email:', emailError);
              // Don't fail the sign-in if email fails
            }
          } else {
            console.log('Existing user found:', dbUser.user_id);
          }

          // Add user ID and role to JWT token
          token.id = dbUser.user_id.toString();
          token.role = 'user'; // Google sign-in users are regular customers
        } catch (error) {
          console.error('Error handling Google sign-in:', error);
        }
      }

      // Add user ID to token for all login types
      if (user) {
        token.id = token.id || user.id;
      }
      console.log('JWT callback - token after:', token);
      return token;
    },

    /**
     * SESSION CALLBACK
     *
     * Runs when accessing session data.
     * Adds user ID from JWT token to session object.
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback - token:', token);
      console.log('Session callback - session before:', session);

      // Call the base session callback from authConfig (adds role to session)
      if (authConfig.callbacks?.session) {
        session = await authConfig.callbacks.session({ session, token } as any);
      }

      // Add user ID to session from token
      if (session.user) {
        session.user.id = token.id as string;
      }
      console.log('Session callback - session after:', session);
      return session;
    },

    // Include the route protection callback from authConfig
    authorized: authConfig.callbacks?.authorized,
  },
};

/**
 * EXPORT NEXTAUTH FUNCTIONS
 *
 * These functions are used throughout the app:
 * - auth(): Get current user session
 * - signIn(): Trigger login flow
 * - signOut(): Trigger logout flow
 * - handlers: API routes for NextAuth (/api/auth/*)
 */
export const { auth, signIn, signOut, handlers } = NextAuth(config);
