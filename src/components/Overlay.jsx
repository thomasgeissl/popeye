import useStore from "../store/store";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";

import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";

const Container = styled.div`
  position: absolute;
  mix-blend-mode: screen;
  width: calc(100vw - 48px);
  height: calc(100vh - 48px);
  margin: 24px;
`;

const Header = styled.div`
  position: absolute;
  width: 100%;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  //width: 66%;
`;

function Overlay() {
  const toggleSettings = useStore((state) => state.toggleSettings);
  const setActive = useStore((state) => state.setActive);

  const log = useStore((state) => state.log);
  const clipLog = useStore((state) => state.clipLog);
  const theme = useTheme();

  const timeout = useRef(null);

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      clipLog();
      return clearTimeout(timeout.current);
    }, 100);
  }, [log]);

  return (
    <Container>
      <Header>
        <Grid container direction="column" justifyContent="space-between">
          <Grid item>
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
                  spacing={2}
                >
                  <Grid item>
                    <img src="/icon.svg" />
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      alignItems="baseline"
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          variant="h6"
                          color={theme.palette.secondary.main}
                        >
                          PopEye
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="caption"
                          color={theme.palette.secondary.main}
                        >
                          1.0
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
          </Grid>
        </Grid>
      </Header>
      <Footer>
        <Grid container direction="column">
          {log.map((line, index) => {
            return (
              <Grid item sx={{ opacity: index / log.length }} xs={12}>
                <Typography
                  variant="caption"
                  color={theme.palette.secondary.main}
                  fullWidth
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item><strong>{line.type}</strong></Grid>
                    <Grid item sx={{flexGrow: 1}}>{line.topic}</Grid>
                    <Grid item>X {line.x}</Grid>
                    <Grid item>Y {line.y}</Grid>
                    <Grid item>Z {line.z}</Grid>
                  </Grid>
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Footer>
    </Container>
  );
}

export default Overlay;
