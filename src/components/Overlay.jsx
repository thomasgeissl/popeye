import useStore from "../store/store";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";

import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const Container = styled.div`
  //display: flex;
  //flex-direction: column;
  //width: calc(100vw - 24px);
  //height: 100vh;
  position: absolute;
  //left: 0px;
  //margin: 24px;
  mix-blend-mode: screen;
  width: calc(100% - 48px);
  margin: 24px;
`;

function Overlay() {
  const toggleSettings = useStore((state) => state.toggleSettings);
  const setActive = useStore((state) => state.setActive);

  const log = useStore((state) => state.log);
  const theme = useTheme();

  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        //sx={{ m: 3 }}
      >
        <Grid item xs={0}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={4}
          >
            <Grid item>
              <img src="/icon.svg" />
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="baseline" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color={theme.palette.secondary.main}>
                    PopEye
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="caption"
                    color={theme.palette.secondary.main}
                  >
                    1.0 {log}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            onClick={() => toggleSettings()}
          >
            <SettingsIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Overlay;
