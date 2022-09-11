import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export type ICreateItemFormInputs = {
  author: string;
  message: string;
};

type Props = {
  onSubmit(data: ICreateItemFormInputs): void;
};

const CreateItemForm = ({ onSubmit }: Props) => {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ICreateItemFormInputs>();

  useEffect(() => {
    reset({ message: "" });
  }, [isSubmitSuccessful, reset]);

  const handleOnSubmit: SubmitHandler<ICreateItemFormInputs> = (data) =>
    onSubmit(data);

  return (
    <VStack as="form" onSubmit={handleSubmit(handleOnSubmit)}>
      <FormControl isInvalid={!!errors.author}>
        <FormLabel>
          <FormattedMessage id="CREATE_ITEM_NAME_LABEL" />
        </FormLabel>
        <Input
          id="author"
          placeholder="Luke Skywalker"
          variant="filled"
          {...register("author")}
        />
        <FormHelperText>
          <FormattedMessage id="CREATE_ITEM_NAME_HELPER_TEST" />
        </FormHelperText>
        <FormErrorMessage>
          {errors.author && errors.author.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.message}>
        <FormLabel>
          <FormattedMessage id="CREATE_ITEM_RETRO_ITEM_LABEL" />
        </FormLabel>
        <Input
          id="message"
          placeholder="There isn't enough blue milk"
          variant="filled"
          {...register("message", {
            required: intl.formatMessage({
              id: "CREATE_ITEM_NAME_NO_CONTENT_ERROR",
            }),
            minLength: { value: 5, message: "Minimum length should be 5" },
          })}
        />
        <FormHelperText>
          <FormattedMessage id="CREATE_ITEM_RETRO_ITEM_HELPER_TEST" />
        </FormHelperText>
        <FormErrorMessage>
          {errors.message && errors.message.message}
        </FormErrorMessage>
      </FormControl>
      <Divider />
      <Button w="full" isLoading={isSubmitting} type="submit">
        <FormattedMessage id="CREATE_ITEM_SUBMIT_LABEL" />
      </Button>
    </VStack>
  );
};

export default CreateItemForm;
