import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { IntlProvider } from "react-intl";

import { getMessages } from "../i18n";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: unknown }>) {
  const { locale } = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <IntlProvider
      locale={String(locale)}
      messages={getMessages(String(locale))}
    >
      <ChakraProvider resetCSS theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </ChakraProvider>
    </IntlProvider>
  );
}

export default MyApp;
