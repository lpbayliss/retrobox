import { default as merge } from 'deepmerge';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { IToggle } from 'unleash-proxy-client';

import { getPrefetchClient } from './unleash';

export type DefaultProps = { toggles: IToggle[]; session: Session | null };

export const withDefaultServerSideProps =
  <P extends { [key: string]: any } = { [key: string]: any }>(
    opts: { secure?: boolean },
    func?: GetServerSideProps<P>,
  ): GetServerSideProps =>
  async (context) => {
    // Fetch session
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    // Fetch unleash toggles // Feature Flags
    const unleash = getPrefetchClient();
    if (session?.user) unleash.updateContext({ userId: session?.user.id });
    await unleash.start();
    const toggles = unleash.getAllToggles();

    // Protect route if secure
    if (opts.secure && !session?.user) return { redirect: { destination: '/', permanent: false } };

    // Default props
    const defaultServerSideProps: GetServerSidePropsResult<DefaultProps> = {
      props: { session, toggles },
    };

    // If no GetServerSideProps func provided, just return default
    if (!func) return defaultServerSideProps;

    // Execute page GetServerSideProps
    const serverSidePropsResult: GetServerSidePropsResult<P> = await func(context);

    // Merge and return props. Assert as any because types are hard
    return merge(defaultServerSideProps, serverSidePropsResult as any);
  };
