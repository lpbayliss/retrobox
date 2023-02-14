import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Collapse,
  Heading,
  HStack,
  ScaleFade,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CreateBoxForm } from '@components/create-box-form';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const ProjectsPage: NextPage = () => {
  const createBoxEnabled = useFlag('create-box');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: projects } = trpc.project.fetchAll.useQuery();

  const [recentlyCreated, setRecentlyCreated] = useState<boolean>(false);

  const handleOnClose = (created?: boolean) => {
    if (created) {
      setRecentlyCreated(true);
      setTimeout(() => {
        setRecentlyCreated(false);
      }, 5000);
    }

    onClose();
  };

  const handleCreateBoxButtonClick = () => {
    if (isOpen) {
      onClose();
      return;
    }
    onOpen();
  };

  return (
    <>
      <Head>
        <title>Retrobox | Projects</title>
        <meta name="description" content="Retrobox home" />
      </Head>
      {/* Page Heading */}
      <Box as="section" mb="12">
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <NextLink href="/app" passHref>
              <BreadcrumbLink as="span">
                <FormattedMessage id="HOME_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/app/boxes" passHref>
              <BreadcrumbLink as="span">
                <FormattedMessage id="BOXES_PAGE_TITLE" />
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h2" mb="2" size="2xl">
          Your Projects
        </Heading>
      </Box>

      {/*  Controls */}
      <Card
        as="section"
        w="full"
        mb="6"
        p="6"
        bg="rgba(255,255,255,0.5)"
        backdropFilter="blur(5px)"
      >
        <HStack alignContent="center">
          <Spacer />
          {createBoxEnabled && (
            <Button gap={2} aria-label="create new box" onClick={handleCreateBoxButtonClick}>
              {!isOpen && <Text>Create box</Text>}
              {isOpen && <Text>Cancel</Text>}
            </Button>
          )}
        </HStack>
        <Collapse animateOpacity in={isOpen}>
          <CreateBoxForm onClose={handleOnClose} />
        </Collapse>
      </Card>

      {/* Project List */}
      {projects &&
        projects.map((project, index) => (
          <ScaleFade key={project.id} delay={0.03 * index} in={true} initialScale={0.9}>
            <Card
              as="section"
              w="full"
              mb="6"
              p="6"
              bg="rgba(255,255,255,0.5)"
              backdropFilter="blur(5px)"
            >
              {project.name}
            </Card>
          </ScaleFade>
        ))}

      {!projects && (
        <Card
          as="section"
          w="full"
          mb="6"
          p="6"
          bg="rgba(255,255,255,0.5)"
          backdropFilter="blur(5px)"
        >
          <Text color="subtext" fontStyle="italic">
            Create a project to get started
          </Text>
        </Card>
      )}
    </>
  );
};

export default ProjectsPage;
