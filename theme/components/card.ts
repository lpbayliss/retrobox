import { ComponentStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const Card: ComponentStyleConfig = {
  baseStyle: (props: any) => ({
    display: "flex",
    flexDirection: "column",
    background: ["none", null, mode("white", "gray.900")(props)],
    boxShadow: ["none", null, mode("md", "none")(props)],
    padding: 6,
    borderRadius: "base",
    minW: "sm",
  }),
};

export default Card;
