import useStore from "../../store/store";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function MqttOptionsPanel() {
  const mqttProtocol = useStore((state) => state.mqttProtocol);
  const mqttHost = useStore((state) => state.mqttHost);
  const mqttPort = useStore((state) => state.mqttPort);
  const mqttSessionPrefix = useStore((state) => state.mqttSessionPrefix);
  const mqttThrottleTime = useStore((state) => state.mqttThrottleTime);

  const setMqttProtocol = useStore((state) => state.setMqttProtocol);
  const setMqttHost = useStore((state) => state.setMqttHost);
  const setMqttPort = useStore((state) => state.setMqttPort);
  const setMqttSessionPrefix = useStore((state) => state.setMqttSessionPrefix);
  const setMqttThrottleTime = useStore((state) => state.setMqttThrottleTime);

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
          <Grid item xs={12}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Protocol</InputLabel>
              <Select
                value={mqttProtocol}
                onChange={(event) => setMqttProtocol(event.target.value)}
              >
                <MenuItem value={"ws"}>Websocket</MenuItem>
                <MenuItem value={"http"}>TCP</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Host"
              variant="outlined"
              size="small"
              fullWidth
              value={mqttHost}
              onChange={(event) => {
                setMqttHost(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Port"
              variant="outlined"
              size="small"
              fullWidth
              value={mqttPort}
              onChange={(event) => {
                setMqttPort(event.target.value);
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
              value={mqttThrottleTime}
              onChange={(event) => {
                setMqttThrottleTime(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Session prefix"
              variant="outlined"
              size="small"
              fullWidth
              value={mqttSessionPrefix}
              onChange={(event) => {
                setMqttSessionPrefix(event.target.value);
              }}
              //helperText="optional, will prefix the mqtt topic, e.g. sessionId/popeye/..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MqttOptionsPanel;
