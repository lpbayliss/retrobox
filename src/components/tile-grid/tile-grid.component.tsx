import {
  createStylesContext,
  Grid,
  GridItem,
  GridItemProps,
  GridProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';

const [StylesProvider, useStyles] = createStylesContext('TileGrid');

export const TileGrid = ({ children, ...rest }: GridProps) => {
  const styles = useMultiStyleConfig('TileGrid');
  return (
    <Grid sx={styles.grid} {...rest}>
      <StylesProvider value={styles}>{children}</StylesProvider>
    </Grid>
  );
};

export const TileGridItem = (props: GridItemProps) => {
  const styles = useStyles();
  return <GridItem sx={styles.item} {...props} />;
};
