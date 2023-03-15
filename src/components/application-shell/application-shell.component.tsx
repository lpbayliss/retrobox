import {
  Button,
  Flex,
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
  VStack,
} from '@chakra-ui/react';
import { SignInForm } from '@components/sign-in-form';
import { PropsWithChildren, useState } from 'react';

const ApplicationShell = ({ children }: PropsWithChildren<{}>) => {
  // const { data } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [signInStatus, setSignStatus] = useState<'SUCCESS' | 'ERROR' | null>(null);
  const handleSignInSuccess = () => setSignStatus('SUCCESS');
  const handleSignInError = () => setSignStatus('ERROR');
  const handleSignInOnClick = () => {
    onOpen();
  };
  const handleSignInOnClose = () => {
    setSignStatus(null);
    onClose();
  };

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      w="full"
      minW="md"
      maxW="4xl"
      h="100vh"
      mx="auto"
    >
      <Flex
        as="main"
        direction="column"
        overflow="auto"
        w="full"
        h="full"
        p={['4', null, '8']}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {children}
      </Flex>
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
    </Flex>
  );
};

export default ApplicationShell;
