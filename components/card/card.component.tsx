import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react';
import * as React from 'react';

type Props = BoxProps;

const Card = (props: Props) => <Box __css={useStyleConfig('Card')} {...props} />;

export default Card;
