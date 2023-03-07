import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
// import { Pose } from "@mediapipe/pose";
// import { Camera } from "@mediapipe/camera_utils";
import * as THREE from "three";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import useStore from "../store/store";
// import {
//   drawConnectors,
//   drawLandmarks,
//   POSE_CONNECTIONS,
// } from "@mediapipe/drawing_utils";
import styled from "@emotion/styled";
import ThemeOptions from "../theme";

const labels = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
];

const WebcamContainer = styled.div`
  display: none;
`;

const Overlay = styled.canvas`
  width: 100%;
  height: calc(100vw * 960 / 1280);
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

function MPose() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkRef = useRef(null);
  const videoDeviceId = useStore((state) => state.videoDeviceId);
  const landmarkPoints = useStore(
    (state) => state.landmarkPoints
  );
  const allPoseLandmarkPointsAsJson = useStore(
    (state) => state.allPoseLandmarkPointsAsJson
  );
  const send = useStore(
    (state) => state.send
  );

  useEffect(() => {
    const canvasCtx = canvasRef.current.getContext("2d");
    const pose = new Pose({
      locateFile: (file) => {
        return window.api
          ? `static://models/pose/${file}`
          : `models/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    const onResults = (results) => {
      if (!results.poseLandmarks) {
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        // grid.updateLandmarks([]);
        return;
      }

      // if (allPoseLandmarkPointsAsJson) {
      //   send(`pose/all`, [results.poseLandmarks]);
      // }
      labels.forEach((label, index) => {
        if (landmarkPoints.includes(label)) {
          send(`pose/${label}`, results.poseLandmarks[index]);
        }
      });

      // Only overwrite existing pixels.
      canvasCtx.save();
      //canvasCtx.imageSmoothingQuality = 'high';
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasCtx.filter = "grayscale(100%)";

      canvasCtx.translate(canvasRef.current.width, 0);
      canvasCtx.scale(-1, 1);

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


      if (results.poseLandmarks) {
        let activeLandmarks = [];
        let inactiveLandmarks = [];

        labels.forEach((label, index) => {
          if (landmarkPoints.includes(label))
            activeLandmarks.push(results.poseLandmarks[index]);
          else inactiveLandmarks.push(results.poseLandmarks[index]);
        });

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "rgba(255, 255,255, .1)",
          lineWidth: 1,
        });

        drawLandmarks(canvasCtx, activeLandmarks, {
          color: ThemeOptions.palette.secondary.main,
          radius: 5,
        });

        drawLandmarks(canvasCtx, inactiveLandmarks, {
          color: "rgba(255, 255,255, .1)",
          radius: 2,
        });
      }

      canvasCtx.restore();

      //   grid.updateLandmarks(results.poseWorldLandmarks);
    };
    pose.onResults(onResults);
    // const grid = new LandmarkGrid(landmarkRef.current);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (webcamRef.current?.video) { 
          await pose.send({ image: webcamRef.current.video });
        }
      },
      width: 1280,
      height: 960,
    });
    camera.start();
  }, [landmarkPoints]);
  return (
    <Container>
      <WebcamContainer>
        <Webcam
          ref={webcamRef}
          width="1280px"
          height="960px"
          videoConstraints={videoDeviceId ? { deviceId: videoDeviceId } : {}}
          mirrored={true}
        ></Webcam>
      </WebcamContainer>
      <Overlay
        ref={canvasRef}
        className="output_canvas"
        width="1280"
        height="960"
      ></Overlay>
      <div ref={landmarkRef} className="landmark-grid-container"></div>
    </Container>
  );
}

export default MPose;
export { labels as landmarkPoints };
