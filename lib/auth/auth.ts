import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Check if it's an admin login
          const admin = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (admin) {
            const passwordsMatch = await bcrypt.compare(password, admin.password_hash);
            if (passwordsMatch) {
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

          if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.password_hash);
            if (passwordsMatch) {
              return {
                id: user.user_id.toString(),
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                role: 'user',
              };
            }
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
