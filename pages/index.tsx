import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';

import { Card } from '@components/card';

const Index: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" h="100vh">
        <Card mx="auto" my="auto" maxW="xl" minW="xl" pb="14">
          <Box mx="auto" fontSize="6xl">
            📦
          </Box>
          <Heading mx="auto" pb="4" size="4xl">
            <FormattedMessage id="APP_NAME" />
          </Heading>
          <Text maxW="xs" mx="auto" pb="4" color="grey" fontSize="sm">
            <FormattedMessage id="APP_DESCRIPTION" />
          </Text>
        </Card>
      </Flex>
    </div>
  );
};

export default Index;
