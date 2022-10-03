import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Circle,
  Flex,
  Heading,
  Spacer,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { GetServerSideProps, NextPage } from 'next';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';
import { withToggles } from '@lib/unleash';
import { withServerSideSession } from '@lib/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';

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
      <Flex w="full" h="full">
        <Spacer />
        <Center flexDir="column" w="full" my="auto">
          <Heading>Select a page from the left</Heading>
          <Text color="whiteAlpha.400">There will be more here to see eventually</Text>
        </Center>
        <Spacer />
      </Flex>
    </AppLayout>
  );
};

export default AppPage;
