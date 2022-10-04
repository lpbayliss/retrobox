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
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import type { Box as PrismaBox } from '@prisma/client';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

const BoxDisplay = ({ box }: { box: Partial<PrismaBox> }) => (
  <NextLink href="/app/boxes/abc" passHref>
    <Card as="a">
      <Center flexDir="column">
        <Heading as="h4" mb="4" size="md">
          {box.name}
        </Heading>
        <Text>A description about the box.</Text>
      </Center>
    </Card>
  </NextLink>
);

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const AppPage: NextPage = () => {
  const createBoxEnabled = useFlag('create-box');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: boxes } = trpc.box.fetchAll.useQuery();

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
            <BreadcrumbLink href="/">
              <FormattedMessage id="HOME_PAGE_TITLE" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/boxes">
              <FormattedMessage id="BOXES_PAGE_TITLE" />
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          <FormattedMessage id="BOXES_PAGE_HEADING_RECENT" />
        </Heading>
        <Wrap py="2" spacing="6"></Wrap>
      </Box>

      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          <FormattedMessage id="BOXES_PAGE_HEADING_ALL" />
        </Heading>
        <Wrap py="2" spacing="6">
          {createBoxEnabled && (
            <WrapItem>
              <Card as={Button} variant="outline" h="full" onClick={onOpen}>
                <Center flexDir="column">
                  <Icon icon={faPlusCircle} fontSize="25" mb="2" />
                  <Text fontSize="xl">
                    <FormattedMessage id="BUTTON_CREATE_BOX" />
                  </Text>
                </Center>
              </Card>
            </WrapItem>
          )}
          {boxes &&
            boxes.map((box) => (
              <WrapItem key={box.id}>
                <BoxDisplay box={box} />
              </WrapItem>
            ))}
        </Wrap>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage id="MODAL_HEADER_CREATE_BOX" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateBoxForm onClose={onClose} />
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

export default AppPage;
