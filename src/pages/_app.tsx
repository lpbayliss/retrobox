import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P = {}, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout<{ dehydratedState: unknown }>) {
  const { locale } = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
      <ChakraProvider resetCSS theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </IntlProvider>
  );
}

export default MyApp;
