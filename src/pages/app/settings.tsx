import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const SettingsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Settings</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      <Box as="section" mb="6">
        <Heading as="h2" mb="2" size="2xl">
          <FormattedMessage id="SETTINGS_PAGE_TITLE" />
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
            <NextLink href="/app/settings" passHref>
              <BreadcrumbLink>
                <FormattedMessage id="SETTINGS_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Flex w="full" h="full">
        <Spacer />
        <Center flexDir="column" w="full" my="auto" textAlign="center">
          <Heading as="h2" pb="4">
            <FormattedMessage id="HOME_PAGE_HEADING" />
          </Heading>
          <Text color="subtext">
            <FormattedMessage id="HOME_PAGE_SUBTEXT" />
          </Text>
        </Center>
        <Spacer />
      </Flex>
    </>
  );
};

export default SettingsPage;
