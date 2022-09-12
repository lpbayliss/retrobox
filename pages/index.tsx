import {
  Box,
  Button,
  Circle,
  Container,
  Flex,
  Heading,
  Img,
  LightMode,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { supabase } from '@utils/supabaseClient';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (user) return { props: {}, redirect: { destination: '/app', permanent: false } };
  return { props: {} };
};

export const features = [
  {
    name: '210+ Components',
    description: 'Chakra UI Pro has 210+ componentsto help you develop your project faster.',
  },
  {
    name: 'Production Ready',
    description:
      'Effortlessly create your next production-ready experience with Chakra UI Pro components.',
  },
  {
    name: 'Accessible',
    description:
      "Accessibility first. That's why we pay attention to accessibility right from the start.",
  },
];

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
      <Box as="section" py="7.5rem">
        <Stack
          spacing={{ base: '12', md: '16' }}
          maxW={{ base: 'xl', md: '5xl' }}
          mx="auto"
          px={{ base: '6', md: '8' }}
        >
          <Stack spacing={{ base: '4', md: '5' }} maxW="3xl">
            <Stack spacing="3">
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold" color="accent">
                Features
              </Text>
              <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>
                What can you expect?
              </Heading>
            </Stack>
            <Text color="muted" fontSize={{ base: 'lg', md: 'xl' }}>
              A bundle of 210+ ready-to-use, responsive and accessible components with clever
              structured sourcode files.
            </Text>
          </Stack>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '12', lg: '16' }}>
            <Stack spacing={{ base: '10', md: '12' }} maxW="xl" justify="center" width="full">
              {features.map((feature) => (
                <Stack key={feature.name} spacing="4" direction="row">
                  <Square
                    size={{ base: '10', md: '12' }}
                    bg="accent"
                    color="inverted"
                    borderRadius="lg"
                  />
                  <Stack spacing={{ base: '4', md: '5' }} pt={{ base: '1.5', md: '2.5' }}>
                    <Stack spacing={{ base: '1', md: '2' }}>
                      <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium">
                        {feature.name}
                      </Text>
                      <Text color="muted">{feature.description}</Text>
                    </Stack>
                    <Button variant="link" colorScheme="blue" alignSelf="start">
                      Read more
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <Box width="full" overflow="hidden">
              <Img
                maxW="100%"
                minH={{ base: '100%', lg: '560px' }}
                objectFit="cover"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Developer"
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Index;
