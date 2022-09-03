import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
// import { Hands } from "@mediapipe/hands";
// import { Camera } from "@mediapipe/camera_utils";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
// import {
//   drawConnectors,
//   drawLandmarks,
//   HAND_CONNECTIONS,
// } from "@mediapipe/drawing_utils";
import styled from "@emotion/styled";
import useStore from "../store/store";
import ThemeOptions from "../theme";
import { send } from "../sender";
import { color } from "@mui/system";

const labels = [
  "wrist",
  "thumb_cmc",
  "thumb_mcp",
  "thumb_ip",
  "thumb_tip",
  "index_finger_mcp",
  "index_finger_pip",
  "index_finger_dip",
  "index_finger_tip",
  "middle_finger_mcp",
  "middle_finger_pip",
  "middle_finger_dip",
  "middle_finger_tip",
  "ring_finger_mcp",
  "ring_finger_pip",
  "ring_finger_dip",
  "ring_finger_tip",
  "pinky_mcp",
  "pinky_pip",
  "pinky_dip",
  "pinky_tip",
];

const WebcamContainer = styled.div`
  display: none;
`;

const Overlay = styled.canvas`
width: 100%;
height: calc(100vw * 900 / 1280);
`;

const Container = styled.div`
width: 100vw;
height: 100vh;
overflow: hidden;
display: flex;
alignItems: center;
`;

function MHands() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoDeviceId = useStore((state) => state.videoDeviceId);
  const activeHandLandmarkPoints = useStore(
    (state) => state.activeHandLandmarkPoints
  );
  const allHandLandmarkPointsAsJson = useStore(
    (state) => state.allHandLandmarkPointsAsJson
  );
  useEffect(() => {
    const canvasCtx = canvasRef.current.getContext("2d");

    function onResults(results) {
      if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((landmarks, index) => {
          if (allHandLandmarkPointsAsJson) {
            send("hands/${index}/all", [JSON.stringify(landmarks)]);
          }
          labels.forEach((label) => {
            if (activeHandLandmarkPoints.includes(label)) {
              console.log("SEND")
              /*window.api?.*/send("sendMessage", {
                address: `hands/${index}/${label}`,
                args: [landmarks[index]],
              });
            }
          });
        });
      }

      canvasCtx.save();
      //canvasCtx.imageSmoothingQuality = 'high';
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasCtx.filter = "grayscale(100%)";

      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasCtx.filter = "none";

      canvasCtx.fillStyle = "rgba(0, 0, 0, .5)";
      canvasCtx.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasCtx.globalCompositeOperation = "screen";

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "rgba(255, 255,255, .1)",
            lineWidth: 1,
          });

        }
      }

      let activeLandmarks = [];
      let inactiveLandmarks = [];

      if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((landmarks) => {
          labels.forEach((label, index) => {
            if (activeHandLandmarkPoints.includes(label))
              activeLandmarks.push(landmarks[index]);
            else inactiveLandmarks.push(landmarks[index]);
          });
        });
      }

      drawLandmarks(canvasCtx, activeLandmarks, {
        color: ThemeOptions.palette.secondary.main,
        radius: 5,
      });

      drawLandmarks(canvasCtx, inactiveLandmarks, {
        color: "rgba(255, 255,255, .1)",
        radius: 2,
      });

      canvasCtx.restore();
    }
    const hands = new Hands({
      locateFile: (file) => {
        return window.api
          ? `static://models/hands/${file}`
          : `models/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (webcamRef.current?.video) {
          await hands.send({ image: webcamRef.current.video });
        }
      },
      width: 1280,
      height: 900,
    });
    camera.start();
  }, []);

  return (
    <Container>
      <WebcamContainer>
        <Webcam
          ref={webcamRef}
          width={1280}
          height={900}
          //mirrored={true}
          videoConstraints={videoDeviceId ? { deviceId: videoDeviceId } : {}}
        ></Webcam>
      </WebcamContainer>
      <Overlay
        ref={canvasRef}
        className="output_canvas"
        width="1280"
        height="900"
      ></Overlay>
    </Container>
  );
}

export default MHands;
export { labels as landmarkPoints };
