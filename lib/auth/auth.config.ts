/**
 * NEXTAUTH CONFIGURATION FILE
 *
 * This file configures how authentication works in our e-commerce application.
 * We use NextAuth.js v5 which handles user login, sessions, and route protection.
 *
 * Key Concepts for VIVA:
 * - Authentication: Verifying who the user is (login/signup)
 * - Authorization: Checking if user has permission to access a page
 * - Session: Keeps user logged in across page navigation
 * - Middleware: Code that runs before every page load to check authentication
 */

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  /**
   * CUSTOM PAGES CONFIGURATION
   *
   * Tell NextAuth where to redirect users for different auth actions.
   * Instead of using default NextAuth pages, we use our own custom pages.
   */
  pages: {
    signIn: '/signin',      // Redirect here when user needs to login
    signOut: '/signout',    // Redirect here after logout
    error: '/error',        // Redirect here if authentication error occurs
  },

  /**
   * CALLBACKS CONFIGURATION
   *
   * Callbacks are functions that run at specific points in the authentication flow.
   * They let us customize how NextAuth behaves.
   */
  callbacks: {
    /**
     * JWT CALLBACK
     *
     * This runs whenever a JSON Web Token (JWT) is created or updated.
     * JWT is like a digital ID card that proves the user is logged in.
     *
     * Purpose: Add the user's role (admin/user) to their JWT token
     */
    async jwt({ token, user }) {
      // This callback is shared between API and middleware
      if (user) {
        token.role = user.role; // Add role to the token (admin or user)
      }
      return token;
    },

    /**
     * SESSION CALLBACK
     *
     * This runs whenever we check the user's session.
     * Session contains the user's login information.
     *
     * Purpose: Add the user's role to the session object so pages can access it
     */
    async session({ session, token }) {
      // Add role to session user from the JWT token
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },


    /**
     * AUTHORIZED CALLBACK (Route Protection)
     *
     * This runs BEFORE every page loads (in middleware).
     * It decides if the user can access the requested page.
     *
     * How it works:
     * 1. Check if user is logged in
     * 2. Check what page they're trying to access
     * 3. Check if they have permission (admin role for admin pages)
     * 4. Return true (allow) or false (redirect to signin)
     */
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // Check if user is logged in
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin'); // Check if accessing admin page
      const isOnAccountPage = nextUrl.pathname.startsWith('/account'); // Check if accessing account page

      // Get user's role from session
      const userRole = auth?.user?.role;

      // Log authentication check for debugging
      console.log('Authorization check:', {
        path: nextUrl.pathname,
        isLoggedIn,
        userRole,
        fullUser: auth?.user,
        isOnAdminPanel,
      });

      /**
       * ADMIN PANEL PROTECTION
       *
       * Rule: Only users with 'admin', 'staff', or 'super_admin' role can access /admin pages
       */
      if (isOnAdminPanel) {
        if (isLoggedIn && (userRole === 'admin' || userRole === 'staff' || userRole === 'super_admin')) {
          console.log('Admin access granted');
          return true; // Allow access
        }
        console.log('Admin access denied');
        return false; // Redirect to sign in page
      }

      /**
       * ACCOUNT PAGE PROTECTION
       *
       * Rule: Any logged-in user can access their account pages
       */
      if (isOnAccountPage) {
        if (isLoggedIn) return true; // Allow if logged in
        return false; // Redirect to signin if not logged in
      }

      // For all other pages, allow access (public pages)
      return true;
    },
  },

  /**
   * PROVIDERS PLACEHOLDER
   *
   * Providers are authentication methods (Google, Email/Password, etc.)
   * We define the actual providers in auth.ts, not here.
   * This keeps the config file clean and allows it to work in middleware.
   */
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
