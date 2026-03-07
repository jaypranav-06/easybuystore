import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnAccountPage = nextUrl.pathname.startsWith('/account');

      if (isOnAdminPanel) {
        if (isLoggedIn && auth.user.role === 'admin') return true;
        return false; // Redirect to login page
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
