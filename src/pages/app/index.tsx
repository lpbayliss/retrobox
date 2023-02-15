import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, Heading } from '@chakra-ui/react';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProjectsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Projects</title>
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
        </Breadcrumb>
        <Heading as="h2" mb="2" size="2xl">
          Home
        </Heading>
      </Box>

      <NextLink href="/app/projects">
        <Card w="full" mb="6" px="6" py="3">
          Projects
        </Card>
      </NextLink>
      <NextLink href="/app/profile">
        <Card w="full" mb="6" px="6" py="3">
          Profile
        </Card>
      </NextLink>
    </>
  );
};

export default ProjectsPage;
