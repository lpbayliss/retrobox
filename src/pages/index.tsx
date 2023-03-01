import {
  Box,
  Button,
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SignInForm } from '@components/sign-in-form';
import { withDefaultServerSideProps } from '@lib/props';
import { useFlag } from '@unleash/proxy-client-react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: false });

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { data } = useSession();
  const customSignInEnabled = useFlag('custom-login');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signInStatus, setSignStatus] = useState<'SUCCESS' | 'ERROR' | null>(null);

  const handleSignInSuccess = () => setSignStatus('SUCCESS');
  const handleSignInError = () => setSignStatus('ERROR');
  const handleSignInOnClick = () => {
    if (data?.user) {
      router.push('/app');
      return;
    }
    onOpen();
  };
  const handleSignInOnClose = () => {
    setSignStatus(null);
    onClose();
  };

  return (
    <>
      <Head>
        <title>Retrobox | Welcome</title>
        <meta name="description" content="Welcome" />
      </Head>
      <Box as="section" maxW={{ base: 'xl', md: '5xl' }} mx="auto" px={{ base: '6', md: '8' }}>
        <VStack textAlign="center" spacing={4}>
          <Heading
            as="h1"
            maxW="48rem"
            mx="auto"
            fontWeight="extrabold"
            lineHeight="1.2"
            letterSpacing="tight"
            size="3xl"
          >
            Retrobox
          </Heading>
          <Text maxW="2xl" mx="auto" fontSize={['2xl', null, '4xl']}>
            The super simple retrospective tool for keeping track of your items.
          </Text>
          <Box py="6">
            <Img
              overflow="hidden"
              w={['300px', '500px', '800px']}
              mx="auto"
              alt="Landing"
              rounded="lg"
              src="/illustration.png"
            />
          </Box>
          <Text maxW="xl" mx="auto" fontSize="xl">
            <FormattedMessage id="INDEX_PAGE_SUBTEXT" />
          </Text>
          {customSignInEnabled && (
            <Button
              as="a"
              px="16"
              fontSize="md"
              fontWeight="bold"
              colorScheme="blue"
              onClick={handleSignInOnClick}
              rounded="full"
              size="lg"
            >
              Sign in with a magic link
            </Button>
          )}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            {!signInStatus && (
              <SignInForm onSignInSuccess={handleSignInSuccess} onSignInError={handleSignInError} />
            )}
            {signInStatus === 'SUCCESS' && (
              <VStack>
                <Heading>Confirm your email</Heading>
                <Text>We have just sent a magic link to your inbox</Text>
                <Text>Click the link in the email to log in or sign up.</Text>
                <Button onClick={handleSignInOnClose}>Close</Button>
              </VStack>
            )}
            {signInStatus === 'ERROR' && (
              <VStack>
                <Heading>Uh oh</Heading>
                <Text>Something went wrong. Try again later.</Text>
                <Button onClick={handleSignInOnClose}>Close</Button>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default IndexPage;
