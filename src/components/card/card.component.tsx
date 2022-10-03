import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react';

type Props = BoxProps & { variant?: 'outline' };

const Card = ({ variant, ...rest }: Props) => (
  <Box __css={useStyleConfig('Card', { variant })} {...rest} />
);

export default Card;
