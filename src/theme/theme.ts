import { extendTheme, ThemeOverride } from '@chakra-ui/react';

import TileGrid from './components/tile-grid';
import semanticTokens from './semantic-tokens';
import styles from './styles';

const overrides: ThemeOverride = {
  styles,
  semanticTokens,
  components: {
    Card: {
      variants: {
        glass: {
          container: {
            bg: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(5px)',
            boxShadow: 'sm',
          },
        },
      },
    },
    TileGrid,
  },
};

export default extendTheme(overrides);
