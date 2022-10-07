import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  ScaleFade,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CardLink } from '@components/card-link';
import { CreateItemForm } from '@components/create-item-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faEdit, faPlusCircle } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const BoxesPage: NextPage = () => {
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const createItemEnabled = useFlag('create-item');
  const createDropEnabled = useFlag('create-drop');

  const { data: box } = trpc.box.fetchById.useQuery({ id: String(router.query['id']) });
  trpc.box.setViewed.useQuery({ id: String(router.query['id']) });
  const createDropMutation = trpc.box.createDrop.useMutation({
    onSuccess() {
      trpcContext.box.fetchById.invalidate();
    },
  });

  const contributors = useMemo(() => {
    return box?.items.reduce<any>((record, item) => {
      const key = item.createdBy
        ? item.createdBy.name
          ? item.createdBy.name
          : 'Unknown'
        : 'Anonymous';

      if (record[key]) record[key].push(item);
      else record[key] = [item];

      return record;
    }, {});
  }, [box]);

  const handleCreateBox = () => {
    if (box) createDropMutation.mutateAsync({ id: box.id });
  };

  return (
    <>
      <Head>
        <title>Retrobox | {box?.name || 'Unknown'}</title>
        <meta name="description" content="Retrobox home" />
      </Head>
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
              <NextLink href={'/app/boxes/[id]'} as={`/app/boxes/${box.id}`} passHref>
                <BreadcrumbLink>{box.name}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      )}

      {box && (
        <Flex as="section" direction="column" w="full" h="full">
          {/* Heading / Title */}
          <Box as="section" mb="6">
            <HStack>
              <Heading mr="2">{box.name}</Heading>
              <IconButton aria-label="edit-name" icon={<Icon icon={faEdit} />} size="sm" />
            </HStack>
            {box.team && (
              <Text color="subtext">
                <FormattedMessage id="BOX_PAGE_CREATED_BY_TEXT" />
              </Text>
            )}
            <Text color="subtext">{box.team?.name || 'Personal'}</Text>
          </Box>

          {/* Items (Add an item) */}
          <Box as="section" mb="6">
            <Heading as="h3" mb="4">
              <FormattedMessage id="BOX_PAGE_ITEM_SECTION_HEADER" />
            </Heading>
            <Stack direction={['column', null, 'row']}>
              <Card flex="1" maxH="2xs">
                <Text mb="4" fontSize="lg">
                  <FormattedMessage
                    id="BOX_PAGE_ITEM_COUNT"
                    values={{
                      itemCount: box.items.length || 0,
                      contributorCount: Object.keys(contributors).length || 0,
                    }}
                  />
                </Text>
                <VStack alignItems="flex-start" gap="2" overflowY="auto" h="full" ml="2">
                  {Object.keys(contributors).map((key) => (
                    <HStack key={key}>
                      <Avatar name={key} size="xs" />
                      <Text>
                        <FormattedMessage
                          id="BOX_PAGE_CONTRIBUTOR_DETAIL"
                          values={{ name: key, items: contributors[key].length || 0 }}
                        />
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Card>
              {createItemEnabled && (
                <Card flex="1" maxH="2xs">
                  <CreateItemForm boxId={box.id} />
                </Card>
              )}
            </Stack>
          </Box>

          {/* Drops */}
          <Box as="section" mb="6">
            <Heading as="h3" mb="4">
              Drops
            </Heading>
            <TileGrid>
              {createDropEnabled && (
                <TileGridItem>
                  <Card as={Button} variant="outline" h="full" w="full" onClick={handleCreateBox}>
                    <Center flexDir="column">
                      <Icon mb="2" fontSize="25" icon={faPlusCircle} />
                      <Text fontSize="xl">Create drop</Text>
                    </Center>
                  </Card>
                </TileGridItem>
              )}
              {box.drops.map((drop, index) => (
                <ScaleFade key={box.id} delay={0.03 * index} in={true} initialScale={0.9}>
                  <TileGridItem>
                    <CardLink href={`/app/boxes/${box.id}/drop/${drop.id}`}>
                      <Center flexDir="column">
                        <Heading as="h4" mb="4" size="md">
                          This is a drop
                        </Heading>
                        <Text>A description about the drop.</Text>
                      </Center>
                    </CardLink>
                  </TileGridItem>
                </ScaleFade>
              ))}
            </TileGrid>
          </Box>
        </Flex>
      )}

      {!box && (
        <Flex as="section" w="full" h="full">
          <Spacer />
          <Center flexDir="column" w="full" my="auto">
            <Heading as="h2" pb="4">
              <FormattedMessage id="BOX_PAGE_NOT_FOUND_TITLE" />
            </Heading>
            <Text color="subtext">
              <FormattedMessage id="BOX_PAGE_NOT_FOUND_SUBTITLE" />
            </Text>
          </Center>
          <Spacer />
        </Flex>
      )}
    </>
  );
};

export default BoxesPage;
