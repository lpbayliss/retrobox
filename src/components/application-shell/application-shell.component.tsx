import {
  Avatar,
  Box,
  Center,
  Collapse,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  faBars,
  faBoxTaped,
  faGear,
  faHouse,
  faMoon,
  faSun,
  faXmarkLarge,
} from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PropsWithChildren, useEffect } from 'react';

interface SidebarLinkProps {
  label: string;
  icon: any;
  href: string;
  isActive?: boolean;
}

const SidebarLink = ({ label, icon, href, isActive }: SidebarLinkProps) => {
  return (
    <NextLink href={href}>
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

const Navbar = () => {
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
          <NextLink href="/app/profile" passHref>
            <Avatar borderRadius="lg" name="Luke Bayliss" size="sm" />
          </NextLink>
          <IconButton
            aria-label="color-mode-toggle"
            icon={<Icon icon={colorMode === 'light' ? faMoon : faSun} />}
            onClick={toggleColorMode}
            size="sm"
          />
          <Divider h="15px" orientation="vertical" />
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

const Sidebar = () => {
  const router = useRouter();
  const { data } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="nav" minW="xs" maxW="xs" p="6" bg="surface">
      <VStack alignItems="flex-start" w="full">
        <HStack mb="10">
          <Text fontSize="4xl">📦</Text>
          <Heading as="h1">Retrobox</Heading>
        </HStack>
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
        <Spacer />
        <HStack w="full">
          <NextLink href="/app/profile" passHref>
            <Avatar as="a" borderRadius="lg" name={data?.user.name || undefined} size="md" />
          </NextLink>
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
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} w="full" minW="sm" h="100vh">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Flex as="main" direction="column" overflow="auto" w="full" h="full" p={['4', null, '8']}>
        {children}
      </Flex>
    </Flex>
  );
};

export default AppLayout;
