import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { getMessages } from '@i18n/getMessages';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { trpc } from '@lib/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FlagProvider, IToggle } from '@unleash/proxy-client-react';
import { getAppClient } from '@lib/unleash';
import { publicRuntimeConfig } from '@lib/publicRuntimeConfig';

const MyApp = ({
  Component,
  pageProps: { session, toggles, ...pageProps },
}: AppProps<{ session: Session; toggles: IToggle[] }>) => {
  const { locale } = useRouter();
  const client = getAppClient(toggles);

  return (
    <FlagProvider unleashClient={client}>
      <SessionProvider session={session}>
        <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
          <ChakraProvider resetCSS theme={theme}>
            {publicRuntimeConfig.NODE_ENV !== 'production' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
            <Component {...pageProps} />
          </ChakraProvider>
        </IntlProvider>
      </SessionProvider>
    </FlagProvider>
  );
};

export default trpc.withTRPC(MyApp);
