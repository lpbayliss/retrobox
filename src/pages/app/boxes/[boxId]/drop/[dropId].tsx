import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  HStack,
  IconButton,
  ScaleFade,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { PageSection } from '@components/page-section';
import { TileGrid } from '@components/tile-grid';
import { faEdit } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const BoxesPage: NextPage = () => {
  const intl = useIntl();
  const trpcContext = trpc.useContext();
  const router = useRouter();

  const { data: box } = trpc.box.fetchById.useQuery({ id: String(router.query['boxId']) });

  return (
    <>
      <Head>
        <title>Retrobox | View Drop</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* BREADCRUMBS */}
      {box && (
        <Box as="section" mb="6">
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
              <NextLink href="/app/boxes" passHref>
                <BreadcrumbLink>
                  <FormattedMessage id="BOXES_PAGE_TITLE" />
                </BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <NextLink href={'/app/boxes/[boxId]'} as={`/app/boxes/${box.id}`} passHref>
                <BreadcrumbLink>{box.name}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <NextLink
                href={'/app/boxes/[boxId]/drop/[dropId]'}
                as={`/app/boxes/${box.id}/drop/${null}`}
                passHref
              >
                <BreadcrumbLink>Drop</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      )}

      {/*  DEFAULT VIEW */}
      {box && (
        <Flex as="section" direction="column" w="full" h="full">
          {/* Heading / Title */}
          <Box as="section" mb="6">
            <HStack>
              <Heading mr="2">Drop</Heading>
              <IconButton aria-label="edit-name" icon={<Icon icon={faEdit} />} size="sm" />
            </HStack>
          </Box>

          {/* Items */}
          <PageSection heading="Items" moreOptions>
            <TileGrid>
              <ScaleFade delay={0.03 * 0} in={true} initialScale={0.9}>
                <Card>This is an item</Card>
              </ScaleFade>
              <ScaleFade delay={0.03 * 1} in={true} initialScale={0.9}>
                <Card>This is an item</Card>
              </ScaleFade>
              <ScaleFade delay={0.03 * 2} in={true} initialScale={0.9}>
                <Card>This is an item</Card>
              </ScaleFade>
              <ScaleFade delay={0.03 * 3} in={true} initialScale={0.9}>
                <Card>This is an item</Card>
              </ScaleFade>
            </TileGrid>
          </PageSection>
        </Flex>
      )}
    </>
  );
};

export default BoxesPage;
