/* eslint-disable @next/next/no-document-import-in-page */
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../theme";
import Document, { Head, Html, Main, NextScript } from "next/document";

type Props = {};

class MyDocument extends Document<Props> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Retrobox | A small tool for collecting retro items"
          />
          <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
