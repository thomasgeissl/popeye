import { useEffect, useState, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import useStore, { TM_MODE, TRACKERS } from "../store/store";
import { TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideocamIcon from "@mui/icons-material/Videocam";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { useTheme } from "@mui/material/styles";

import LandmarkOptionsPanel from "./settings/LandmarkOptionsPanel";
import MqttOptionsPanel from "./settings/MqttOptionsPanel";

import { landmarkPoints as poseLandmarkPoints } from "./MPose";
import { landmarkPoints as handLandmarkPoints } from "./MHands";
import { Hands } from "@mediapipe/hands";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 33vw;
  height: calc(100vh - 24px * 2);
  position: absolute;
  right: 0px;
  overflow: scroll;
  background-color: rgba(34, 34, 34, 0.75);
  backdrop-filter: blur(40px);
  padding: 24px;
  z-index: 10;
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

const LandmarkOptions = styled.div`
  position: relative;
  margin: 24px;
`;

const Sketch = styled.img`
  opacity: 0.1;
`;

const LandmarkRadioContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const LandmarkRadio = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const handLandmarkHotSpotPositions = [
  { label: "wrist", x: 90, y: 204 },
  { label: "thumb_cmc", x: 115, y: 181 },
  { label: "thumb_mcp", x: 140, y: 158 },
  { label: "thumb_ip", x: 165, y: 135 },
  { label: "thumb_tip", x: 190, y: 112 },
  { label: "index_finger_mcp", x: 123, y: 107 },
  { label: "index_finger_pip", x: 126, y: 78 },
  { label: "index_finger_dip", x: 129, y: 49 },
  { label: "index_finger_tip", x: 132, y: 20 },
  { label: "middle_finger_mcp", x: 90, y: 104 },
  { label: "middle_finger_pip", x: 88, y: 68 },
  { label: "middle_finger_dip", x: 86, y: 32 },
  { label: "middle_finger_tip", x: 84, y: -4 },
  { label: "ring_finger_mcp", x: 58, y: 111 },
  { label: "ring_finger_pip", x: 51, y: 79 },
  { label: "ring_finger_dip", x: 44, y: 47 },
  { label: "ring_finger_tip", x: 37, y: 15 },
  { label: "pinky_mcp", x: 32, y: 127 },
  { label: "pinky_pip", x: 22, y: 105 },
  { label: "pinky_dip", x: 12, y: 83 },
  { label: "pinky_tip", x: 2, y: 61 },
];

const handsLandmarkHotSpotPositions = [
  { label: "right_pinky", x: 19, y: 76 },
  { label: "right_index", x: 115, y: 46 },
  { label: "right_thumb", x: 152, y: 113 },
  { label: "left_pinky", x: 330, y: 76 },
  { label: "left_index", x: 238, y: 46 },
  { label: "left_thumb", x: 152, y: 113 },
];

const faceLandmarkHotSpotPositions = [
  { label: "nose", x: 126, y: 110 },
  { label: "left_eye", x: 158, y: 67 },
  { label: "left_eye_inner", x: 135, y: 67 },
  { label: "left_eye_outer", x: 181, y: 67 },
  { label: "right_eye", x: 78, y: 67 },
  { label: "right_eye_inner", x: 101, y: 67 },
  { label: "right_eye_outer", x: 55, y: 67 },
  { label: "left_ear", x: 217, y: 89 },
  { label: "right_ear", x: 13, y: 89 },
  { label: "mouth_right", x: 103, y: 169 },
  { label: "mouth_left", x: 136, y: 169 },
];

const bodyLandmarkHotSpotPositions = [
  { label: "left_shoulder", x: 138, y: 34 },
  { label: "right_shoulder", x: 92, y: 34 },
  { label: "left_elbow", x: 148, y: 74 },
  { label: "right_elbow", x: 82, y: 74 },
  { label: "left_wrist", x: 169, y: 103 },
  { label: "right_wrist", x: 60, y: 103 },
  { label: "left_hip", x: 128, y: 113 },
  { label: "right_hip", x: 102, y: 113 },
  { label: "left_knee", x: 129, y: 161 },
  { label: "right_knee", x: 101, y: 161 },
  { label: "left_ankle", x: 130, y: 200 },
  { label: "right_ankle", x: 100, y: 200 },
  { label: "left_heel", x: 130, y: 225 },
  { label: "right_heel", x: 100, y: 225 },
  { label: "left_foot_index", x: 158, y: 225 },
  { label: "right_foot_index", x: 72, y: 225 },
];

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
  const setNoneHandLandmarkPointsActive = useStore(
    (state) => state.setNoneHandLandmarkPointsActive
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
  const [poseTab, setPoseTab] = useState(0);
  const [showMqtt, setShowMqtt] = useState(false);

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
      <Grid container direction="column" spacing={2}>
        <Grid item>
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
        </Grid>
        <Grid item sx={{ flexGrow: 1 }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Grid container direction="column" spacing={2}>
                {/* <Grid item>
                  <Divider textAlign="center"></Divider>
                </Grid>

                <Grid item>
                  <Typography variant="overline" color={"white"}>
                    Input
                  </Typography>
                </Grid> */}

                <Grid item>
                  <FormControl variant="filled" size="small" fullWidth>
                    <InputLabel>Camera Input</InputLabel>
                    <Select
                      value={videoDeviceId ? videoDeviceId : ""}
                      onChange={(event) => setVideoDeviceId(event.target.value)}
                    >
                      {devices.map((device, key) => (
                        <MenuItem value={device.deviceId} key={device.deviceId}>
                          <Grid
                            container
                            direction="row"
                            //alignItems="center"
                            //justifyContent= "center"
                            columnSpacing={1}
                          >
                            <Grid item>
                              <VideocamIcon
                                fontSize={"inherit"}
                                sx={{ mt: 0.4 }}
                              ></VideocamIcon>
                            </Grid>
                            <Grid item>{device.label}</Grid>
                          </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="filled" size="small" fullWidth>
                    <InputLabel>Tracker</InputLabel>
                    <Select
                      value={tracker}
                      onChange={(event) => setTracker(event.target.value)}
                    >
                      {Object.entries(TRACKERS).map(([key, value]) => {
                        return (
                          <MenuItem key={key} value={value}>
                            {value}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                      {tracker === TRACKERS.POSE && (
                        <div>
                          <Tabs
                            value={poseTab}
                            onChange={(event, value) => {
                              setPoseTab(value);
                            }}
                            aria-label="basic tabs example"
                          >
                            <Tab label="Body" />
                            <Tab label="Face" />
                            <Tab label="Hands" />
                          </Tabs>
                          <LandmarkOptionsPanel
                            hidden={poseTab != 0}
                            sketch="/body.svg"
                            landmarks={bodyLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                          <LandmarkOptionsPanel
                            hidden={poseTab != 1}
                            sketch="/face.svg"
                            landmarks={faceLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                          <LandmarkOptionsPanel
                            hidden={poseTab != 2}
                            sketch="/hands.svg"
                            landmarks={handsLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                        </div>
                      )}
                      {tracker === TRACKERS.HANDS && (
                        <LandmarkOptionsPanel
                          sketch="/hand.svg"
                          landmarks={handLandmarkHotSpotPositions}
                          offset={{ x: 8, y: -10 }}
                        ></LandmarkOptionsPanel>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setAllHandLandmarkPointsActive()}
                      >
                        All
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setNoneHandLandmarkPointsActive()}
                      >
                        None
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Divider textAlign="center"></Divider>
                </Grid>

                <Grid item>
                  <Typography variant="overline" color={"white"}>
                    Output
                  </Typography>
                </Grid>

                {/* <Grid item xs={6} className="osc">
                      <h3>
                        <Switch
                          checked={oscActive}
                          disabled={!window.api}
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
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
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
                    </Grid> */}
                <Grid item>
                  <Grid container direction="column" spacing={0}>
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              <FormGroup>
                                <FormControlLabel
                                  sx={{ color: "white" }}
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
                            </Grid>
                            {mqttActive && (
                              <Grid item>
                                <Chip
                                  label={
                                    mqttActive ? "connected" : "disconnected"
                                  }
                                  color={mqttActive ? "success" : "default"}
                                  variant="outlined"
                                  size="small"
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="large"
                            edge="start"
                            color="secondary"
                            aria-label="menu"
                            onClick={() => setShowMqtt(!showMqtt)}
                          >
                            <MoreVertIcon></MoreVertIcon>
                          </IconButton>
                        </Grid>
                      </Grid>
                      {showMqtt && <MqttOptionsPanel></MqttOptionsPanel>}
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              <FormGroup>
                                <FormControlLabel
                                  sx={{ color: "white" }}
                                  control={
                                    <Switch
                                      disabled={!window.api}
                                      checked={oscActive}
                                      onChange={(event) => {
                                        setOscActive(event.target.checked);
                                      }}
                                    />
                                  }
                                  label="OSC"
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <IconButton
                            disabled={!window.api}
                            size="large"
                            edge="start"
                            color="secondary"
                            aria-label="menu"
                            onClick={() => setShowMqtt(!showMqtt)}
                          >
                            <MoreVertIcon></MoreVertIcon>
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
