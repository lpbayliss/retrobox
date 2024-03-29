import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { PageSection } from '@components/page-section';
import { UpdateProfileForm } from '@components/update-profile-form';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProfilePage: NextPage = () => {
  const { data: sessionData } = useSession();

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <Head>
        <title>Retrobox | Home</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* Page Heading */}
      <Box as="section" mb="6">
        <Breadcrumb mb={4} separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <NextLink href="/app" passHref>
              <BreadcrumbLink as="span">
                <FormattedMessage id="HOME_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/app/profile" passHref>
              <BreadcrumbLink as="span">Profile</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h2" mb="2" size="2xl">
          Your Profile
        </Heading>
      </Box>
      <Alert status="info">
        <AlertIcon />
        <Text>
          You&apos;ve signed in with the email{' '}
          <Text as="span" textDecor="underline">
            {sessionData?.user.email}
          </Text>
        </Text>
      </Alert>
      <PageSection>
        <VStack alignItems="start">
          <Card w="full" p="4">
            <Heading as="h3" mb="2" size="lg">
              Change name
            </Heading>
            <UpdateProfileForm />
          </Card>
          <Card w="full" p="4">
            <Heading as="h3" mb="2" size="lg">
              Other
            </Heading>
            <Button onClick={handleLogout}>Log out</Button>
          </Card>
        </VStack>
      </PageSection>
    </>
  );
};

export default ProfilePage;
