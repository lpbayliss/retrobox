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
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Logo } from '@components/logo';

export type LoginFormValues = {
  email: string;
};

const Login: NextPage = () => {
  const intl = useIntl();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async ({ email }) => {
    const error = false;

    if (error) {
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Try again shortly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Link sent',
      description: "We've sent a login link to your email.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in" />
      </Head>
      <Container as="main" maxW="md" py={{ base: '12', md: '24' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Logo />
            <Stack textAlign="center" spacing={{ base: '2', md: '3' }}>
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                <FormattedMessage id="LOGIN_PAGE_TITLE" />
              </Heading>
              <Text>
                <FormattedMessage id="LOGIN_PAGE_SUBTITLE" />
              </Text>
            </Stack>
          </Stack>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing="6">
            <FormControl>
              <Stack spacing="4">
                <Input
                  id="email"
                  placeholder={intl.formatMessage({
                    id: 'LOGIN_PAGE_EMAIL_PLACEHOLDER',
                  })}
                  type="email"
                  variant="filled"
                  {...register('email', {
                    required: 'This is required',
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
                <Button isLoading={isSubmitting} type="submit">
                  <FormattedMessage id="LOGIN_PAGE_SUBMIT_BUTTON_LABEL" />
                </Button>
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
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
