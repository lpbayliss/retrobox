import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  StackProps,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { trpc } from 'src/lib/trpc';

export type ICreateBoxFormInputs = {
  name: string;
};

type Props = { onClose: () => void } & StackProps;

const CreateBoxForm = ({ onClose, ...props }: Props) => {
  const addPostMutation = trpc.box.create.useMutation();

  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICreateBoxFormInputs>();

  const handleOnSubmit: SubmitHandler<ICreateBoxFormInputs> = async (data) => {
    await addPostMutation.mutateAsync({ name: data.name });
  };

  useEffect(() => {
    if (addPostMutation.error) return;
    if (addPostMutation.isSuccess) {
      onClose();
      return;
    }
  }, [addPostMutation.error, addPostMutation.isSuccess, onClose]);

  return (
    <VStack as="form" onSubmit={handleSubmit(handleOnSubmit)} spacing="4" {...props}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>
          <FormattedMessage id="CREATE_BOX_FORM_NAME_LABEL" />
        </FormLabel>
        <Input
          id="name"
          placeholder={intl.formatMessage({ id: 'CREATE_BOX_FORM_NAME_PLACEHOLDER' })}
          variant="filled"
          {...register('name', {
            required: intl.formatMessage({ id: 'CREATE_BOX_FORM_NAME_REQUIRED_ERROR' }),
            minLength: {
              value: 4,
              message: intl.formatMessage({
                id: 'CREATE_BOX_FORM_NAME_MIN_LENGTH_ERROR',
              }),
            },
          })}
        />
        <FormHelperText>
          <FormattedMessage id="CREATE_BOX_FORM_HELP_TEXT" />
        </FormHelperText>
        <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
      </FormControl>
      <Button w="full" isLoading={isSubmitting} type="submit">
        <FormattedMessage id="CREATE_BOX_FORM_SUBMIT_BUTTON_LABEL" />
      </Button>
    </VStack>
  );
};

export default CreateBoxForm;
