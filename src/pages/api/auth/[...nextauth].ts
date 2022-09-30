import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { serverRuntimeConfig } from '@lib/serverRuntimeConfig';

const prisma = new PrismaClient();

// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: serverRuntimeConfig.EMAIL_SERVER,
      from: serverRuntimeConfig.EMAIL_FROM,
      maxAge: 10 * 60,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: { name: user.name, email: user.email, image: user.image, id: user.id },
      };
    },
  },
};

export default NextAuth(authOptions);
