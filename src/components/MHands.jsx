import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {Hands} from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils";
import * as THREE from "three";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from "@mediapipe/drawing_utils";
import styled from "@emotion/styled";

const Overlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
`;

function MHands() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
  const canvasCtx = canvasRef.current.getContext("2d");
  function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 5});
        drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      }
    }
    canvasCtx.restore();
  } 
    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onResults);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        await hands.send({ image: webcamRef.current.video });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);
  return (
    <div className="hands">
      <Webcam ref={webcamRef} width="640px" height="480px"></Webcam>
      <Overlay
        ref={canvasRef}
        className="output_canvas"
      ></Overlay>
    </div>
  );
}

export default MHands;
