import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import * as THREE from "three";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import { drawConnectors, drawLandmarks, POSE_CONNECTIONS } from "@mediapipe/drawing_utils";
import styled from "@emotion/styled";

const Overlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
`;

function MPose() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkRef = useRef(null);
  useEffect(() => {
  const canvasCtx = canvasRef.current.getContext("2d");
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
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
        // grid.updateLandmarks([]);
        return;
      }
      const labels = ['nose', 
      'left_eye_inner', 'left_eye', 'left_eye_outer',
      'right_eye_inner', 'right_eye', 'right_eye_outer',
      'left_ear',
      'right_ear',
      'mouth_left',
      'mouth_right',
      'left_shoulder',
      'right_shoulder',
      'left_elbow',
      'right_elbow',
      'left_wrist',
      'right_wrist',
      'left_pinky',
      'right_pinky',
      'left_index',
      'right_index',
      'left_thumb',
      'right_thumb',
      'left_hip',
      'right_hip',
      'left_knee',
      'right_knee',
      'left_ankle',
      'right_ankle',
      'left_heel',
      'right_heel',
      'left_foot_index',
      'right_foot_index',
    ]
    labels.forEach((label, index)=>{
      window.api?.send("sendOsc", { address: `pose/${label}`, args: [results.poseLandmarks[index]] });

    })
      // window.api?.send("sendOsc", { address: "pose", args: results.poseLandmarks });
      // window.api?.send("sendOsc", { address: "pose/raw", args: [JSON.stringify(results.poseLandmarks)] });

      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    //   canvasCtx.drawImage(
    //     results.segmentationMask,
    //     0,
    //     0,
    //     canvasRef.current.width,
    //     canvasRef.current.height
    //   );

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-in";
      canvasCtx.fillStyle = "#00FF00";
      canvasCtx.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "destination-atop";
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasCtx.globalCompositeOperation = 'source-over';
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 1,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 1,
      });
      canvasCtx.restore();

      //   grid.updateLandmarks(results.poseWorldLandmarks);
    };
    pose.onResults(onResults);
    // const grid = new LandmarkGrid(landmarkRef.current);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        await pose.send({ image: webcamRef.current.video });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);
  return (
    <div className="pose">
      <Webcam ref={webcamRef} width="640px" height="480px"></Webcam>
      <Overlay
        ref={canvasRef}
        className="output_canvas"
      ></Overlay>
      <div ref={landmarkRef} className="landmark-grid-container"></div>
    </div>
  );
}

export default MPose;
