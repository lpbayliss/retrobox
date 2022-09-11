import {
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { requestMagicLink, sendToken } from "../api";
import { Logo } from "../components/logo";

export type ILoginFormInputs = {
  email: string;
};

interface LoginProps {
  error: boolean;
}

export const getServerSideProps: GetServerSideProps<LoginProps> = async ({
  query,
  res,
}) => {
  if (!query.token) return { props: { error: false } };
  console.log("Token found!");
  try {
    const result = await sendToken(String(query.token));
    console.log("cookie to pass", result?.setCookie);
    res.setHeader("set-cookie", result?.setCookie || []);
    return { redirect: { destination: "/" }, props: { error: false } };
  } catch (e) {
    return { redirect: { destination: "/" }, props: { error: true } };
  }
};

const Login: NextPage<LoginProps> = ({ error }) => {
  const intl = useIntl();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormInputs>();

  const requestMagicLinkMutation = useMutation(
    ({ destination }: { destination: string }) => {
      return requestMagicLink(destination);
    }
  );

  const handleOnSubmit: SubmitHandler<ILoginFormInputs> = ({ email }) => {
    requestMagicLinkMutation.mutate(
      { destination: email },
      {
        onSuccess: () => {
          toast({
            title: intl.formatMessage({ id: "LOGIN_FORM_ON_SUCCESS_TITLE" }),
            description: intl.formatMessage(
              {
                id: "LOGIN_FORM_ON_SUCCESS_MESSAGE",
              },
              { email }
            ),
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        },
        onError: () => {
          toast({
            title: intl.formatMessage({ id: "LOGIN_FORM_ON_ERROR_TITLE" }),
            description: intl.formatMessage({
              id: "LOGIN_FORM_ON_ERROR_MESSAGE",
            }),
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        },
      }
    );
  };

  return (
    <div>
      <Head>
        <title>Retrobox | Log in</title>
        <meta name="description" content="Log in" />
      </Head>
      <Container as="main" maxW="md" py={{ base: "12", md: "24" }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Logo />
            <Stack textAlign="center" spacing={{ base: "2", md: "3" }}>
              <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
                <FormattedMessage id="LOGIN_PAGE_FORM_TITLE" />
              </Heading>
              <Text>
                <FormattedMessage id="LOGIN_PAGE_FORM_SUBTITLE" />
              </Text>
              {error && (
                <Text color="red.300" fontSize="sm">
                  <FormattedMessage id="LOGIN_PAGE_LOGIN_ERROR" />
                </Text>
              )}
            </Stack>
          </Stack>

          <Stack as="form" onSubmit={handleSubmit(handleOnSubmit)} spacing="6">
            <FormControl isInvalid={!!errors.email}>
              <Stack spacing="4">
                <Input
                  id="email"
                  placeholder={intl.formatMessage({
                    id: "LOGIN_FORM_PLACEHOLDER",
                  })}
                  variant="filled"
                  {...register("email", {
                    required: intl.formatMessage({
                      id: "LOGIN_FORM_ERROR_REQUIRED",
                    }),
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: intl.formatMessage({
                        id: "LOGIN_FORM_ERROR_PATTERN",
                      }),
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
                <Button isLoading={isSubmitting} type="submit">
                  <FormattedMessage id="LOGIN_FORM_SUBMIT_TEXT" />
                </Button>
              </Stack>
            </FormControl>
          </Stack>

          <Divider />

          <HStack justify="center" spacing="1">
            <Text color="muted" fontSize="sm">
              <FormattedMessage id="LOGIN_PAGE_ISSUES" />
            </Text>
            <Button colorScheme="blue" size="sm" variant="link">
              <FormattedMessage id="LOGIN_PAGE_CONTACT" />
            </Button>
          </HStack>
        </Stack>
      </Container>
      <footer></footer>
    </div>
  );
};

export default Login;
