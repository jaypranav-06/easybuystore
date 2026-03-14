import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // This callback is shared between API and middleware
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session user
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnAccountPage = nextUrl.pathname.startsWith('/account');

      // In NextAuth v5, auth.user should have the role from the session callback
      const userRole = auth?.user?.role;

      console.log(' Authorization check:', {
        path: nextUrl.pathname,
        isLoggedIn,
        userRole,
        fullUser: auth?.user,
        isOnAdminPanel,
      });

      if (isOnAdminPanel) {
        if (isLoggedIn && userRole === 'admin') {
          console.log(' Admin access granted');
          return true;
        }
        console.log(' Admin access denied');
        return false; // Redirect to sign in page
      }

      if (isOnAccountPage) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
