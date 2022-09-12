import { Box, Button, Container, Spinner, Stack, Text } from '@chakra-ui/react';
import { supabase } from 'supabase/supabaseClient';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import * as actions from "@actions"
import { useSelector } from 'react-redux';
import * as selectors from '@selectors'
import { useEffect } from 'react';

interface ProfileProps {
  user: any;
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };
  return { props: { user } };
};

const Login: NextPage<ProfileProps> = ({ user }) => {
  const dispatch = useDispatch();
  const myProfile = useSelector(selectors.myProfile)
  const isFetchingProfile = useSelector(selectors.isFetchingProfile)

  useEffect(() => {
    dispatch(actions.fetchMyProfile())
  }, [dispatch])

  return (
    <div>
      <Head>
        <title>Retrobox | Profile</title>
        <meta name="description" content="Profile" />
      </Head>
      <Container as="main" maxW="md" py={{ base: '12', md: '24' }}>
        <Stack spacing="8">
          {isFetchingProfile ? <Spinner /> :
            <Text>{JSON.stringify(myProfile, null, 2)}</Text>}
        </Stack>
      </Container>
    </div>
  );
};

export default Login;
