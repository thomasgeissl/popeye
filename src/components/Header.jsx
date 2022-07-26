import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import { Settings as MenuIcon } from "@mui/icons-material";
import useStore from "../store/store";

function Header() {
  const showSettings = useStore((state) => state.showSettings);
  const toggleSettings = useStore((state) => state.toggleSettings);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => toggleSettings()}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
