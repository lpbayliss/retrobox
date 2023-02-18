import { ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Center,
  Circle,
  Divider,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  ScaleFade,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CreateItemForm } from '@components/create-item-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { CycleStatus, Reaction } from '@prisma/client';
import { useFlag } from '@unleash/proxy-client-react';
import { format } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const getStatusColor = (status: CycleStatus) => {
  if (status === CycleStatus.PENDING) return 'green';
  if (status === CycleStatus.OPEN) return 'blue';
  if (status === CycleStatus.CLOSED) return 'red';
  return 'grey';
};

const getStatusText = (status: CycleStatus) => {
  if (status === CycleStatus.PENDING) return 'OPEN';
  if (status === CycleStatus.OPEN) return 'UNDER REVIEW';
  if (status === CycleStatus.CLOSED) return 'CLOSED';
  return 'Unknown Status';
};

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: false });

const ProjectPage: NextPage = () => {
  // const { data } = useSession();
  // const intl = useIntl();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const createItemEnabled = useFlag('create-item');
  const createDropEnabled = useFlag('create-drop'); // Create cycle

  const [recentlyCreated, setRecentlyCreated] = useState<boolean>(false);

  const { data: project } = trpc.project.fetchById.useQuery({ id: String(router.query['id']) });

  const createCycleMutation = trpc.cycle.create.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate();
      setRecentlyCreated(true);
      setTimeout(() => {
        setRecentlyCreated(false);
      }, 5000);
    },
  });

  const createReactionMutation = trpc.item.addReaction.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate();
    },
  });

  const handleCreateCycle = () => {
    if (!project) return;
    createCycleMutation.mutateAsync({ id: project.id });
  };

  const revealCycleMutation = trpc.cycle.reveal.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate();
    },
  });

  const handleRevealCycle = (cycleId: string) => () => {
    if (!project) return;
    revealCycleMutation.mutateAsync({ id: cycleId });
  };

  const closeCycleMutation = trpc.cycle.close.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate();
      if (!project) return;
      createCycleMutation.mutateAsync({ id: project.id });
    },
  });

  const handleCloseCycle = (cycleId: string) => () => {
    if (!project) return;
    closeCycleMutation.mutateAsync({ id: cycleId });
  };

  const handleItemReaction = (itemId: string, reaction: Reaction) => () => {
    createReactionMutation.mutateAsync({
      id: itemId,
      type: reaction,
    });
  };

  return (
    <>
      <Head>
        <title>{`Retrobox | ${project?.name}`}</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* Page Heading */}
      <Box as="section" mb="3">
        <Breadcrumb mb={4} separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <NextLink href="/app" passHref>
              <BreadcrumbLink as="span">Home</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/app/projects" passHref>
              <BreadcrumbLink as="span">Projects</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <NextLink href={`/app/projects/${project?.id || null}`} passHref>
              <BreadcrumbLink as="span">Design Box</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h2" mb="2" size="2xl">
          Design Box
        </Heading>
      </Box>

      {/* Badges */}
      <VStack alignItems="left" mb={8} spacing={6}>
        <HStack>
          <Badge colorScheme="blue">{project?.isPublic ? 'Public' : 'Private'}</Badge>
          <Badge colorScheme="blue">Created by {project?.createdBy.name || 'Unknown'}</Badge>
        </HStack>
      </VStack>

      {project?.cycles.map((cycle, index) => (
        <ScaleFade key={cycle.id} delay={0.03 * index} in={true} initialScale={0.9}>
          <Card
            w="full"
            mb="6"
            borderWidth="2px"
            borderStyle="solid"
            borderColor={recentlyCreated && index === 0 ? 'blue.300' : 'transparent'}
            transition="border"
            transitionDuration="400ms"
          >
            {/* Title Row */}
            <HStack p="6">
              <HStack fontWeight="semibold" spacing={4}>
                <Heading size="lg">{`${format(cycle.startDate, 'PP')} ${
                  cycle.endDate ? ' - ' + format(cycle.endDate, 'PP') : ''
                }`}</Heading>
                <HStack>
                  <Circle bg={`${getStatusColor(cycle.status)}.300`} size="3" />
                  <Text color={`${getStatusColor(cycle.status)}.300`}>
                    {getStatusText(cycle.status)}
                  </Text>
                </HStack>
              </HStack>
              <Spacer />
              <Button color="red" variant="solid">
                {cycle.items.length} items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  {cycle.status === CycleStatus.PENDING && (
                    <MenuItemOption
                      disabled={cycle.status !== CycleStatus.PENDING}
                      onClick={handleRevealCycle(cycle.id)}
                    >
                      Review
                    </MenuItemOption>
                  )}
                  {cycle.status === CycleStatus.OPEN && (
                    <MenuItemOption
                      disabled={cycle.status !== CycleStatus.OPEN}
                      onClick={handleCloseCycle(cycle.id)}
                    >
                      Close
                    </MenuItemOption>
                  )}
                  <MenuItemOption>Rename</MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>

            {/* Divider (When open) */}
            <Divider bg="gray.200" />

            {/* Add Item Form */}
            {cycle.status !== CycleStatus.CLOSED && createItemEnabled && (
              <CreateItemForm p="6" boxId={cycle.id} />
            )}

            {/* Item Display */}
            {!!cycle.items.length && (
              <TileGrid
                pos="relative"
                maxH="500px"
                overflowY={cycle.status === CycleStatus.PENDING ? 'hidden' : 'auto'}
                overflowX="hidden"
                p="6"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'white',
                    borderRadius: '24px',
                  },
                }}
              >
                {cycle.status === CycleStatus.PENDING && (
                  <Center
                    pos="absolute"
                    zIndex="overlay"
                    top={-1}
                    right={-1}
                    bottom={-1}
                    left={-1}
                    bg="rgba(255,255,255,0.5)"
                    backdropFilter="blur(5px)"
                  >
                    <VStack>
                      <HStack>
                        <AvatarGroup max={2} size="sm">
                          {cycle.contributors.map((user, index) => (
                            <>
                              {user && (
                                <Avatar
                                  key={`${cycle.id}-user-${user.id}`}
                                  name={user.name || 'Unknown'}
                                />
                              )}
                              {!user && (
                                <Avatar key={`${cycle.id}-anon-${index}`} name="Anonymous" />
                              )}
                            </>
                          ))}
                        </AvatarGroup>
                        <Text>{`${cycle.contributors.length} have contributed`}</Text>
                      </HStack>
                      <Button
                        colorScheme="blue"
                        onClick={handleRevealCycle(cycle.id)}
                        variant={'outline'}
                      >
                        Review
                      </Button>
                    </VStack>
                  </Center>
                )}
                {cycle.items.map((item) => (
                  <TileGridItem key={item.id}>
                    <Card h="32" p="4">
                      <VStack>
                        <Text w="full">{item.content}</Text>
                        <HStack justifyContent="flex-start" w="full" pb="4">
                          <Button
                            aria-label="like-item"
                            disabled={cycle.status !== CycleStatus.OPEN}
                            leftIcon={<Icon icon={faThumbsUp} />}
                            onClick={handleItemReaction(item.id, Reaction.LIKE)}
                            size="xs"
                          >
                            {
                              item.itemReaction.filter(
                                (item) => item.reactionType === Reaction.LIKE,
                              ).length
                            }
                          </Button>
                          <Button
                            aria-label="dislike-item"
                            disabled={cycle.status !== CycleStatus.OPEN}
                            leftIcon={<Icon icon={faThumbsDown} />}
                            onClick={handleItemReaction(item.id, Reaction.DISLIKE)}
                            size="xs"
                          >
                            {
                              item.itemReaction.filter(
                                (item) => item.reactionType === Reaction.DISLIKE,
                              ).length
                            }
                          </Button>
                        </HStack>
                        <HStack justifyContent="space-between" w="full">
                          {item.createdBy && (
                            <HStack>
                              <Avatar name={item.createdBy.name || 'Unknown'} size="2xs" />
                              <Text fontSize="sm">{item.createdBy.name || 'Unknown'}</Text>
                            </HStack>
                          )}
                          {!item.createdBy && (
                            <HStack>
                              <Avatar name="Anonymous" size="2xs" />
                              <Text fontSize="sm">Anonymous</Text>
                            </HStack>
                          )}
                          <Text fontSize="sm">{format(item.createdAt, 'PP')}</Text>
                        </HStack>
                      </VStack>
                    </Card>
                  </TileGridItem>
                ))}
              </TileGrid>
            )}
          </Card>
        </ScaleFade>
      ))}

      {/* No Cycles Display */}
      {!project?.cycles.length && (
        <Center>
          <Card w="full" p="6">
            <VStack spacing={4}>
              <Text>
                There doesn&apos;t appear to be much going on here just yet. You can get started by
                making creating your first cycle!
              </Text>
              <Text>
                After your first cycle a new one will be created each time you close out an active
                cycle.
              </Text>
              <Button colorScheme="blue" disabled={!createDropEnabled} onClick={handleCreateCycle}>
                Create cycle
              </Button>
            </VStack>
          </Card>
        </Center>
      )}
    </>
  );
};

export default ProjectPage;
