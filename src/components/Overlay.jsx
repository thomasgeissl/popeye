import useStore from "../store/store";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 24px);
  height: 100vh;
  position: absolute;
  left: 0px;
  margin: 24px;
`;

function Overlay() {

  const toggleSettings = useStore((state) => state.toggleSettings);


  return (
    <Container>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h5" component="h5">
        PopEye
      </Typography>
        <IconButton
              size="large"
              edge="start"
              color="secondary"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => toggleSettings()}
            >
            <SettingsIcon />
          </IconButton>
      </Grid>
    
    </Container>
  );
}

export default Overlay;
