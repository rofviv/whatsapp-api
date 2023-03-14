import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { orange, teal } from "@material-ui/core/colors";

type MyThemeProviderProps = {
  children: JSX.Element;
};

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: orange,
  },
});

const MyThemeProvider = (props: MyThemeProviderProps) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

MyThemeProvider.propTypes = {};

export default MyThemeProvider;
