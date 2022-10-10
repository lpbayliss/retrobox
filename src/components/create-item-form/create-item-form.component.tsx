import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  StackProps,
  VStack,
} from '@chakra-ui/react';
import { trpc } from '@lib/trpc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

export type ICreateItemFormInputs = {
  anonymous?: boolean;
  content: string;
};

interface Props {
  boxId: string;
  onSubmit?: () => void;
}

const CreateBoxForm = ({ boxId, onSubmit, ...props }: Props & StackProps) => {
  const trpcContext = trpc.useContext();
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICreateItemFormInputs>();

  const addItemMutation = trpc.box.addItem.useMutation({
    onSuccess() {
      trpcContext.box.fetchById.invalidate();
      reset();
      if (onSubmit) onSubmit();
    },
  });

  const handleOnSubmit: SubmitHandler<ICreateItemFormInputs> = async (data) => {
    await addItemMutation.mutateAsync({
      id: boxId,
      content: data.content,
      anonymous: data.anonymous,
    });
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(handleOnSubmit)} spacing="4" {...props}>
      <FormControl isInvalid={!!errors.content}>
        <FormLabel>
          <FormattedMessage id="CREATE_ITEM_FORM_CONTENT_LABEL" />
        </FormLabel>
        <Input
          id="content"
          placeholder={intl.formatMessage({ id: 'CREATE_ITEM_FORM_CONTENT_PLACEHOLDER' })}
          variant="filled"
          {...register('content', {
            required: intl.formatMessage({ id: 'CREATE_ITEM_FORM_CONTENT_REQUIRED_ERROR' }),
          })}
        />
        <FormHelperText>
          <FormattedMessage id="CREATE_ITEM_FORM_CONTENT_HELP_TEXT" />
        </FormHelperText>
        <FormErrorMessage>{errors.content && errors.content.message}</FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl>
        <Checkbox {...register('anonymous')}>
          <FormattedMessage id="CREATE_ITEM_FORM_ANONYMOUS_LABEL" />
        </Checkbox>
      </FormControl>
      <Button w="full" isLoading={isSubmitting} type="submit">
        <FormattedMessage id="CREATE_ITEM_FORM_SUBMIT_BUTTON_LABEL" />
      </Button>
    </VStack>
  );
};

export default CreateBoxForm;
