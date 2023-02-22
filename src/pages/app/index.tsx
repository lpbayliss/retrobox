import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  Collapse,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faFolders, faUser } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link, { default as NextLink } from 'next/link';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProjectsPage: NextPage = () => {
  const { data } = useSession();

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

      <Collapse animateOpacity in={!data?.user.name}>
        <Stack py={4} spacing={4}>
          <Alert status="warning">
            <AlertIcon />
            <Text>
              Oh no! We don&apos;t know what to call you yet. Visit the profile page to update your
              details
            </Text>
            <Text pl="2" textDecor={'underline'}>
              <Link href={'/app/profile'}>Click here.</Link>
            </Text>
          </Alert>
        </Stack>
      </Collapse>

      <TileGrid>
        <TileGridItem>
          <NextLink href="/app/projects">
            <Card w="full" p="8">
              <Icon icon={faFolders} height={12} pb="4" />
              <Heading as="h2" textAlign={'center'}>
                Projects
              </Heading>
            </Card>
          </NextLink>
        </TileGridItem>
        <TileGridItem>
          <NextLink href="/app/profile">
            <Card w="full" p="8">
              <Icon icon={faUser} height={12} pb="4" />
              <Heading as="h2" textAlign={'center'}>
                Profile
              </Heading>
            </Card>
          </NextLink>
        </TileGridItem>
      </TileGrid>
    </>
  );
};

export default ProjectsPage;
