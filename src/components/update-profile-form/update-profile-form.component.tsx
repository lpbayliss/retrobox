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
import { SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from 'src/lib/trpc';

export type IUpdateProfileFormInputs = {
  name: string;
};

type Props = {} & StackProps;

const UpdateProfileForm = (props: Props) => {
  const updateUserMutation = trpc.user.update.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUpdateProfileFormInputs>();

  const handleOnSubmit: SubmitHandler<IUpdateProfileFormInputs> = async (data) => {
    await updateUserMutation.mutateAsync({ name: data.name });
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(handleOnSubmit)} spacing="4" {...props}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          id="name"
          placeholder="Your name"
          variant="filled"
          {...register('name', {
            required: 'You must provide a name',
          })}
        />
        <FormHelperText>Add your name to help users know who you are</FormHelperText>
        <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
      </FormControl>
      <Button w="full" isLoading={isSubmitting} type="submit">
        Update
      </Button>
    </VStack>
  );
};

export default UpdateProfileForm;
