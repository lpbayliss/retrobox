import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faCalendarLines } from '@fortawesome/pro-duotone-svg-icons';
import { useSession } from 'next-auth/react';

interface SidebarLinkProps {
  label: string;
  icon: any;
  href: string;
  isActive?: boolean;
}

const SidebarLink = ({ label, icon, href, isActive }: SidebarLinkProps) => {
  const Icon = chakra(FontAwesomeIcon);
  return (
    <NextLink href={href} passHref>
      <HStack as="a" alignItems="center" w="full" color={isActive ? 'base' : 'gray.400'}>
        <Center w="20px">
          <Icon icon={icon} fontSize="xl" />
        </Center>
        <Button justifyContent="flex-start" w="full" fontWeight="normal" variant="ghost">
          {label}
        </Button>
      </HStack>
    </NextLink>
  );
};

const Sidebar = () => {
  const { data: session, status } = useSession();
  return (
    <Flex
      flex="1"
      overflowY="auto"
      maxW="xs"
      px="8"
      py="8"
      bg="bg-surface"
      borderColor="gray.200"
      borderRight="1px"
    >
      <VStack alignItems="flex-start" w="full">
        {/* Main */}
        <HStack pb="12">
          <Avatar borderRadius="lg" name="Luke Bayliss" size="md" />
          <Box>
            <Text>Retrobox</Text>
            <Text>{JSON.stringify(session)}</Text>
          </Box>
        </HStack>
        <SidebarLink icon={faHouse} isActive label="Dashboard" href="/app" />
        <SidebarLink icon={faCalendarLines} label="Activity" href="/app/activity" />
        <SidebarLink icon={faGear} label="Settings" href="/app/settings" />

        {/* Teams */}
        <Divider />
        <Heading pt="4" size="md">
          Teams
        </Heading>
        <SidebarLink icon={faHouse} label="Dashboard" href="/app" />
        <SidebarLink icon={faCalendarLines} label="Activity" href="/app/activity" />
        <SidebarLink icon={faGear} label="Settings" href="/app/settings" />

        {/* Recent */}
        <Divider />
        <SidebarLink icon={faHouse} label="Dashboard" href="/app" />
        <SidebarLink icon={faCalendarLines} label="Activity" href="/app/activity" />
        <SidebarLink icon={faGear} label="Settings" href="/app/settings" />
      </VStack>
    </Flex>
  );
};

const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex as="section" direction={{ base: 'column', lg: 'row' }} overflowY="auto" h="100vh">
      {isDesktop ? <Sidebar /> : <>Navbar</>}
      {children}
    </Flex>
  );
};

export default AppLayout;
