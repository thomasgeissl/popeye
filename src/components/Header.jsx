import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { Settings as MenuIcon } from "@mui/icons-material";
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
            <MenuIcon />
          </IconButton>
          <Spacer></Spacer>
          <Switch
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            color="secondary"
          />
        </ToolbarContent>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
