import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Center,
  Collapse,
  Heading,
  HStack,
  ScaleFade,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CycleDisplay } from '@components/cycle-display';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({});

const ProjectPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const createDropEnabled = useFlag('create-drop'); // Create cycle
  const [recentlyCreated, setRecentlyCreated] = useState<boolean>(false);
  const { data: project, error } = trpc.project.fetchById.useQuery({
    id: String(router.query['id']),
  });
  const trpcContext = trpc.useContext();

  useEffect(() => {
    if (error?.data?.code === 'FORBIDDEN') router.push('/');
  }, [error, router]);

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

  const handleCloseCycle = () => {
    if (!project) return;
    createCycleMutation.mutateAsync({ id: project.id });
  };

  return (
    <>
      <Head>
        <title>{`Retrobox | ${project?.name}`}</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      {/* Page Heading */}
      <Box as="section" mb="3">
        {sessionData?.user && (
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
                <BreadcrumbLink as="span">{project?.name}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
        <Heading as="h2" mb="2" size="2xl">
          {project?.name || 'Project 404 (Not Found)'}
        </Heading>
      </Box>

      {/* Badges */}
      <VStack alignItems="left" mb={8} spacing={6}>
        <HStack>
          <Badge colorScheme="blue">{project?.isPublic ? 'Public' : 'Private'}</Badge>
          <Badge colorScheme="blue">Created by {project?.createdBy.name || 'Unknown'}</Badge>
        </HStack>
      </VStack>

      <Collapse animateOpacity in={!sessionData?.user}>
        <Stack py={4} spacing={4}>
          <Alert status="info">
            <AlertIcon />
            <Text>
              <Text as="span">
                You can still add items to cycles while not logged in, but you will not be able to
                vote on items during the review phase.{' '}
              </Text>
              <Text as="span" textDecor={'underline'}>
                <NextLink href={'/'}>Click here</NextLink>
              </Text>
              <Text as="span"> If you want to log in.</Text>
            </Text>
          </Alert>
        </Stack>
      </Collapse>

      {project?.cycles.map((cycle, index) => (
        <ScaleFade key={cycle.id} delay={0.03 * index} in={true} initialScale={0.9}>
          <CycleDisplay
            key={cycle.id}
            projectId={project.id}
            highlight={recentlyCreated && index === 0}
            cycleId={cycle.id}
            startDate={cycle.startDate}
            endDate={cycle.endDate}
            status={cycle.status}
            summary={cycle.summary}
            onCloseCycle={handleCloseCycle}
          />
        </ScaleFade>
      ))}

      {/* No Cycles Display */}
      {!project?.cycles.length && (
        <Center>
          <Card w="full" p="6">
            <VStack textAlign="center" spacing={4}>
              <Text>
                There doesn&apos;t appear to be much going on here just yet. You can get started by
                making creating your first cycle!
              </Text>
              <Text>
                After your first cycle a new one will be created each time you close out an active
                cycle.
              </Text>
              <Button
                colorScheme="blue"
                isDisabled={!createDropEnabled || !sessionData?.user}
                onClick={handleCreateCycle}
              >
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
