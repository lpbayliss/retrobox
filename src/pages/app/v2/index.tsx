import { Flex, Heading } from '@chakra-ui/react';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Home V2</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      <Flex as="section" direction="column" w="full" id="title-block">
        <Heading as="h2" mb="2" size="2xl">
          Home
        </Heading>
      </Flex>
    </>
  );
};

export default HomePage;
