import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Center,
  Circle,
  Collapse,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { CreateItemForm } from '@components/create-item-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { trpc } from '@lib/trpc';
import { CycleStatus, Reaction } from '@prisma/client';
import { useFlag } from '@unleash/proxy-client-react';
import { format } from 'date-fns';
import { useMemo } from 'react';

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

interface CycleDisplayProps {
  projectId: string;
  highlight: boolean;
  cycleId: string;
  startDate: Date;
  endDate: Date | null;
  status: CycleStatus;
  onRevealCycle?: () => any;
  onCloseCycle?: () => any;
}

const CycleDisplay = ({
  projectId,
  cycleId,
  highlight,
  onRevealCycle,
  onCloseCycle,
  startDate,
  endDate,
  status,
}: CycleDisplayProps) => {
  const createItemEnabled = useFlag('create-item');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trpcContext = trpc.useContext();

  const {
    data: items,
    refetch: fetchItems,
    isLoading: isLoadingItems,
  } = trpc.cycle.fetchItems.useQuery({ id: cycleId }, { enabled: false });
  const {
    data: contributors,
    refetch: fetchContributors,
    isLoading: isLoadingContributors,
  } = trpc.cycle.fetchContributors.useQuery({ id: cycleId }, { enabled: false });

  const isLoadingCycleData = useMemo(() => {
    return isLoadingItems && isLoadingContributors;
  }, [isLoadingContributors, isLoadingItems]);

  const revealCycleMutation = trpc.cycle.reveal.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate({ id: projectId });
      trpcContext.cycle.fetchItems.invalidate({ id: cycleId });
      trpcContext.cycle.fetchContributors.invalidate({ id: cycleId });
    },
  });

  const closeCycleMutation = trpc.cycle.close.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate({ id: projectId });
    },
  });

  const createReactionMutation = trpc.item.addReaction.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate();
    },
  });

  const handleRevealCycle = (cycleId: string) => () => {
    revealCycleMutation.mutateAsync({ id: cycleId });
    if (onRevealCycle) onRevealCycle();
  };

  const handleCloseCycle = (cycleId: string) => () => {
    closeCycleMutation.mutateAsync({ id: cycleId });
    if (onCloseCycle) onCloseCycle();
  };

  const handleItemReaction = (itemId: string, reaction: Reaction) => () => {
    createReactionMutation.mutateAsync({
      id: itemId,
      type: reaction,
    });
  };

  const handleItemCreated = () => {
    trpcContext.project.fetchById.invalidate({ id: projectId });
    trpcContext.cycle.fetchItems.invalidate({ id: cycleId });
    trpcContext.cycle.fetchContributors.invalidate({ id: cycleId });
  };

  const handleCycleCardClicked = () => {
    if (isOpen) {
      onClose();
      return;
    }
    fetchItems();
    fetchContributors();
    onOpen();
  };

  return (
    <Card
      w="full"
      mb="6"
      borderWidth="2px"
      borderStyle="solid"
      borderColor={highlight ? 'blue.300' : 'transparent'}
      transition="border"
      transitionDuration="400ms"
      variant="glass"
    >
      <VStack p={4} spacing={4}>
        {/* Title Row */}
        <HStack justifyContent="space-between" w="full">
          {/* Title + Status */}
          <HStack fontWeight="semibold" spacing={4}>
            <Heading cursor="pointer" onClick={handleCycleCardClicked} size="lg">{`${format(
              startDate,
              'PP',
            )} ${endDate ? ' - ' + format(endDate, 'PP') : ''}`}</Heading>
            <HStack>
              <Circle bg={`${getStatusColor(status)}.300`} size="3" />
              <Text color={`${getStatusColor(status)}.300`}>{getStatusText(status)}</Text>
            </HStack>
          </HStack>
          {/* Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="ghost"
            />
            <MenuList>
              {status === CycleStatus.PENDING && (
                <MenuItemOption
                  disabled={status !== CycleStatus.PENDING}
                  onClick={handleRevealCycle(cycleId)}
                >
                  Review
                </MenuItemOption>
              )}
              {status === CycleStatus.OPEN && (
                <MenuItemOption
                  disabled={status !== CycleStatus.OPEN}
                  onClick={handleCloseCycle(cycleId)}
                >
                  Close
                </MenuItemOption>
              )}
              <MenuItemOption>Rename</MenuItemOption>
            </MenuList>
          </Menu>
        </HStack>

        {!isLoadingCycleData && items && !!items.length && (
          <VStack as={Collapse} w="full" animateOpacity in={isOpen} spacing={4}>
            {/* Add Item Form */}
            {status !== CycleStatus.CLOSED && createItemEnabled && (
              <Card w="full" p="4" variant="outline">
                <CreateItemForm boxId={cycleId} w="full" onSubmit={handleItemCreated} />
              </Card>
            )}

            {/* Item Display */}
            {items && !!items.length && (
              <TileGrid
                pos="relative"
                maxH="500px"
                overflowY={status === CycleStatus.PENDING ? 'hidden' : 'auto'}
                overflowX="hidden"
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
                {status === CycleStatus.PENDING && (
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
                      {contributors && (
                        <HStack>
                          <AvatarGroup max={2} size="sm">
                            {contributors.map((user, index) => (
                              <>
                                {user && (
                                  <Avatar
                                    key={`${cycleId}-user-${user.id}`}
                                    name={user.name || 'Unknown'}
                                  />
                                )}
                                {!user && (
                                  <Avatar key={`${cycleId}-anon-${index}`} name="Anonymous" />
                                )}
                              </>
                            ))}
                          </AvatarGroup>
                          <Text>{`${contributors.length} have contributed`}</Text>
                        </HStack>
                      )}
                      <Button
                        colorScheme="blue"
                        onClick={handleRevealCycle(cycleId)}
                        variant={'outline'}
                      >
                        Review
                      </Button>
                    </VStack>
                  </Center>
                )}
                {items.map((item) => (
                  <TileGridItem key={item.id}>
                    <Card h="32" p="4" variant="outline">
                      <VStack>
                        <Text w="full">{item.content}</Text>
                        <HStack justifyContent="flex-start" w="full" pb="4">
                          <Button
                            aria-label="like-item"
                            disabled={status !== CycleStatus.OPEN}
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
                            disabled={status !== CycleStatus.OPEN}
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
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

export default CycleDisplay;
