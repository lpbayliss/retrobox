import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Circle,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faChevronRight, faChevronUp } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Home V2</title>
        <meta name="description" content="Retrobox home" />
      </Head>

      <Flex as="section" direction="column" w="full" p="10">
        <VStack alignItems="left">
          <Breadcrumb separator={<Icon icon={faChevronRight} />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Boxes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Design Box</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading as="h2" mb="2" size="2xl">
            Design Box
          </Heading>
          <HStack>
            <Badge colorScheme="red">Public</Badge>
            <Badge colorScheme="red">Belongs to design team</Badge>
            <Badge colorScheme="red">Created by Luke Bayliss</Badge>
          </HStack>
        </VStack>

        <VStack spacing="4">
          <Card w="full" p="6" bg="white">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <HStack fontWeight="semibold">
                <Circle bg="green.300" size="2" />
                <Text color="green.300">OPEN</Text>
              </HStack>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                3 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>

          <Card w="full" p="6" bg="white">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                10 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>

          <Card w="full" p="6" bg="white">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                6 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>
        </VStack>
      </Flex>
    </>
  );
};

export default HomePage;
