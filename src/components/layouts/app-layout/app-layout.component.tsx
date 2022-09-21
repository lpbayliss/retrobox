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
        <Button variant="ghost" w="full" justifyContent="flex-start" fontWeight="normal">
          {label}
        </Button>
      </HStack>
    </NextLink>
  );
};

const Sidebar = () => (
  <Flex
    flex="1"
    bg="bg-surface"
    overflowY="auto"
    borderRight="1px"
    borderColor="gray.200"
    maxW="xs"
    py="8"
    px="8"
  >
    <VStack w="full" alignItems="flex-start">
      {/* Main */}
      <HStack pb="12">
        <Avatar borderRadius="lg" size="md" name="Luke Bayliss" />
        <Box>
          <Text>Retrobox</Text>
          <Text>Luke Bayliss</Text>
        </Box>
      </HStack>
      <SidebarLink icon={faHouse} isActive label="Dashboard" href="/app" />
      <SidebarLink icon={faCalendarLines} label="Activity" href="/app/activity" />
      <SidebarLink icon={faGear} label="Settings" href="/app/settings" />

      {/* Teams */}
      <Divider />
      <Heading size="md" pt="4">
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

const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex as="section" direction={{ base: 'column', lg: 'row' }} height="100vh" overflowY="auto">
      {isDesktop ? <Sidebar /> : <>Navbar</>}
      {children}
    </Flex>
  );
};

export default AppLayout;
