import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { CreateItemForm } from '@components/create-item-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import {
  faChevronDown,
  faChevronUp,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { trpc } from '@lib/trpc';
import { CycleStatus, Reaction } from '@prisma/client';
import { useFlag } from '@unleash/proxy-client-react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

const getSentimentColor = (sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL') => {
  if (sentiment === 'POSITIVE') return 'green';
  if (sentiment === 'NEGATIVE') return 'red';
  if (sentiment === 'NEUTRAL') return 'grey';
  return 'grey';
};

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

interface CycleTitleProps {
  start: Date;
  end?: Date | null;
  status: CycleStatus;
  onClick?: () => any;
}

const CycleTitle = ({ start, end = null, status, onClick }: CycleTitleProps) => {
  const handleOnClick = () => {
    if (onClick) onClick();
  };

  const heading = `${format(start, 'PP')} ${end ? ' - ' + format(end, 'PP') : ''}`;

  return (
    <HStack fontWeight="semibold" cursor="pointer" spacing={4}>
      <Heading onClick={handleOnClick} size="lg">
        {heading}
      </Heading>
      <HStack>
        <Circle bg={`${getStatusColor(status)}.300`} size="3" />
        <Text color={`${getStatusColor(status)}.300`}>{getStatusText(status)}</Text>
      </HStack>
    </HStack>
  );
};

interface CycleMenuProps {
  status: CycleStatus;
  onReview?: () => any;
  onClose?: () => any;
  onRename?: () => any;
}

const CycleMenu = ({ status, onClose, onReview, onRename }: CycleMenuProps) => {
  const handleOnReview = () => {
    if (onReview) onReview();
  };

  const handleOnClose = () => {
    if (onClose) onClose();
  };

  const handleOnRename = () => {
    if (onRename) onRename();
  };

  return (
    <Menu>
      <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="ghost" />
      <MenuList>
        {status === CycleStatus.PENDING && (
          <MenuItemOption disabled={status !== CycleStatus.PENDING} onClick={handleOnReview}>
            Review
          </MenuItemOption>
        )}
        {status === CycleStatus.OPEN && (
          <MenuItemOption disabled={status !== CycleStatus.OPEN} onClick={handleOnClose}>
            Close
          </MenuItemOption>
        )}
        {/* <MenuItemOption>Rename</MenuItemOption> */}
      </MenuList>
    </Menu>
  );
};

interface CycleOverlayProps {
  display: boolean;
  id: string;
  contributors: ({ id: string; name: string | null } | null)[];
  onReveal?: () => any;
}

