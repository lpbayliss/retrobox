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
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export type ICreateBoxFormInputs = {
  name: string;
};

type Props = {
  onSubmit(data: ICreateBoxFormInputs): void;
};

const CreateBoxForm = ({
  onSubmit,
  ...props
}: Props & Omit<StackProps, "onSubmit">) => {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICreateBoxFormInputs>();

  const handleOnSubmit: SubmitHandler<ICreateBoxFormInputs> = (data) =>
    onSubmit(data);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(handleOnSubmit)}
      spacing="4"
      {...props}
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>
          <FormattedMessage id="CREATE_BOX_LABEL" />
        </FormLabel>
        <Input
          id="name"
          placeholder={intl.formatMessage({ id: "CREATE_BOX_PLACEHOLDER" })}
          variant="filled"
          {...register("name", {
            required: intl.formatMessage({ id: "CREATE_BOX_ERROR_REQUIRED" }),
            minLength: {
              value: 4,
              message: intl.formatMessage({
                id: "CREATE_BOX_ERROR_MIN_LENGTH",
              }),
            },
          })}
        />
        <FormHelperText>
          <FormattedMessage id="CREATE_BOX_HELPER_TEXT" />
        </FormHelperText>
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Divider />
      <Button w="full" isLoading={isSubmitting} type="submit">
        <FormattedMessage id="CREATE_BOX_BUTTON" />
      </Button>
    </VStack>
  );
};

export default CreateBoxForm;
