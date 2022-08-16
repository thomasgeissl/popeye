import { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import useStore, { TM_MODE, TRACKERS } from "../store/store";
import { MenuItem, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import { landmarkPoints as poseLandmarkPoints } from "./MPose";
import { landmarkPoints as handLandmarkPoints } from "./MHands";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  const oscSessionPrefix = useStore((state) => state.oscSessionPrefix);
  const mqttSessionPrefix = useStore((state) => state.mqttSessionPrefix);
  const setOscSessionPrefix = useStore((state) => state.setOscSessionPrefix);
  const setMqttSessionPrefix = useStore((state) => state.setMqttSessionPrefix);
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
      <h2>input</h2>
      <Select
        value={videoDeviceId ? videoDeviceId : "default"}
        onChange={(event) => setVideoDeviceId(event.target.value)}
      >
        {devices.map((device, key) => (
          <MenuItem value={device.deviceId} key={device.deviceId}>
            {device.label}
          </MenuItem>
        ))}
      </Select>
      <h2>trackers</h2>
      <RadioGroup
        value={tracker}
        onChange={(event) => setTracker(event.target.value)}
      >
        {Object.entries(TRACKERS).map(([key, value]) => {
          return (
            <>
              <FormControlLabel
                value={value}
                key={key}
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
                </TrackerSettings>
              )}
            </>
          );
        })}
      </RadioGroup>

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
              fullWidth
              value={mqttBroker}
              onChange={(event) => {
                setMqttBroker(event.target.value);
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
