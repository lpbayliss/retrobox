import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Center,
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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CardLink } from '@components/card-link';
import { CreateBoxForm } from '@components/create-box-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faEllipsisV, faPlus } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
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
  const { data: boxes } = trpc.project.fetchAll.useQuery();

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

  const showAllList = boxes && !!boxes.length;

  return (
    <>
      <Head>
        <title>Retrobox | Boxes</title>
        <meta name="description" content="Retrobox home" />
      </Head>
      <Box as="section" mb="12">
        <Heading as="h2" mb="2" size="2xl">
          <FormattedMessage id="BOXES_PAGE_TITLE" />
        </Heading>
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
      </Box>

      <Card
        as="section"
        w="full"
        mb="12"
        p="6"
        bg="rgba(255,255,255,0.5)"
        backdropFilter="blur(5px)"
      >
        <HStack mb="4">
          <Heading as="h3">
            <FormattedMessage id="BOXES_PAGE_HEADING_ALL" />
          </Heading>
          <Spacer />
          {createBoxEnabled && (
            <Button gap={2} aria-label="create new box" onClick={onOpen}>
              <Icon icon={faPlus} />
              <Text>Create box</Text>
            </Button>
          )}
          <IconButton aria-label="more options" icon={<Icon icon={faEllipsisV} />} />
        </HStack>
        {showAllList && (
          <TileGrid>
            {boxes.map((box, index) => (
              <ScaleFade key={box.id} delay={0.03 * index} in={true} initialScale={0.9}>
                <TileGridItem>
                  <CardLink
                    href={`/app/boxes/${box.id}`}
                    highlight={recentlyCreated && index === 0}
                  >
                    <Center flexDir="column">
                      <Heading as="h4" mb="4" size="md">
                        {box.name}
                      </Heading>
                      <Text>A description about the box.</Text>
                    </Center>
                  </CardLink>
                </TileGridItem>
              </ScaleFade>
            ))}
          </TileGrid>
        )}
        {!showAllList && (
          <Text color="subtext" fontStyle="italic">
            Your boxes will appear here
          </Text>
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage id="MODAL_HEADER_CREATE_BOX" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateBoxForm onClose={handleOnClose} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>
              <FormattedMessage id="GENERAL_CANCEL" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectsPage;
