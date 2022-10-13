import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Checkbox,
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CardLink } from '@components/card-link';
import { CreateItemForm } from '@components/create-item-form';
import { PageSection } from '@components/page-section';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faPlus, faShareSquare } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: false });

const BoxesPage: NextPage = () => {
  const { data } = useSession();
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
  const toast = useToast();

  const { data: box } = trpc.box.fetchById.useQuery({ id: String(router.query['boxId']) });
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

  const [confirmCreateDrop, setConfirmCreateDrop] = useState<boolean>(false);

  const handleCreateBox = () => {
    if (!box) {
      onDropModalClose();
      return;
    }
    createDropMutation.mutateAsync({ id: box.id });
    onDropModalClose();
    setConfirmCreateDrop(false);
  };

  const handleCheckboxOnChange = () => {
    setConfirmCreateDrop(!confirmCreateDrop);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied',
      description: "We've copied the box link to your clipboard",
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <>
      <Head>
        <title>Retrobox | {box?.name || 'Unknown'}</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* BREADCRUMBS */}
      {data?.user && box && (
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
              {box.isPublic && (
                <IconButton
                  aria-label="edit-name"
                  icon={<Icon icon={faShareSquare} />}
                  onClick={handleShareLink}
                  size="sm"
                />
              )}
            </HStack>
            {box.isPublic && (
              <Text color="subtext" fontSize="sm">
                Public Box
              </Text>
            )}
            <Text color="subtext" fontSize="sm">
              {box.team?.name || 'Personal'}
            </Text>
            {box.createdBy.id === data?.user.id ? (
              <Text color="subtext" fontSize="sm">
                Created by you
              </Text>
            ) : (
              <Text color="subtext" fontSize="sm">
                <FormattedMessage
                  id="BOX_PAGE_CREATED_BY_TEXT"
                  values={{ name: box.createdBy.name || 'Unknown' }}
                />
              </Text>
            )}
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
          >
            <Stack direction={['column', null, null, null, 'row']}>
              <Card flex="1" maxH="2xs">
                <VStack gap="2">
                  <Text fontSize="lg">
                    <FormattedMessage id="BOX_PAGE_ITEM_COUNT_CONTAINS" />
                  </Text>
                  <Text fontSize="4xl" fontWeight="bold">
                    <FormattedMessage
                      id="BOX_PAGE_ITEM_COUNT"
                      values={{
                        itemCount: box.items.length || 0,
                      }}
                    />
                  </Text>
                  <Text fontSize="lg">
                    <FormattedMessage
                      id="BOX_PAGE_ITEM_COUNT_FROM"
                      values={{
                        contributorCount: Object.keys(contributors).length || 0,
                      }}
                    />
                  </Text>
                </VStack>
              </Card>
              <Card flex="1" maxH="2xs">
                {!!Object.keys(contributors).length && (
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
                )}
                {!Object.keys(contributors).length && (
                  <Text m="auto" color="subtext" fontStyle="italic">
                    Add items to see your contribution to the next drop
                  </Text>
                )}
              </Card>
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
                  disabled={!box.items.length || !data?.user}
                  onClick={onDropModalOpen}
                >
                  <Icon icon={faPlus} />
                  <Text>
                    <FormattedMessage id="BUTTON_CREATE_DROP" />
                  </Text>
                </Button>
              ) : undefined
            }
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
          <ModalBody>
            {box && <CreateItemForm boxId={box.id} onSubmit={onItemModalClose} />}
          </ModalBody>
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
          <ModalHeader>Create drop</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Creating a drop will empty all of the current items from this box and cannot be
              undone. Are you sure you want to empty the box right now?
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Checkbox isChecked={confirmCreateDrop} onChange={handleCheckboxOnChange}>
                I am sure
              </Checkbox>
              <Button disabled={!confirmCreateDrop} onClick={handleCreateBox}>
                Create
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoxesPage;
