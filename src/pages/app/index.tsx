import { Flex, Text } from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { GetServerSideProps, NextPage } from 'next';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';
import { withToggles } from '@lib/unleash';
import { withServerSideSession } from '@lib/auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: await withToggles(await withServerSideSession(context)({})),
  };
};

const AppPage: NextPage = ({ session }: any) => {
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
