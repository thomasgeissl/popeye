import { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import useStore, { TM_MODE, TRACKERS } from "../store/store";
import { TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { useTheme } from "@mui/material/styles";

import { landmarkPoints as poseLandmarkPoints } from "./MPose";
import { landmarkPoints as handLandmarkPoints } from "./MHands";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 100vh;
  position: absolute;
  right: 0px;
  overflow: hidden;
  background-color: rgba(34, 34, 34, 0.9);
  backdrop-filter: blur(40px);
  padding: 24px;
`;
const Content = styled.div`
  flex-grow: 1;
  position: relative;
`;
const TrackerSettings = styled.div`
  padding: 12px;
`;
const Form = styled.div`
  .MuiFormControl-root {
    margin-bottom: 16px;
  }
`;

const LandmarksSelector = styled.ul`
  columns: 4;
  list-style-type: none;
  padding-left: 0;
`;
function Settings() {
  const theme = useTheme();
  // global state
  const toggleSettings = useStore((state) => state.toggleSettings);
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
  const oscSessionPrefix = useStore((state) => state.oscSessionPrefix);
  const oscThrottleTime = useStore((state) => state.oscThrottleTime);
  const mqttSessionPrefix = useStore((state) => state.mqttSessionPrefix);
  const mqttThrottleTime = useStore((state) => state.mqttThrottleTime);
  const setOscSessionPrefix = useStore((state) => state.setOscSessionPrefix);
  const setOscThrottleTime = useStore((state) => state.setOscThrottleTime);
  const setMqttSessionPrefix = useStore((state) => state.setMqttSessionPrefix);
  const setMqttThrottleTime = useStore((state) => state.setMqttThrottleTime);
  const activePoseLandmarkPoints = useStore(
    (state) => state.activePoseLandmarkPoints
  );
  const allPoseLandmarkPointsAsJson = useStore(
    (state) => state.allPoseLandmarkPointsAsJson
  );
  const setAllPoseLandmarkPointsAsJson = useStore(
    (state) => state.setAllPoseLandmarkPointsAsJson
  );
  const allHandLandmarkPointsJson = useStore(
    (state) => state.allHandLandmarkPointsJson
  );
  const setAllHandLandmarkPointsAsJson = useStore(
    (state) => state.setAllHandLandmarkPointsAsJson
  );
  const activeHandLandmarkPoints = useStore(
    (state) => state.activeHandLandmarkPoints
  );
  const toggleActivePoseLandmarkPoint = useStore(
    (state) => state.toggleActivePoseLandmarkPoint
  );
  const setAllPoseLandmarkPointsActive = useStore(
    (state) => state.setAllPoseLandmarkPointsActive
  );
  const toggleActiveHandLandmarkPoint = useStore(
    (state) => state.toggleActiveHandLandmarkPoint
  );
  const setAllHandLandmarkPointsActive = useStore(
    (state) => state.setAllHandLandmarkPointsActive
  );
  const teachableMachineModelUrl = useStore(
    (state) => state.teachableMachineModelUrl
  );
  const tmMode = useStore((state) => state.tmMode);
  const setTmMode = useStore((state) => state.setTmMode);
  const setTeachableMachineModelUrl = useStore(
    (state) => state.setTeachableMachineModelUrl
  );

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
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h6" color={theme.palette.primary.main}>
            Settings
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            onClick={() => toggleSettings()}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </Grid>
      </Grid>

      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container direction="row">
          <Grid item>
              <Typography variant="overline" color={"white"}>General</Typography>
            </Grid>
            <Grid item>
              <Divider textAlign="center"></Divider>
            </Grid>
            
          </Grid>
        </Grid>
        <Grid item>
          <FormControl variant="filled" size="small">
            <InputLabel>Camera Input</InputLabel>
            <Select
              value={videoDeviceId ? videoDeviceId : 0}
              onChange={(event) => setVideoDeviceId(event.target.value)}
            >
              {devices.map((device, key) => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="filled" size="small">
            <InputLabel>Trackers</InputLabel>
            <Select
              value={tracker}
              onChange={(event) => setTracker(event.target.value)}
            >
              {Object.entries(TRACKERS).map(([key, value]) => {
                return <MenuItem value={value}>{value}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid direction="row">
        <Divider textAlign="center">
          <Typography variant="overline">Tracker Options</Typography>
        </Divider>
      </Grid>

      {/* <h2>trackers</h2>
      <RadioGroup
        value={tracker}
        onChange={(event) => setTracker(event.target.value)}
      >
        {Object.entries(TRACKERS).map(([key, value]) => {
          return (
            <div key={key}>
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={value}
              ></FormControlLabel>
              {tracker === key && tracker === TRACKERS.POSE && (
                <TrackerSettings>
                  <LandmarksSelector>
                    <li key={`poseLandmarkPoint-all-json`}>
                      <Checkbox
                        checked={allPoseLandmarkPointsAsJson}
                        onChange={(event) => {
                          setAllPoseLandmarkPointsAsJson(event.target.checked);
                        }}
                      />{" "}
                      all as single json
                    </li>
                    <li key={`poseLandmarkPoint-all`}>
                      <Checkbox
                        checked={false}
                        onChange={() => {
                          setAllPoseLandmarkPointsActive();
                          // setOscActive(event.target.checked);
                        }}
                      />{" "}
                      all
                    </li>
                    {poseLandmarkPoints.map((poseLandmark) => {
                      return (
                        <li key={`poseLandmarkPoint-${poseLandmark}`}>
                          <Checkbox
                            checked={activePoseLandmarkPoints.includes(
                              poseLandmark
                            )}
                            onChange={(event) => {
                              // setOscActive(event.target.checked);
                              toggleActivePoseLandmarkPoint(poseLandmark);
                            }}
                          />{" "}
                          {poseLandmark}
                        </li>
                      );
                    })}
                  </LandmarksSelector>
                </TrackerSettings>
              )}
              {tracker === key && tracker === TRACKERS.HANDS && (
                <TrackerSettings>
                  <LandmarksSelector>
                    <li key={`handLandmarkPoint-all-json`}>
                      <Checkbox
                        checked={allHandLandmarkPointsJson}
                        onChange={(event) => {
                          setAllHandLandmarkPointsAsJson(event.target.checked);
                        }}
                      />{" "}
                      all as single json
                    </li>
                    <li key={`handLandmarkPoint-all`}>
                      <Checkbox
                        checked={false}
                        onChange={() => {
                          setAllHandLandmarkPointsActive();
                        }}
                      />{" "}
                      all
                    </li>
                    {handLandmarkPoints.map((handLandmark) => {
                      return (
                        <li key={`handLandmarkPoint-${handLandmark}`}>
                          <Checkbox
                            checked={activeHandLandmarkPoints.includes(
                              handLandmark
                            )}
                            onChange={() => {
                              toggleActiveHandLandmarkPoint(handLandmark);
                            }}
                          />{" "}
                          {handLandmark}
                        </li>
                      );
                    })}
                  </LandmarksSelector>
                </TrackerSettings>
              )}
              {tracker === key && tracker === TRACKERS.TEACHABLE_MACHINE && (
                <TrackerSettings>
                  <RadioGroup
                    value={tmMode}
                    onChange={(event) => setTmMode(event.target.value)}
                  >
                    {Object.entries(TM_MODE).map(([key, value]) => {
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
                  <TextField
                    label="model url"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={teachableMachineModelUrl}
                    onChange={(event) => {
                      setTeachableMachineModelUrl(event.target.value);
                    }}
                  />

                  <div>
                    train a model{" "}
                    <a
                      href="https://teachablemachine.withgoogle.com/train"
                      target="_blank"
                    >
                      here
                    </a>
                    .
                  </div>
                  {window.api && (
                    <div>
                      or load one from your filesystem
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          window.api?.send("loadTeachableMachineModel");
                        }}
                      >
                        choose
                      </Button>
                    </div>
                  )}
                </TrackerSettings>
              )}
            </div>
          );
        })}
      </RadioGroup> */}

      <Grid direction="row">
        <Divider textAlign="center">
          <Typography variant="overline">Output</Typography>
        </Divider>
      </Grid>

      <Grid container spacing={2} className="outputs">
        {window.api && (
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
                fullWidth
                value={oscDestinationHost}
                onChange={(event) => {
                  setOscDestinationHost(event.target.value);
                }}
              />
              <TextField
                label="port"
                variant="outlined"
                size="small"
                fullWidth
                value={oscDestinationPort}
                onChange={(event) => {
                  setOscDestinationPort(event.target.value);
                }}
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                label="throttle time (ms)"
                variant="outlined"
                size="small"
                fullWidth
                value={oscThrottleTime}
                onChange={(event) => {
                  setOscThrottleTime(event.target.value);
                }}
              />
              <TextField
                label="session prefix"
                variant="outlined"
                size="small"
                fullWidth
                value={oscSessionPrefix}
                placeholder="/sessionId"
                onChange={(event) => {
                  setOscSessionPrefix(event.target.value);
                }}
                helperText="optional, will prefix the osc address, e.g. /sessionId/popeye/..."
              />
            </Form>
          </Grid>
        )}
        <Grid item xs={6} className="mqtt">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={mqttActive}
                  onChange={(event) => {
                    setMqttActive(event.target.checked);
                  }}
                />
              }
              label="MQTTT"
            />
          </FormGroup>
          <Card variant="outlined">
            <CardContent>
              <Form>
                <TextField
                  label="mqtt broker"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={mqttBroker}
                  onChange={(event) => {
                    setMqttBroker(event.target.value);
                  }}
                />
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="throttle time (ms)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={mqttThrottleTime}
                  onChange={(event) => {
                    setMqttThrottleTime(event.target.value);
                  }}
                />
                <TextField
                  label="session prefix"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={mqttSessionPrefix}
                  placeholder="sessionId"
                  onChange={(event) => {
                    setMqttSessionPrefix(event.target.value);
                  }}
                  helperText="optional, will prefix the mqtt topic, e.g. sessionId/popeye/..."
                />
              </Form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
