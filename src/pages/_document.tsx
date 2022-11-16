/* eslint-disable @next/next/no-document-import-in-page */
import { ColorModeScript } from '@chakra-ui/react';
import theme from '@theme/theme';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Retrobox | A small tool for collecting retro items" />
          <link rel="icon" href="/favicon.ico" />
          {/* <meta property="og:image" content={imgURL} /> */}
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
