import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps, AppType } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { getSession, SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { trpc } from 'src/lib/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export type PageProps = { session: Session | null };

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P = {}, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>;
};

const MyApp: AppType<PageProps> = ({ Component, pageProps }: AppPropsWithLayout<PageProps>) => {
  const { locale } = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
        <ChakraProvider resetCSS theme={theme}>
          {getLayout(<Component {...pageProps} />)}
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </ChakraProvider>
      </IntlProvider>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);
