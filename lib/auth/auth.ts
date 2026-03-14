import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Merge the callbacks from authConfig with our custom ones
const config = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(' Auth attempt:', credentials);
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log(' Validation failed:', parsedCredentials.error);
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log(' Validated email:', email);

        // Check if it's an admin login
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        console.log(' Admin found:', admin ? 'YES' : 'NO');

        if (admin) {
          console.log(' Checking admin password...');
          const passwordsMatch = await bcrypt.compare(password, admin.password_hash);
          console.log(' Admin password match:', passwordsMatch);

          if (passwordsMatch) {
            console.log(' Admin login successful!');
            return {
              id: admin.admin_id.toString(),
              email: admin.email,
              name: admin.username,
              role: 'admin',
            };
          }
        }

        // Check regular user login
        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log(' User found:', user ? 'YES' : 'NO');

        if (user) {
          console.log(' Checking user password...');
          const passwordsMatch = await bcrypt.compare(password, user.password_hash);
          console.log(' User password match:', passwordsMatch);

          if (passwordsMatch) {
            console.log(' User login successful!');
            return {
              id: user.user_id.toString(),
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              role: 'user',
            };
          }
        }

        console.log(' Login failed - no match found');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }: { token: JWT; user: User | null; trigger?: string }) {
      console.log(' JWT callback - user:', user);
      console.log(' JWT callback - token before:', token);
      console.log(' JWT callback - trigger:', trigger);

      // Call the base jwt callback from authConfig first
      if (authConfig.callbacks?.jwt) {
        token = await authConfig.callbacks.jwt({ token, user, trigger } as any);
      }

      // Then add our additional properties
      if (user) {
        token.id = user.id;
      }
      console.log(' JWT callback - token after:', token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log(' Session callback - token:', token);
      console.log(' Session callback - session before:', session);

      // Call the base session callback from authConfig first
      if (authConfig.callbacks?.session) {
        session = await authConfig.callbacks.session({ session, token } as any);
      }

      // Then add our additional properties
      if (session.user) {
        session.user.id = token.id as string;
      }
      console.log(' Session callback - session after:', session);
      return session;
    },
    // Include the authorized callback from authConfig
    authorized: authConfig.callbacks?.authorized,
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(config);
