import { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import useStore from "../store/store";
import { TRACKERS } from "../store/store";
import { MenuItem, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex-grow: 1;
  position: relative;
`;
const Form = styled.div`
  * {
    margin-bottom: 12px;
  }
`;

function Settings() {
  // global state
  const tracker = useStore((state) => state.tracker);
  const setTracker = useStore((state) => state.setTracker);
  const videoDeviceId = useStore((state) => state.videoDeviceId);
  const setVideoDeviceId = useStore((state) => state.setVideoDeviceId);
  const oscActive = useStore((state) => state.oscActive);
  const setOscActive = useStore((state) => state.setOscActive);
  const oscDestinationPort = useStore((state) => state.oscDestinationPort);
  const setOscDestinationPort = useStore(
    (state) => state.setOscDestinationPort
  );
  const oscDestinationHost = useStore((state) => state.oscDestinationHost);
  const setOscDestinationHost = useStore(
    (state) => state.setOscDestinationHost
  );
  const mqttActive = useStore((state) => state.mqttActive);
  const mqttBroker = useStore((state) => state.mqttBroker);
  const setMqttActive = useStore((state) => state.setMqttActive);
  const setMqttBroker = useStore((state) => state.setMqttBroker);

  // local state
  const [devices, setDevices] = useState([]);
  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <Container>
      <h2>input</h2>
      <Select
        value={videoDeviceId ? videoDeviceId : "default"}
        onChange={(event) => setVideoDeviceId(event.target.value)}
      >
        {devices.map((device, key) => (
          <MenuItem value={device.deviceId} key={device.deviceId}>{device.label}</MenuItem>
        ))}
      </Select>
      <h2>trackers</h2>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={tracker}
        onChange={(event) => setTracker(event.target.value)}
      >
        {Object.entries(TRACKERS).map(([key, value]) => {
          return (
            <FormControlLabel
              value={value}
              key={key}
              control={<Radio />}
              label={value}
            ></FormControlLabel>
          );
        })}
      </RadioGroup>
      <ul></ul>
      <h2>outputs</h2>
      <Grid container spacing={2} className="outputs">
        <Grid item xs={6} className="osc">
          <h3>
            <Checkbox
              checked={oscActive}
              onChange={(event) => {
                setOscActive(event.target.checked);
              }}
            />
            OSC
          </h3>
          <Form>
            <TextField
              label="host"
              variant="outlined"
              size="small"
              value={oscDestinationHost}
              onChange={(event) => {
                setOscDestinationHost(event.target.value);
              }}
            />
            <TextField
              label="port"
              variant="outlined"
              size="small"
              value={oscDestinationPort}
              onChange={(event) => {
                setOscDestinationPort(event.target.value);
              }}
            />
          </Form>
        </Grid>
        <Grid item xs={6} className="mqtt">
          <h3>
            <Checkbox
              checked={mqttActive}
              onChange={(event) => {
                setMqttActive(event.target.checked);
              }}
            />
            MQTT
          </h3>
          <Form>
            <TextField
              label="mqtt broker"
              variant="outlined"
              size="small"
              value={mqttBroker}
              onChange={(event) => {
                setMqttBroker(event.target.value);
              }}
            />
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
