import { Flex } from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { NextPageWithLayout } from '../../pages/_app';
import { unstable_getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import { Session } from 'next-auth';
import { Card } from '@components/card';
import { CreateBoxForm } from '@components/create-box-form';

interface PageProps {
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      session,
    },
  };
};

const AppPage: NextPageWithLayout<PageProps> = (props) => {
  return (
    <div>
      <Flex as="main" h="100vh">
        <Card>
          <CreateBoxForm />
        </Card>
      </Flex>
    </div>
  );
};

AppPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default AppPage;
