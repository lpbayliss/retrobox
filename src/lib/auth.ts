import { GetServerSidePropsContext } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';

export type SessionProp = { session: Session | null };

export const withServerSideSession = (context: GetServerSidePropsContext) => {
  console.log('ugh hello');
  return async <P extends { [key: string]: any }>(props: P): Promise<P & SessionProp> => {
    return {
      ...props,
      session: await unstable_getServerSession(context.req, context.res, authOptions),
    };
  };
};
