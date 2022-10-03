import { ComponentStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const Card: ComponentStyleConfig = {
  baseStyle: (props: any) => ({
    display: 'flex',
    flexDirection: 'column',
    background: 'surface',
    boxShadow: mode('sm', 'none')(props),
    padding: 6,
    borderRadius: 'base',
    minW: 'sm',
  }),
};

export default Card;
