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
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useFlag } from '@unleash/proxy-client-react';
import { ToggleProp, withToggles } from '@lib/unleash';
import { FormattedMessage } from 'react-intl';
import { SessionProp, withServerSideSession } from '@lib/auth';
import { useRouter } from 'next/router';
import { SignInForm } from '@components/sign-in-form';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: await withToggles(await withServerSideSession(context)({})),
  };
};

const Index: NextPage = () => {
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
    <Box>
      <Head>
        <title>Welcome to Retrobox</title>
        <meta name="description" content="Welcome" />
      </Head>
      <Box as="section" py="7.5rem">
        <Box maxW={{ base: 'xl', md: '5xl' }} mx="auto" px={{ base: '6', md: '8' }}>
          <Box textAlign="center">
            <Heading
              as="h1"
              maxW="48rem"
              mx="auto"
              fontWeight="extrabold"
              lineHeight="1.2"
              letterSpacing="tight"
              size="3xl"
            >
              <FormattedMessage id="HOME_PAGE_TITLE" />
            </Heading>
            <Text maxW="xl" mt="4" mx="auto" fontSize="xl">
              <FormattedMessage id="HOME_PAGE_SUBTEXT" />
            </Text>
          </Box>

          <Stack
            justify="center"
            direction={{ base: 'column', md: 'row' }}
            mt="10"
            mb="20"
            spacing="4"
          >
            {customSignInEnabled && (
              <Button
                as="a"
                px="8"
                fontSize="md"
                fontWeight="bold"
                colorScheme="blue"
                onClick={handleSignInOnClick}
                size="lg"
              >
                <FormattedMessage id="HOME_PAGE_SIGN_IN" />
              </Button>
            )}
            <Button as="a" px="8" fontSize="md" fontWeight="bold" href="#" size="lg">
              <FormattedMessage id="HOME_PAGE_LEARN_MORE" />
            </Button>
          </Stack>
          <Box className="group" pos="relative" overflow="hidden" shadow="md" rounded="lg">
            <Img
              alt="Screenshot of Envelope App"
              src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621085270/pro-website/app-screenshot-light_kit2sp.png"
            />
          </Box>
        </Box>
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
    </Box>
  );
};

export default Index;
