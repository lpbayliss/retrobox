import { extendTheme,ThemeOverride } from '@chakra-ui/react';

import Card from './components/card';
import semanticTokens from './semantic-tokens';
import styles from './styles';

const overrides: ThemeOverride = {
  styles,
  semanticTokens,
  components: {
    Card,
  },
};

export default extendTheme(overrides);
