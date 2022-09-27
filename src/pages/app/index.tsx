import { Flex, Text } from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { unstable_getServerSession } from 'next-auth/next';
import { GetServerSideProps, NextPage } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import { Session } from 'next-auth';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';

interface PageProps {
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => ({
  props: {
    session: await unstable_getServerSession(context.req, context.res, authOptions),
  },
});

const AppPage: NextPage<PageProps> = ({ session }) => {
  return (
    <AppLayout>
      <Flex as="main" h="100vh">
        <Card>
          <Text>{JSON.stringify(session)}</Text>
          <CreateBoxForm />
        </Card>
      </Flex>
    </AppLayout>
  );
};

export default AppPage;
