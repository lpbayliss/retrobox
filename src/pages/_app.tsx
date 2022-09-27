import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps, AppType } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { trpc } from 'src/lib/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export type PageProps = { session: Session };

type MyAppProps<P = {}, IP = P> = AppProps<P> & {
  Component: NextPage<Omit<P, 'session'>, Omit<IP, 'session'>>;
};

const MyApp: AppType<PageProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps<PageProps>) => {
  const { locale } = useRouter();

  return (
    <SessionProvider session={session}>
      <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </ChakraProvider>
      </IntlProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