const CycleOverlay = ({ display, id, contributors, onReveal }: CycleOverlayProps) => {
  const { data: sessionData } = useSession();

  if (!display) return null;

  const handleRevealCycle = () => {
    if (onReveal) onReveal();
  };

  return (
    <Center pos="absolute" top={0} right={0} bottom={0} left={0}>
      <VStack>
        {contributors && (
          <HStack>
            <AvatarGroup max={2} size="sm">
              {contributors.map((user, index) => (
                <Text key="">
                  {user && <Avatar key={`${id}-user-${user.id}`} name={user.name || 'Unknown'} />}
                  {!user && <Avatar key={`${id}-anon-${index}`} name="Anonymous" />}
                </Text>
              ))}
            </AvatarGroup>
            <Text>{`${contributors.length} have contributed`}</Text>
          </HStack>
        )}
        <Button colorScheme="blue" isDisabled={!sessionData?.user} onClick={handleRevealCycle}>
          Review
        </Button>
      </VStack>
    </Center>
  );
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
  const { data: sessionData } = useSession();
  const createItemEnabled = useFlag('create-item');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeCycleDisclosure = useDisclosure();
  const trpcContext = trpc.useContext();

  const { data: items, refetch: fetchItems } = trpc.cycle.fetchItems.useQuery(
    { id: cycleId },
    { enabled: false },
  );
  const { data: contributors, refetch: fetchContributors } = trpc.cycle.fetchContributors.useQuery(
    { id: cycleId },
    { enabled: false },
  );

  const revealCycleMutation = trpc.cycle.reveal.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate({ id: projectId });
    },
  });

  const closeCycleMutation = trpc.cycle.close.useMutation({
    onSuccess() {
      trpcContext.project.fetchById.invalidate({ id: projectId });
    },
  });

  const createReactionMutation = trpc.item.addReaction.useMutation({
    onSuccess() {
      fetchItems();
    },
  });

  const handleRevealCycle = (cycleId: string) => () => {
    revealCycleMutation.mutateAsync({ id: cycleId });
    if (onRevealCycle) onRevealCycle();
  };

  const handleCloseCycle = (cycleId: string) => () => {
    closeCycleMutation.mutateAsync({ id: cycleId });
    if (onCloseCycle) onCloseCycle();
    closeCycleDisclosure.onClose();
  };

  const handleItemReaction = (itemId: string, reaction: Reaction) => () => {
    createReactionMutation.mutateAsync({
      id: itemId,
      type: reaction,
    });
  };

  const handleItemCreated = () => {
    fetchItems();
    fetchContributors();
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
    <>
      <Card
        zIndex="base"
        w="full"
        mb="6"
        p={4}
        borderWidth="2px"
        borderStyle="solid"
        borderColor={highlight ? 'blue.300' : 'transparent'}
        transition="border"
        transitionDuration="400ms"
      >
        <HStack justifyContent="space-between" w="full">
          <CycleTitle start={startDate} end={endDate} status={status} />
          <HStack>
            <ScaleFade in={status === CycleStatus.OPEN}>
              <Button
                colorScheme="red"
                isDisabled={!sessionData?.user}
                onClick={closeCycleDisclosure.onOpen}
                variant="ghost"
              >
                Close
              </Button>
            </ScaleFade>
            <IconButton
              aria-label="Test"
              icon={isOpen ? <Icon icon={faChevronUp} /> : <Icon icon={faChevronDown} />}
              onClick={handleCycleCardClicked}
              variant="ghost"
            />
          </HStack>
        </HStack>

        <Box as={Collapse} w="full" animateOpacity in={isOpen}>
          {/* Add Item Form */}
          {status !== CycleStatus.CLOSED && createItemEnabled && (
            <Card w="full" mt={4} p="4" shadow="none" variant="outline">
              <CreateItemForm boxId={cycleId} w="full" onSubmit={handleItemCreated} />
            </Card>
          )}

          {/* Item Display */}
          {items && !!items.length && (
            <TileGrid
              pos="relative"
              mt={4}
              maxH="500px"
              overflowY={status === CycleStatus.PENDING ? 'hidden' : 'auto'}
              overflowX="hidden"
            >
              {items.map((item) => (
                <TileGridItem
                  key={item.id}
                  filter={status === CycleStatus.PENDING ? 'blur(5px)' : ''}
                >
                  <Card h="32" p="4" shadow={'none'} variant="outline">
                    <VStack>
                      <Text overflow="hidden" w="full" isTruncated>
                        {item.content}
                      </Text>
                      <HStack justifyContent="flex-start" w="full" pb="4">
                        <Button
                          aria-label="like-item"
                          disabled={status !== CycleStatus.OPEN}
                          isDisabled={!sessionData?.user}
                          leftIcon={<Icon icon={faThumbsUp} />}
                          onClick={handleItemReaction(item.id, Reaction.LIKE)}
                          size="xs"
                        >
                          {
                            item.itemReaction.filter((item) => item.reactionType === Reaction.LIKE)
                              .length
                          }
                        </Button>
                        <Button
                          aria-label="dislike-item"
                          disabled={status !== CycleStatus.OPEN}
                          isDisabled={!sessionData?.user}
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
                        <Badge colorScheme={getSentimentColor(item.sentiment)}>
                          {item.sentiment}
                        </Badge>
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
              <CycleOverlay
                display={status === CycleStatus.PENDING}
                contributors={contributors || []}
                id={cycleId}
                onReveal={handleRevealCycle(cycleId)}
              />
            </TileGrid>
          )}
        </Box>
      </Card>
      <Modal
        blockScrollOnMount={false}
        isOpen={closeCycleDisclosure.isOpen}
        onClose={closeCycleDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="flex-start">
              <Text>
                Closing a cycle cannot be undone. You will not be able to add any addition items but
                will still be able to view them.
              </Text>
              <Text>Are you sure you want to close this cycle?</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={closeCycleDisclosure.onClose} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleCloseCycle(cycleId)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CycleDisplay;
