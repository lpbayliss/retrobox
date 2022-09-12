import {
  Box,
  Button,
  Heading,
  Img,
  LightMode,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';

const Index: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="section" py="7.5rem">
        <Box maxW={{ base: 'xl', md: '5xl' }} mx="auto" px={{ base: '6', md: '8' }}>
          <Box textAlign="center">
            <Heading
              as="h1"
              size="3xl"
              fontWeight="extrabold"
              maxW="48rem"
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              Design collaboration without the chaos
            </Heading>
            <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore
            </Text>
          </Box>

          <Stack
            justify="center"
            direction={{ base: 'column', md: 'row' }}
            mt="10"
            mb="20"
            spacing="4"
          >
            <LightMode>
              <Button
                as="a"
                href="/login"
                size="lg"
                colorScheme="blue"
                px="8"
                fontWeight="bold"
                fontSize="md"
              >
                Get started
              </Button>
              <Button as="a" href="#" size="lg" px="8" fontWeight="bold" fontSize="md">
                Learn more
              </Button>
            </LightMode>
          </Stack>
          <Box className="group" position="relative" rounded="lg" overflow="hidden" shadow="md">
            <Img
              alt="Screenshot of Envelope App"
              src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621085270/pro-website/app-screenshot-light_kit2sp.png"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
