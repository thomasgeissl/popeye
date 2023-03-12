import { useRef, useEffect, useState } from "react";
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
import * as ml5 from "ml5";
import useStore from "../store/store";
import ThemeOptions from "../theme";
import { send } from "../sender";
import { color } from "@mui/system";

const WebcamContainer = styled.div`
  //   display: none;
`;

const Overlay = styled.canvas`
  width: 100%;
  height: calc(100vw * 960 / 1280);
`;

const Container = styled.div`
  //width: 100vw;
  //height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
`;
const BoundingBox = styled.div`
  position: absolute;
  background-color: rgba(255, 100, 30, 0.05);
  border: 1px solid rgba(255, 100, 30, 1);
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

function CocoSsd() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoDeviceId = useStore((state) => state.videoDeviceId);

  const [detections, setDetections] = useState([]);

  const gotDetections = (error, results) => {
    if (error) {
      console.error(error);
    }
    const ctx = canvasRef.current.getContext("2d");
    results.forEach((result) => {
      // TODO: only set on change
      console.log(result);
      send(`coco/${result.label}`, {
        confidence: result.confidence,
        x: result.x,
        y: result.y,
        width: result.width,
        height: result.height,
      });
    });
    setDetections(results);
  };

  useEffect(() => {
    let detectionInterval;
    const detector = ml5.objectDetector("cocossd", () => {
      detectionInterval = setInterval(() => {
        if (webcamRef.current.video.readyState !== 4) {
          console.warn("Video not ready yet");
          return;
        }
        detector.detect(webcamRef.current.video, gotDetections);
      }, 30);
    });
    return () => {
      clearInterval(detectionInterval);
    };
  }, []);

  return (
    <Container>
      <WebcamContainer>
        <Webcam
          ref={webcamRef}
          width={1280}
          height={960}
          //mirrored={true}
          videoConstraints={videoDeviceId ? { deviceId: videoDeviceId } : {}}
        ></Webcam>
      </WebcamContainer>

      {/* bounding boxes, labels, confidence or probably better: draw on a transparent canvas instead of adding dom elements  */}
      {detections.map((detection) => {
        return (
          <BoundingBox
            x={detection.x}
            y={detection.y}
            width={detection.width}
            height={detection.height}
          >
            {detection.label}
          </BoundingBox>
        );
      })}
      <Overlay
        ref={canvasRef}
        className="output_canvas"
        width="1280"
        height="960"
      ></Overlay>
    </Container>
  );
}

export default CocoSsd;
