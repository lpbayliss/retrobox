import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps, AppType } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { trpc } from '@lib/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  FlagProvider,
  IConfig,
  InMemoryStorageProvider,
  IToggle,
  UnleashClient,
} from '@unleash/proxy-client-react';

const config: IConfig = {
  url: 'https://retrobox-unleash-proxy-staging.fly.dev/proxy',
  clientKey: 'staging-proxy',
  refreshInterval: 15,
  appName: 'retrobox-development',
  environment: 'development',
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session; toggles: IToggle[] }>) => {
  const { locale } = useRouter();

  const ssrOption =
    typeof window !== 'undefined'
      ? {}
      : { fetch: fetch, storageProvider: new InMemoryStorageProvider() };

  const client = new UnleashClient({
    ...config,
    ...ssrOption,
    bootstrap: pageProps.toggles,
  });

  const toggles = client.getAllToggles();
  console.log(toggles);

  return (
    <FlagProvider unleashClient={client}>
      <SessionProvider session={session}>
        <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
          <ChakraProvider resetCSS theme={theme}>
            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
            <Component {...pageProps} />
          </ChakraProvider>
        </IntlProvider>
      </SessionProvider>
    </FlagProvider>
  );
};

export default trpc.withTRPC(MyApp);
