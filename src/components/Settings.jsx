import { useEffect, useState, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import useStore, { TM_MODE, TRACKERS } from "../store/store";
import { keyframes, TextField } from "@mui/material";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VideocamIcon from "@mui/icons-material/Videocam";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

import { useTheme } from "@mui/material/styles";

import LandmarkOptionsPanel from "./settings/LandmarkOptionsPanel";
import MqttOptionsPanel from "./settings/MqttOptionsPanel";
import OSCOptionsPanel from "./settings/OSCOptionsPanel";

import { landmarkPoints as poseLandmarkPoints } from "./MPose";
import { landmarkPoints as handLandmarkPoints } from "./MHands";
import { Hands } from "@mediapipe/hands";

import BodySvg from "../assets/body.svg"
import HandsSvg from "../assets/hands.svg"
import HandSvg from "../assets/hand.svg"
import FaceSvg from "../assets/face.svg"

const blink = keyframes`
0%, 50%, 100% {
  opacity: .25;
}
25%, 75% {
  opacity: 1;
}
`;

const Container = styled.div`

  width: 33vw;
  height: calc(100vh - 24px * 2);
  position: absolute;
  right: 0px;
  overflow: scroll;
  background-color: rgba(34, 34, 34, 0.75);
  backdrop-filter: blur(40px);
  padding: 24px;
  z-index: 10;
  overflow-y: scroll;
`;

const Blinker = styled.div`
  animation-name: ${blink};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  opacity: 1;
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
  { label: "left_pinky", x: 8, y: 86 },
  { label: "left_index", x: 75, y: 65 },
  { label: "left_thumb", x: 100, y: 115 },
  { label: "right_pinky", x: 220, y: 86 },
  { label: "right_index", x: 156, y: 65 },
  { label: "right_thumb", x: 130, y: 115 },
];

const faceLandmarkHotSpotPositions = [
  { label: "nose", x: 126, y: 110 },
  { label: "left_eye", x: 78, y: 67 },
  { label: "left_eye_inner", x: 101, y: 67 },
  { label: "left_eye_outer", x: 55, y: 67 },
  { label: "right_eye", x: 158, y: 67 },
  { label: "right_eye_inner", x: 135, y: 67 },
  { label: "right_eye_outer", x: 181, y: 67 },
  { label: "left_ear", x: 13, y: 89 },
  { label: "right_ear", x: 217, y: 89 },
  { label: "mouth_left", x: 103, y: 169 },
  { label: "mouth_right", x: 136, y: 169 },
];

const bodyLandmarkHotSpotPositions = [
  { label: "left_shoulder", x: 92, y: 34 },
  { label: "right_shoulder", x: 138, y: 34 },
  { label: "left_elbow", x: 82, y: 74 },
  { label: "right_elbow", x: 148, y: 74 },
  { label: "left_wrist", x: 60, y: 103 },
  { label: "right_wrist", x: 169, y: 103 },
  { label: "left_hip", x: 102, y: 113 },
  { label: "right_hip", x: 128, y: 113 },
  { label: "left_knee", x: 101, y: 161 },
  { label: "right_knee", x: 129, y: 161 },
  { label: "left_ankle", x: 100, y: 200 },
  { label: "right_ankle", x: 130, y: 200 },
  { label: "left_heel", x: 100, y: 225 },
  { label: "right_heel", x: 130, y: 225 },
  { label: "left_foot_index", x: 72, y: 225 },
  { label: "right_foot_index", x: 158, y: 225 },
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

  const mqttActive = useStore((state) => state.mqttActive);
  const mqttStatus = useStore((state) => state.mqttStatus);
  const setMqttActive = useStore((state) => state.setMqttActive);

  const teachableMachineModelUrl = useStore(
    (state) => state.teachableMachineModelUrl
  );
  const tmMode = useStore((state) => state.tmMode);
  const setTmMode = useStore((state) => state.setTmMode);
  const [localTeachableMachineModelUrl, setLocalTeachableMachineModelUrl] = useState("")
  const setTeachableMachineModelUrl = useStore(
    (state) => state.setTeachableMachineModelUrl
  );

  // local state
  const [devices, setDevices] = useState([]);
  const [poseTab, setPoseTab] = useState(0);
  const [showMqtt, setShowMqtt] = useState(false);
  const [showOSC, setShowOSC] = useState(false);

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
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12} sx={{ flexGrow: 1 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container rowSpacing={2}>
                {/* <Grid item>
                  <Divider textAlign="center"></Divider>
                </Grid>

                <Grid item>
                  <Typography variant="overline" color={"white"}>
                    Input
                  </Typography>
                </Grid> */}

                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
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
                            sketch={BodySvg}
                            landmarks={bodyLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                          <LandmarkOptionsPanel
                            hidden={poseTab != 1}
                            sketch={FaceSvg}
                            landmarks={faceLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                          <LandmarkOptionsPanel
                            hidden={poseTab != 2}
                            sketch={HandsSvg}
                            landmarks={handsLandmarkHotSpotPositions}
                            offset={{ x: -14, y: -12 }}
                          ></LandmarkOptionsPanel>
                        </div>
                      )}
                      {tracker === TRACKERS.HANDS && (
                        <LandmarkOptionsPanel
                          sketch={HandSvg}
                          landmarks={handLandmarkHotSpotPositions}
                          offset={{ x: 8, y: -10 }}
                        ></LandmarkOptionsPanel>
                      )}
                      {tracker === TRACKERS.TEACHABLE_MACHINE && (
                        <Grid container rowSpacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" color={"gray"}>
                              A
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color={"gray"}>
                              Head over to Google's great{" "}
                              <Link
                                color="primary"
                                href="https://teachablemachine.withgoogle.com/train"
                                target="_blank"
                              >
                                teachablemachine
                              </Link>{" "}
                              service and train a model. At the end of the
                              process your are provided a link that you can
                              paste here.
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Model URL"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={localTeachableMachineModelUrl}
                              onChange={(event) => {
                                setLocalTeachableMachineModelUrl(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  align="right"
                                  disabled={localTeachableMachineModelUrl === teachableMachineModelUrl}
                                  onClick={() => {
                                    setTeachableMachineModelUrl(localTeachableMachineModelUrl)
                                    // window.api?.send(
                                    //   "loadTeachableMachineModel"
                                    // );
                                  }}
                                >
                                  Load Cloud Model
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      {tracker === TRACKERS.TEACHABLE_MACHINE && window.api && (
                        <Grid container rowSpacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" color={"gray"}>
                              B
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color={"gray"}>
                              Load a model from your filesystem.
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  //align="right"
                                  onClick={() => {
                                    window.api?.send(
                                      "loadTeachableMachineModel"
                                    );
                                  }}
                                >
                                  Load Local Model
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <Divider textAlign="center"></Divider>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="overline" color={"white"}>
                    Output
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
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
                                  label="MQTT"
                                />
                              </FormGroup>
                            </Grid>
                            {mqttActive && (
                              <Grid item>
                                {mqttStatus === "connected" && (
                                  <Chip
                                    label={
                                      mqttStatus //mqttStatus ? "connected" : "disconnected"
                                    }
                                    color={
                                      mqttStatus === "connected"
                                        ? "success"
                                        : "warning"
                                    }
                                    variant="outlined"
                                    size="small"
                                  ></Chip>
                                )}
                                {mqttStatus != "connected" && (
                                  <Blinker>
                                    <Chip
                                      label={"connecting"}
                                      color={"warning"}
                                      variant="outlined"
                                      size="small"
                                    ></Chip>
                                  </Blinker>
                                  // <CircularProgress
                                  //   color="warning"
                                  //   size={20}
                                  //   thickness={4}
                                  // ></CircularProgress>
                                )}
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
                            {showMqtt && <ExpandLessIcon></ExpandLessIcon>}
                            {!showMqtt && <ExpandMoreIcon></ExpandMoreIcon>}
                          </IconButton>
                        </Grid>
                      </Grid>
                      {showMqtt && <MqttOptionsPanel></MqttOptionsPanel>}
                    </Grid>
                    <Grid item xs={12}>
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
                            onClick={() => setShowOSC(!showOSC)}
                          >
                            {showOSC && <ExpandLessIcon></ExpandLessIcon>}
                            {!showOSC && <ExpandMoreIcon></ExpandMoreIcon>}
                          </IconButton>
                        </Grid>
                      </Grid>
                      {showOSC && <OSCOptionsPanel></OSCOptionsPanel>}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
