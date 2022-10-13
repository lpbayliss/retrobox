import {
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
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
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SignInForm } from '@components/sign-in-form';
import {
  faBars,
  faBoxTaped,
  faGear,
  faHouse,
  faMoon,
  faSignIn,
  faSun,
  faXmarkLarge,
} from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { PropsWithChildren, useEffect, useState } from 'react';

interface SidebarLinkProps {
  label: string;
  icon: any;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ label, icon, href, onClick, isActive }: SidebarLinkProps) => {
  if (onClick)
    return (
      <HStack
        as="a"
        alignItems="center"
        w="full"
        color={isActive ? 'base' : 'gray.400'}
        _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
        onClick={onClick}
        spacing="4"
      >
        <Center w="30px">
          <Icon icon={icon} fontSize="2xl" />
        </Center>
        <Text fontSize="lg">{label}</Text>
      </HStack>
    );

  return (
    <NextLink href={href ? href : ''}>
      <HStack
        as="a"
        alignItems="center"
        w="full"
        color={isActive ? 'base' : 'gray.400'}
        _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
        spacing="4"
      >
        <Center w="30px">
          <Icon icon={icon} fontSize="2xl" />
        </Center>
        <Text fontSize="lg">{label}</Text>
      </HStack>
    </NextLink>
  );
};

const Navbar = ({
  data,
  handleSignInClick,
}: {
  data: Session | null;
  handleSignInClick: () => void;
}) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    setTimeout(onClose, 100);
  }, [router.asPath, onClose]);

  return (
    <>
      <HStack as="nav" minH="75px" px="4" bg="surface">
        <HStack>
          <Text fontSize="2xl">📦</Text>
          <Heading as="h1" size="md">
            Retrobox
          </Heading>
        </HStack>
        <Spacer />
        <HStack>
          {data?.user && (
            <NextLink href="/app/profile" passHref>
              <Avatar borderRadius="lg" name={data?.user.name || undefined} size="sm" />
            </NextLink>
          )}
          <IconButton
            aria-label="color-mode-toggle"
            icon={<Icon icon={colorMode === 'light' ? faMoon : faSun} />}
            onClick={toggleColorMode}
            size="sm"
          />
          <Divider h="15px" orientation="vertical" />
          {data?.user ? (
            <IconButton
              bg="none"
              _hover={{
                bg: 'none',
              }}
              aria-label="menu-toggle"
              icon={<Icon icon={!isOpen ? faBars : faXmarkLarge} />}
              onClick={onToggle}
              size="sm"
              variant="ghost"
            />
          ) : (
            <IconButton
              bg="none"
              _hover={{
                bg: 'none',
              }}
              aria-label="sign-in"
              icon={<Icon icon={faSignIn} />}
              onClick={handleSignInClick}
              size="sm"
              variant="ghost"
            />
          )}
        </HStack>
      </HStack>

      <Collapse
        in={isOpen}
        style={{
          zIndex: 10,
          position: 'absolute',
          top: '75px',
          bottom: '0',
          left: '0',
          right: '0',
        }}
      >
        <Box w="full" h="full" p="4" bg="surface">
          <VStack spacing="6">
            <SidebarLink
              icon={faHouse}
              isActive={router.asPath === '/app'}
              label="Home"
              href="/app"
            />
            <SidebarLink
              icon={faBoxTaped}
              label="Boxes"
              isActive={router.asPath.startsWith('/app/boxes')}
              href="/app/boxes"
            />
            <SidebarLink
              icon={faGear}
              label="Settings"
              isActive={router.asPath.startsWith('/app/settings')}
              href="/app/settings"
            />
          </VStack>
        </Box>
      </Collapse>
    </>
  );
};

const Sidebar = ({
  data,
  handleSignInClick,
}: {
  data: Session | null;
  handleSignInClick: () => void;
}) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="nav" minW="xs" maxW="xs" p="6" bg="surface">
      <VStack alignItems="flex-start" w="full">
        <HStack mb="10">
          <Text fontSize="4xl">📦</Text>
          <Heading as="h1">Retrobox</Heading>
        </HStack>
        <VStack spacing="6">
          {data?.user ? (
            <>
              <SidebarLink
                icon={faHouse}
                isActive={router.asPath === '/app'}
                label="Home"
                href="/app"
              />
              <SidebarLink
                icon={faBoxTaped}
                label="Boxes"
                isActive={router.asPath.startsWith('/app/boxes')}
                href="/app/boxes"
              />
              <SidebarLink
                icon={faGear}
                label="Settings"
                isActive={router.asPath.startsWith('/app/settings')}
                href="/app/settings"
              />
            </>
          ) : (
            <SidebarLink icon={faSignIn} label="Sign in / Sign up" onClick={handleSignInClick} />
          )}
        </VStack>
        <Spacer />
        <HStack w="full">
          {data?.user && (
            <NextLink href="/app/profile" passHref>
              <Avatar as="a" borderRadius="lg" name={data?.user.name || undefined} size="md" />
            </NextLink>
          )}
          <Spacer />
          <IconButton
            aria-label="color-mode-toggle"
            icon={<Icon icon={colorMode === 'light' ? faMoon : faSun} />}
            onClick={toggleColorMode}
            size="md"
          />
        </HStack>
      </VStack>
    </Flex>
  );
};

const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  const { data } = useSession();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

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
    <Flex direction={{ base: 'column', lg: 'row' }} w="full" minW="sm" h="100vh">
      {isDesktop ? (
        <Sidebar data={data} handleSignInClick={handleSignInOnClick} />
      ) : (
        <Navbar data={data} handleSignInClick={handleSignInOnClick} />
      )}
      <Flex as="main" direction="column" overflow="auto" w="full" h="full" p={['4', null, '8']}>
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

export default AppLayout;
