import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { Save as SaveIcon } from "@mui/icons-material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
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
  const showSettings = useStore((state) => state.showSettings);
  const toggleSettings = useStore((state) => state.toggleSettings);
  const tracker = useStore((state) => state.tracker);
  const save = useStore((state) => state.save);
  return (
    <AppBar position="static">
      <Toolbar>
        <ToolbarContent>
          {tracker && <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleSettings()}
          >
            {showSettings && <PlayArrowIcon />}
            {!showSettings && <StopIcon />}
          </IconButton>}
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
        </ToolbarContent>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
