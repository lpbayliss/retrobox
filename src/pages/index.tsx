import { Box, Button, Heading, Img, LightMode, Stack, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useFlag } from '@unleash/proxy-client-react';

const Index: NextPage = () => {
  const enabled = useFlag('test-toggle');

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
              Welcome to {enabled ? 'Retrobox' : 'RETROWHAT'}
            </Heading>
            <Text maxW="xl" mt="4" mx="auto" fontSize="xl">
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
                px="8"
                fontSize="md"
                fontWeight="bold"
                colorScheme="blue"
                href="/login"
                size="lg"
              >
                Get started
              </Button>
              <Button as="a" px="8" fontSize="md" fontWeight="bold" href="#" size="lg">
                Learn more
              </Button>
            </LightMode>
          </Stack>
          <Box className="group" pos="relative" overflow="hidden" shadow="md" rounded="lg">
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
