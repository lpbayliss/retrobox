import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import styles from './styles';
import semanticTokens from './semantic-tokens';
import Card from './components/card';

const overrides: ThemeOverride = {
  styles,
  semanticTokens,
  components: {
    Card,
  },
};

export default extendTheme(overrides);
