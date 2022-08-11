import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { Settings as MenuIcon } from "@mui/icons-material";
import { Save as SaveIcon } from "@mui/icons-material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useStore from "../store/store";
import styled from "@emotion/styled";

const ToolbarContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const Spacer = styled.div`
  flex-grow: 1;
`;

function Header() {
  const active = useStore((state) => state.active);
  const setActive = useStore((state) => state.setActive);
  const showSettings = useStore((state) => state.showSettings);
  const toggleSettings = useStore((state) => state.toggleSettings);
  const save = useStore((state) => state.save);
  return (
    <AppBar position="static">
      <Toolbar>
        <ToolbarContent>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleSettings()}
          >
            {showSettings && <ArrowBackIcon />}
            {!showSettings && <MenuIcon />}
          </IconButton>
          <Spacer></Spacer>
          {showSettings && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="secondary"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => window.api?.send("load")}
              >
                <FileOpenIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="secondary"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => save()}
              >
                <SaveIcon />
              </IconButton>
            </>
          )}
          {!showSettings && <Switch
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            color="secondary"
          />}
        </ToolbarContent>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
