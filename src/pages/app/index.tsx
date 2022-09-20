import { Flex } from '@chakra-ui/react';
import { AppLayout } from '@components/layouts/app-layout';
import { NextPageWithLayout } from 'pages/_app';

const AppPage: NextPageWithLayout = () => {
  return (
    <div>
      <Flex as="main" h="100vh">
        STUFF!
      </Flex>
    </div>
  );
};

AppPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default AppPage;
