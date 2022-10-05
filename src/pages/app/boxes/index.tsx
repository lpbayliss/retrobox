import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Heading,
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
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';
import { TileGrid, TileGridItem } from '@components/tile-grid';
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { PropsWithChildren, useState } from 'react';
import { FormattedMessage } from 'react-intl';

type CardLinkProps = { href: string; highlight?: boolean };
const CardLink = ({ href, highlight, children }: PropsWithChildren<CardLinkProps>) => (
  <NextLink href={href} passHref>
    <Card
      as="a"
      h="full"
      borderColor={highlight ? 'blue.300' : 'transparent'}
      borderStyle="solid"
      borderWidth="2px"
      transition="border"
      transitionDuration="400ms"
      _hover={{ borderColor: 'whiteAlpha.300' }}
    >
      {children}
    </Card>
  </NextLink>
);

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const BoxesPage: NextPage = () => {
  const createBoxEnabled = useFlag('create-box');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: boxes } = trpc.box.fetchAll.useQuery();
  const { data: recentBoxes } = trpc.box.fetchRecentlyViewed.useQuery();

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

  return (
    <>
      <Head>
        <title>Retrobox | Boxes</title>
        <meta name="description" content="Retrobox home" />
      </Head>
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
        </Breadcrumb>
      </Box>

      {recentBoxes && (
        <Box as="section" mb="6">
          <Heading as="h3" mb="4">
            <FormattedMessage id="BOXES_PAGE_HEADING_RECENT" />
          </Heading>
          <TileGrid>
            {recentBoxes &&
              recentBoxes.map((box, index) => (
                <ScaleFade key={box.id} delay={0.03 * index} in={true} initialScale={0.9}>
                  <TileGridItem>
                    <CardLink href={`/app/boxes/${box.id}`}>
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
        </Box>
      )}

      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          <FormattedMessage id="BOXES_PAGE_HEADING_ALL" />
        </Heading>
        <TileGrid>
          {createBoxEnabled && (
            <TileGridItem>
              <Card as={Button} variant="outline" h="full" w="full" onClick={onOpen}>
                <Center flexDir="column">
                  <Icon mb="2" fontSize="25" icon={faPlusCircle} />
                  <Text fontSize="xl">
                    <FormattedMessage id="BUTTON_CREATE_BOX" />
                  </Text>
                </Center>
              </Card>
            </TileGridItem>
          )}
          {boxes &&
            boxes.map((box, index) => (
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
      </Box>

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

export default BoxesPage;
