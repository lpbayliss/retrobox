import { ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Center,
  Circle,
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
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { CycleStatus } from '@prisma/client';
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
  // const createItemEnabled = useFlag('create-item');
  const createDropEnabled = useFlag('create-drop');
  // const {
  //   isOpen: isItemModalOpen,
  //   onOpen: onItemModalOpen,
  //   onClose: onItemModalClose,
  // } = useDisclosure();
  // const {
  //   isOpen: isDropModalOpen,
  //   onOpen: onDropModalOpen,
  //   onClose: onDropModalClose,
  // } = useDisclosure();
  // const toast = useToast();

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

  // const handleShareLink = () => {
  //   navigator.clipboard.writeText(window.location.href);
  //   toast({
  //     title: 'Link copied',
  //     description: "We've copied the box link to your clipboard",
  //     status: 'success',
  //     duration: 5000,
  //     isClosable: true,
  //     position: 'top-right',
  //   });
  // };

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

      {/*  Controls */}
      {/* <Card
        as="section"
        w="full"
        mb="6"
        px="6"
        py="3"
        // bg="rgba(255,255,255,0.5)"
        // backdropFilter="blur(5px)"
      >
        <HStack alignContent="center">
          <Spacer />
          <Button
            gap={2}
            aria-label="create new cycle"
            disabled={!project}
            onClick={handleCreateCycle}
          >
            Create Cycle
          </Button>
        </HStack>
      </Card> */}

      {project?.cycles.map((cycle, index) => (
        <ScaleFade key={cycle.id} delay={0.03 * index} in={true} initialScale={0.9}>
          <Card
            w="full"
            mb="6"
            p="6"
            borderWidth="2px"
            borderStyle="solid"
            borderColor={recentlyCreated && index === 0 ? 'blue.300' : 'transparent'}
            transition="border"
            transitionDuration="400ms"
          >
            <HStack>
              {/* <Icon icon={faChevronUp} width="3" /> */}
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
              {/* <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup> */}
              <Button color="red" variant="solid">
                {cycle.items.length} Items
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
