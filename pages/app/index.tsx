import { Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';

const AppPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>App</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" h="100vh">
        STUFF!
      </Flex>
    </div>
  );
};

export default AppPage;
