import { Box, Flex, Heading, Text } from "@chakra-ui/react/";
import { useMutation } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

import { createBox } from "../api";
import { Card } from "../components/card";
import {
  CreateBoxForm,
  ICreateBoxFormInputs,
} from "../components/create-box-form";

const Index: NextPage = () => {
  const router = useRouter();

  const mutation = useMutation((input: { name: string }) => {
    return createBox(input.name);
  });

  const handleOnSubmit = async (input: ICreateBoxFormInputs) => {
    mutation.mutate(input, {
      onSuccess: ({ data }) => {
        router.push(`/box/${data.id}`);
      },
    });
  };

  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" h="100vh">
        <Card mx="auto" my="auto" maxW="xl" minW="xl" pb="14">
          <Box mx="auto" fontSize="6xl">
            📦
          </Box>
          <Heading mx="auto" pb="4" size="4xl">
            <FormattedMessage id="RETROBOX" />
          </Heading>
          <Text maxW="xs" mx="auto" pb="4" color="grey" fontSize="sm">
            <FormattedMessage id="APP_DESCRIPTION" />
          </Text>
          <CreateBoxForm mx="auto" minW="xs" onSubmit={handleOnSubmit} />
        </Card>
      </Flex>
      <footer></footer>
    </div>
  );
};

export default Index;
