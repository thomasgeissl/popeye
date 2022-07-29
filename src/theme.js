// https://bareynol.github.io/mui-theme-creator/
import { createTheme } from "@mui/material/styles";

export const ThemeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#6aa380",
    },
    secondary: {
      main: "#a36a8d",
    },
  },
};

export default createTheme(ThemeOptions);
