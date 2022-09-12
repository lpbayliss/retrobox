import { Container, Stack, Text } from '@chakra-ui/react';
import { supabase } from '@utils/supabaseClient';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

interface ProfileProps {
  user: any;
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };
  return { props: { user } };
};

const Login: NextPage<ProfileProps> = ({ user }) => {
  return (
    <div>
      <Head>
        <title>Retrobox | Profile</title>
        <meta name="description" content="Profile" />
      </Head>
      <Container as="main" maxW="md" py={{ base: '12', md: '24' }}>
        <Stack spacing="8">
          <Text>{JSON.stringify(user)}</Text>
        </Stack>
      </Container>
    </div>
  );
};

export default Login;
