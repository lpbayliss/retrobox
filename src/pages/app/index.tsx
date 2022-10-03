import {
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { withServerSideSession } from '@lib/auth';
import { withToggles } from '@lib/unleash';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await withToggles(await withServerSideSession(context)({}));

  if (!props.session?.user)
    return {
      redirect: '/',
      props: {},
    };

  return {
    props,
  };
};

const AppPage: NextPage = ({ session }: any) => {
  return (
    <AppLayout>
      <Head>
        <title>Home</title>
        <meta name="description" content="Retrobox home" />
      </Head>
      <Flex w="full" h="full">
        <Spacer />
        <Center flexDir="column" w="full" my="auto">
          <Heading as="h2" pb="4">
            <FormattedMessage id="HOME_PAGE_HEADING" />
          </Heading>
          <Text color="subtext">
            <FormattedMessage id="HOME_PAGE_SUBTEXT" />
          </Text>
        </Center>
        <Spacer />
      </Flex>
    </AppLayout>
  );
};

export default AppPage;
