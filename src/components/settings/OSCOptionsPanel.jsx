import useStore from "../../store/store";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

function OSCOptionsPanel() {
  const oscDestinationHost = useStore((state) => state.oscDestinationHost);
  const oscDestinationPort = useStore((state) => state.oscDestinationPort);
  const oscThrottleTime = useStore((state) => state.oscThrottleTime);
  const oscSessionPrefix = useStore((state) => state.oscSessionPrefix);

  const setOscDestinationHost = useStore(
    (state) => state.setOscDestinationHost
  );
  const setOscDestinationPort = useStore(
    (state) => state.setOscDestinationPort
  );
  const setOscThrottleTime = useStore((state) => state.setOscThrottleTime);
  const setOscSessionPrefix = useStore((state) => state.setOscSessionPrefix);

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 2,
        mb: 2,
        pt: 1,
        bb: 0,
        backgroundColor: "#444",
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <TextField
              label="Host"
              variant="outlined"
              size="small"
              fullWidth
              value={oscDestinationHost}
              onChange={(event) => {
                setOscDestinationHost(event.target.value);
              }}
            />
          </Grid>

          <Grid item xs={5}>
            <TextField
              label="Port"
              variant="outlined"
              size="small"
              fullWidth
              value={oscDestinationPort}
              onChange={(event) => {
                setOscDestinationPort(event.target.value);
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              label="Throttle Time (ms)"
              variant="outlined"
              size="small"
              fullWidth
              value={oscThrottleTime}
              onChange={(event) => {
                setOscThrottleTime(event.target.value);
              }}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              label="Session Prefix"
              variant="outlined"
              size="small"
              fullWidth
              value={oscSessionPrefix}
              //placeholder="/sessionId"
              onChange={(event) => {
                setOscSessionPrefix(event.target.value);
              }}
              //helperText="optional, will prefix the osc address, e.g. /sessionId/popeye/..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default OSCOptionsPanel;
