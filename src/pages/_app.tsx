import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { withTRPC } from '@trpc/next';
import type { AppRouter } from './api/trpc/[trpc]';

export type PageProps = { dehydratedState: unknown; session: Session };

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P = {}, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout<PageProps>) {
  const { locale } = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
        <ChakraProvider resetCSS theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </IntlProvider>
    </SessionProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `https://${process.env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
    };
  },
  
  ssr: true,
})(MyApp);
