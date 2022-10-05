import { extendTheme, ThemeOverride } from '@chakra-ui/react';

import Card from './components/card';
import TileGrid from './components/tile-grid';
import semanticTokens from './semantic-tokens';
import styles from './styles';

const overrides: ThemeOverride = {
  styles,
  semanticTokens,
  components: {
    Card,
    TileGrid,
  },
};

export default extendTheme(overrides);
