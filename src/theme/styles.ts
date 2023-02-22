import { Styles } from '@chakra-ui/theme-tools';

const styles: Styles = {
  global: (_props: any) => ({
    body: {
      bg: 'canvas',
    },
    div: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }),
};

export default styles;