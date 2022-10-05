import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Grid,
  GridItem,
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
  Wrap,
} from '@chakra-ui/react';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { trpc } from '@lib/trpc';
import { useFlag } from '@unleash/proxy-client-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const AppPage: NextPage = () => {
  const createBoxEnabled = useFlag('create-box');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: boxes } = trpc.box.fetchAll.useQuery();

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
        <Grid gap={3} templateColumns="repeat(auto-fill, minmax(24rem, 1fr))" w="full">
          {createBoxEnabled && (
            <GridItem colSpan={1}>
              <Card as={Button} variant="outline" h="full" w="full" onClick={onOpen}>
                <Center flexDir="column">
                  <Icon mb="2" fontSize="25" icon={faPlusCircle} />
                  <Text fontSize="xl">
                    <FormattedMessage id="BUTTON_CREATE_BOX" />
                  </Text>
                </Center>
              </Card>
            </GridItem>
          )}
          {boxes &&
            boxes.map((box, index) => (
              <ScaleFade key={box.id} in={true} initialScale={0.9}>
                <GridItem colSpan={1}>
                  <NextLink href="/app/boxes/abc" passHref>
                    <Card
                      as="a"
                      h="full"
                      borderColor={index === 0 && recentlyCreated ? 'blue.300' : 'transparent'}
                      transition="border"
                      transitionDuration="200ms"
                      borderStyle="solid"
                      borderWidth="2px"
                    >
                      <Center flexDir="column">
                        <Heading as="h4" mb="4" size="md">
                          {box.name}
                        </Heading>
                        <Text>A description about the box.</Text>
                      </Center>
                    </Card>
                  </NextLink>
                </GridItem>
              </ScaleFade>
            ))}
        </Grid>
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

export default AppPage;
