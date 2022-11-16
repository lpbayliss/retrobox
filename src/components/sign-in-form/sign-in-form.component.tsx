import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  StackProps,
  VStack,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

export type ICreateBoxFormInputs = {
  email: string;
};

type Props = {
  onSignInSuccess?: () => void;
  onSignInError?: (error: any) => void;
} & StackProps;

const CreateBoxForm = ({ onSignInSuccess, onSignInError, ...props }: Props) => {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICreateBoxFormInputs>();

  const handleOnSubmit: SubmitHandler<ICreateBoxFormInputs> = async ({ email }) => {
    const data = await signIn('email', {
      email,
      redirect: false,
      callbackUrl: window.location.href + 'app',
    });

    if (!onSignInSuccess || !onSignInError) return;

    if (!data) {
      onSignInError(new Error('Unexpected Error'));
      return;
    }

    if (data.error) onSignInError(data.error);

    onSignInSuccess();
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(handleOnSubmit)} spacing="4" {...props}>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel>
          <FormattedMessage id="SIGN_IN_FORM_EMAIL_LABEL" />
        </FormLabel>
        <Input
          id="email"
          placeholder={intl.formatMessage({ id: 'SIGN_IN_FORM_EMAIL_PLACEHOLDER' })}
          type="email"
          variant="filled"
          {...register('email', {
            required: intl.formatMessage({ id: 'SIGN_IN_FORM_EMAIL_REQUIRED_ERROR' }),
          })}
        />
        <FormHelperText>
          <FormattedMessage id="SIGN_IN_FORM_HELP_TEXT" />
        </FormHelperText>
        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
      </FormControl>
      <Divider />
      <Button w="full" isLoading={isSubmitting} type="submit">
        <FormattedMessage id="SIGN_IN_FORM_SUBMIT_BUTTON_LABEL" />
      </Button>
    </VStack>
  );
};

export default CreateBoxForm;
