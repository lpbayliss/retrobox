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
import { AppLayout } from '@components/layouts/app-layout';
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons';
import { withServerSideSession } from '@lib/auth';
import { Icon } from '@lib/icon';
import { withToggles } from '@lib/unleash';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

const BoxDisplay = () => (
  <NextLink href="/boxes/abc" passHref>
    <Card as="a">
      <Center flexDir="column">
        <Heading as="h4" mb="4" size="md">
          Box Name
        </Heading>
        <Text>A description about the box.</Text>
      </Center>
    </Card>
  </NextLink>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await withToggles(await withServerSideSession(context)({}));

  if (!props.session?.user)
    return {
      redirect: '/',
      props: {},
    };

  return {
    props,
  };
};

const AppPage: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AppLayout>
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
        <Wrap py="2" spacing="6">
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
        </Wrap>
      </Box>

      <Box as="section" mb="6">
        <Heading as="h3" mb="4">
          <FormattedMessage id="BOXES_PAGE_HEADING_ALL" />
        </Heading>
        <Wrap py="2" spacing="6">
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
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
          <WrapItem>
            <BoxDisplay />
          </WrapItem>
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
    </AppLayout>
  );
};

export default AppPage;
