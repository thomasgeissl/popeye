// https://bareynol.github.io/mui-theme-creator/
import { createTheme } from "@mui/material/styles";

export const ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: "#90CAF9",
    },
    secondary: {
      main: "#CE93D8",
    }
  },
};

export default createTheme(ThemeOptions);
