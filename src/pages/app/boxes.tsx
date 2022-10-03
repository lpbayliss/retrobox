import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Heading,
  Text,
  useDisclosure,
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
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

const BoxDisplay = () => (
  <NextLink href="/boxes/abc" passHref>
    <Card as="a">
      <Center flexDir="column">
        <Heading as="h4" mb="4" size="md">
          Box Name
        </Heading>
        <Text>A description about the box.</Text>
      </Center>
    </Card>
  </NextLink>
);

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AppLayout>
      <Box as="section" mb="6">
        <Heading as="h2" mb="2" size="2xl">
          Boxes
        </Heading>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/boxes">Boxes</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      {/* <Box as="section">
        <Heading>Create new</Heading>
        <Card>
          <CreateBoxForm />
        </Card>
      </Box> */}
      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          Recent
        </Heading>
        <Wrap py="2" spacing="6">
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
        </Wrap>
      </Box>
      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          All Boxes
        </Heading>
        <Wrap py="2" spacing="6">
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
        </Wrap>
      </Box>
    </AppLayout>
  );
};

export default AppPage;
