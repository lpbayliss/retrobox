import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { UpdateProfileForm } from '@components/update-profile-form';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Home</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      <Box as="section" mb="12">
        <Heading as="h2" mb="2" size="2xl">
          <FormattedMessage id="BOXES_PAGE_TITLE" />
        </Heading>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <NextLink href="/app" passHref>
              <BreadcrumbLink>
                <FormattedMessage id="HOME_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/app/profile" passHref>
              <BreadcrumbLink>Profile</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Flex w="full" h="full">
        <Center flexDir="column" w="full" my="auto" textAlign="center">
          <Card>
            <UpdateProfileForm />
          </Card>
        </Center>
      </Flex>
    </>
  );
};

export default ProfilePage;
