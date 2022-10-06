import { ComponentStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const Card: ComponentStyleConfig = {
  baseStyle: (props: any) => ({
    display: 'flex',
    flexDirection: 'column',
    background: 'surface',
    boxShadow: 'sm',
    padding: 6,
    borderRadius: 'base',
    minW: 'xs',
  }),
  variants: {
    outline: (props: any) => ({
      background: 'none',
      border: '2px',
      borderStyle: 'dashed',
      borderColor: mode('blackAlpha.300', 'whiteAlpha.300')(props),
      color: mode('blackAlpha.300', 'whiteAlpha.300')(props),
      boxShadow: 'none',
    }),
  },
};

export default Card;
