import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  ScaleFade,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { PageSection } from '@components/page-section';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faShareSquare } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: false });

const BoxesPage: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  const toast = useToast();

  const { data: drop } = trpc.drop.fetchById.useQuery({ id: String(router.query['dropId']) });

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied',
      description: "We've copied the drop link to your clipboard",
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <>
      <Head>
        <title>Retrobox | View Drop</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* BREADCRUMBS */}
      {drop && (
        <Box as="section" mb="6">
          <Heading as="h2" mb="2" size="2xl">
            View Drop
          </Heading>
          {data?.user && (
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
                <NextLink href={'/app/boxes/[boxId]'} as={`/app/boxes/${drop.box.id}`} passHref>
                  <BreadcrumbLink>{drop.box.name}</BreadcrumbLink>
                </NextLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <NextLink
                  href={'/app/boxes/[boxId]/drop/[dropId]'}
                  as={`/app/boxes/${drop.box.id}/drop/${drop.id}`}
                  passHref
                >
                  <BreadcrumbLink>View Drop</BreadcrumbLink>
                </NextLink>
              </BreadcrumbItem>
            </Breadcrumb>
          )}
          {!data?.user && (
            <NextLink href={'/app/boxes/[boxId]'} as={`/app/boxes/${drop.box.id}`} passHref>
              <Link>Return to {drop.box.name}</Link>
            </NextLink>
          )}
        </Box>
      )}

      {/*  DEFAULT VIEW */}
      {drop && (
        <Flex as="section" direction="column" w="full" h="full">
          {/* Heading / Title */}
          <Box as="section" mb="6">
            <HStack>
              <Heading mr="2">Drop</Heading>
              {drop.isPublic && (
                <IconButton
                  aria-label="edit-name"
                  icon={<Icon icon={faShareSquare} />}
                  onClick={handleShareLink}
                  size="sm"
                />
              )}
            </HStack>
          </Box>

          {/* Items */}
          <PageSection heading="Items">
            <TileGrid>
              {drop.items.map((item, index) => (
                <ScaleFade key={item.id} delay={0.03 * index} in={true} initialScale={0.9}>
                  <TileGridItem>
                    <Card gap={2}>
                      <Text>&quot;{item.content}&quot;</Text>
                      <Divider />
                      <HStack>
                        <Avatar
                          name={
                            item.createdBy
                              ? item.createdBy.name
                                ? item.createdBy.name
                                : 'Unknown'
                              : undefined
                          }
                          size="xs"
                        />
                        <Text fontSize="sm">
                          {item.createdBy
                            ? item.createdBy.name
                              ? item.createdBy.name
                              : 'Unknown'
                            : 'Anonymous'}
                        </Text>
                      </HStack>
                    </Card>
                  </TileGridItem>
                </ScaleFade>
              ))}
            </TileGrid>
          </PageSection>
        </Flex>
      )}
    </>
  );
};

export default BoxesPage;
