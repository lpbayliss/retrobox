import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CardLink } from '@components/card-link';
import { CreateItemForm } from '@components/create-item-form';
import { PageSection } from '@components/page-section';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faEdit, faPlus } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const BoxesPage: NextPage = () => {
  const intl = useIntl();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const createItemEnabled = useFlag('create-item');
  const createDropEnabled = useFlag('create-drop');
  const {
    isOpen: isItemModalOpen,
    onOpen: onItemModalOpen,
    onClose: onItemModalClose,
  } = useDisclosure();
  const {
    isOpen: isDropModalOpen,
    onOpen: onDropModalOpen,
    onClose: onDropModalClose,
  } = useDisclosure();

  const { data: box } = trpc.box.fetchById.useQuery({ id: String(router.query['id']) });
  trpc.box.setViewed.useQuery({ id: String(router.query['id']) });
  const createDropMutation = trpc.box.createDrop.useMutation({
    onSuccess() {
      trpcContext.box.fetchById.invalidate();
    },
  });
  const { data: boxContributors } = trpc.box.fetchContributors.useQuery({
    id: String(router.query['id']),
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
              <NextLink href={'/app/boxes/[id]'} as={`/app/boxes/${box.id}`} passHref>
                <BreadcrumbLink>{box.name}</BreadcrumbLink>
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
              <Heading mr="2">{box.name}</Heading>
              <IconButton aria-label="edit-name" icon={<Icon icon={faEdit} />} size="sm" />
            </HStack>
            <Text color="subtext" fontSize="sm">
              {box.team?.name || 'Personal'}
            </Text>
            {box.createdBy && (
              <Text color="subtext" fontSize="sm">
                <FormattedMessage
                  id="BOX_PAGE_CREATED_BY_TEXT"
                  values={{ name: box.createdBy.name || 'Unknown' }}
                />
              </Text>
            )}
            <HStack>
              <Text color="subtext" fontSize="sm">
                Contributors:
              </Text>
              <AvatarGroup size="xs">
                {boxContributors &&
                  boxContributors.map((contributor) =>
                    contributor ? (
                      <Avatar key={contributor.id} name={contributor.name || 'Unknown'} />
                    ) : null,
                  )}
              </AvatarGroup>
            </HStack>
          </Box>

          {/* Items (Add an item) */}
          <PageSection
            heading={intl.formatMessage({ id: 'BOX_PAGE_ITEM_SECTION_HEADER' })}
            quickAction={
              createItemEnabled ? (
                <Button
                  gap={2}
                  aria-label={intl.formatMessage({ id: 'BUTTON_ADD_ITEM' })}
                  onClick={onItemModalOpen}
                >
                  <Icon icon={faPlus} />
                  <Text>
                    <FormattedMessage id="BUTTON_ADD_ITEM" />
                  </Text>
                </Button>
              ) : undefined
            }
            moreOptions
          >
            <Stack direction={['column', null, null, null, 'row']}>
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
              <Card flex="1">Box details</Card>
              <Card flex="1">Box history?</Card>
            </Stack>
          </PageSection>

          {/* Drops */}
          <PageSection
            heading="Drops"
            quickAction={
              createDropEnabled ? (
                <Button
                  gap={2}
                  aria-label={intl.formatMessage({ id: 'BUTTON_CREATE_DROP' })}
                  onClick={onDropModalOpen}
                >
                  <Icon icon={faPlus} />
                  <Text>
                    <FormattedMessage id="BUTTON_CREATE_DROP" />
                  </Text>
                </Button>
              ) : undefined
            }
            moreOptions
          >
            <TileGrid>
              {box.drops.map((drop, index) => (
                <ScaleFade key={box.id} delay={0.03 * index} in={true} initialScale={0.9}>
                  <TileGridItem>
                    <CardLink href={`/app/boxes/${box.id}/drop/${drop.id}`}>
                      <Center flexDir="column">
                        <Heading as="h4" mb="4" size="md">
                          <FormattedDate value={new Date()} />
                        </Heading>
                        <Text>Contains {drop.items.length} item(s)</Text>
                      </Center>
                    </CardLink>
                  </TileGridItem>
                </ScaleFade>
              ))}
            </TileGrid>
          </PageSection>
        </Flex>
      )}

      {/*  BOX NOT FOUND VIEW */}
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

      {/* MODALS */}
      {/* CREATE ITEM MODAL */}
      <Modal isOpen={isItemModalOpen} onClose={onItemModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage id="MODAL_HEADER_CREATE_BOX" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{box && <CreateItemForm boxId={box.id} />}</ModalBody>
          <ModalFooter>
            <Button onClick={onItemModalClose}>
              <FormattedMessage id="GENERAL_CANCEL" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CREATE DROP MODAL */}
      <Modal isOpen={isDropModalOpen} onClose={onDropModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage id="MODAL_HEADER_CREATE_BOX" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Drop form</ModalBody>
          <ModalFooter>
            <Button onClick={onDropModalClose}>
              <FormattedMessage id="GENERAL_CANCEL" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoxesPage;
