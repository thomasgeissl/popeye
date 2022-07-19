import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import * as faceapi from 'face-api.js';

import styled from "@emotion/styled";

const Overlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
`;

function FaceExpression() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    // const canvasCtx = canvasRef.current.getContext("2d");
    faceapi.loadSsdMobilenetv1Model('/models')
    // faceapi.loadFaceExpressionModel("/models");
    // faceapi.loadTinyFaceDetectorModel('/models')
    // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    // faceapi.nets.faceExpressionNet.loadFromUri('/models')

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        //   await hands.send({ image: webcamRef.current.video });
        faceapi
          .detectAllFaces(
            webcamRef.current.video,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions().then(detections => {
            console.log(detections)
          })
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);
  return (
    <div className="faceExpression">
      <Webcam ref={webcamRef} width="640px" height="480px"></Webcam>
      {/* <Overlay ref={canvasRef} className="output_canvas"></Overlay> */}
      face expression
    </div>
  );
}

export default FaceExpression;
