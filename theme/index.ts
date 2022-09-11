import { extendTheme, ThemeOverride } from "@chakra-ui/react";
import styles from "./styles";
import semanticTokens from "./semantic-tokens";
// import Section from "./components/section";
import Card from "./components/card";
// import Heading from "./components/heading";

const overrides: ThemeOverride = {
  styles,
  semanticTokens,
  components: {
    Card,
  },
};

export default extendTheme(overrides);
