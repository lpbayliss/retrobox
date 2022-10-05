import type { ComponentStyleConfig } from '@chakra-ui/react';

const TileGrid: ComponentStyleConfig = {
  parts: ['grid', 'item'],
  baseStyle: {
    grid: {
      display: 'grid',
      gap: 3,
      gridTemplateColumns: 'repeat(auto-fill, minmax(24rem, 1fr))',
      width: 'full',
    },
    item: {
      columnSpan: 1,
    },
  },
};

export default TileGrid;
