import useStore from "../../store/store";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

function MqttOptionsPanel() {
  const mqttBroker = useStore((state) => state.mqttBroker);
  const mqttSessionPrefix = useStore((state) => state.mqttSessionPrefix);
  const mqttThrottleTime = useStore((state) => state.mqttThrottleTime);

  const setMqttBroker = useStore((state) => state.setMqttBroker);
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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              label="Broker"
              variant="outlined"
              size="small"
              fullWidth
              value={mqttBroker}
              onChange={(event) => {
                setMqttBroker(event.target.value);
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
