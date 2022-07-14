import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import {
  FACEMESH_TESSELATION,
  FACEMESH_CONTOURS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh";
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

function MFaceMesh() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvasCtx = canvasRef.current.getContext("2d");
    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#E0E0E0",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
            color: "#E0E0E0",
          });
        }
      }
    }
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        await faceMesh.send({ image: webcamRef.current.video });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);
  return (
    <div className="faceMesh">
      <Webcam ref={webcamRef} width="640px" height="480px"></Webcam>
      <Overlay ref={canvasRef} className="output_canvas"></Overlay>
    </div>
  );
}

export default MFaceMesh;
