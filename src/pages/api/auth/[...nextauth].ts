import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

const prisma = new PrismaClient();

// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
    // async redirect({ url, baseUrl }) {
    //   logger.debug({ url });
    //   logger.debug({ baseUrl });
    //   return url;
    // },
  },
};

export default NextAuth(authOptions);
