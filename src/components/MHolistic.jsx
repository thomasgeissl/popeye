import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import * as THREE from "three";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import {
  drawConnectors,
  drawLandmarks,
  HAND_CONNECTIONS,
} from "@mediapipe/drawing_utils";
import styled from "@emotion/styled";

const Overlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
`;

function MHolisitc() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvasCtx = canvasRef.current.getContext("2d");
    function onResults(results) {
      console.log(results);
      return;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-in";
      canvasCtx.fillStyle = "#00FF00";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "destination-atop";
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      canvasCtx.globalCompositeOperation = "source-over";
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "#CC0000",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "#00CC00",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      canvasCtx.restore();
    }
    // const holistic = new Holistic({
    //   locateFile: (file) => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    //     // return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.4.1628005088/${file}`;
    //   },
    // });
    // holistic.setOptions({
    //   modelComplexity: 1,
    //   smoothLandmarks: true,
    //   enableSegmentation: true,
    //   smoothSegmentation: true,
    //   refineFaceLandmarks: true,
    //   minDetectionConfidence: 0.5,
    //   minTrackingConfidence: 0.5,
    // });
    // holistic.onResults(onResults);

    // const camera = new Camera(webcamRef.current.video, {
    //   onFrame: async () => {
    //     await holistic.send({ image: webcamRef.current.video });
    //   },
    //   width: 640,
    //   height: 480,
    // });
    // camera.start();
  }, []);
  return (
    <div className="holistic">
      <Webcam ref={webcamRef} width="640px" height="480px"></Webcam>
      <Overlay ref={canvasRef} className="output_canvas"></Overlay>
    </div>
  );
}

export default MHolisitc;
