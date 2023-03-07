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

const detector = ml5.objectDetector("cocossd");

function CocoSsd() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoDeviceId = useStore((state) => state.videoDeviceId);

  const [detections, setDetections] = useState([]);

  const gotDetections = (error, results) => {
    if (error) {
      console.error(error);
    }
    // TODO: only set on change
    setDetections(results);
    detector.detect(webcamRef.current, gotDetections);
  };

  useEffect(()=>{
    detector.detect(webcamRef.current, gotDetections);

  }, [])

  return (
    <Container>
      {/* <WebcamContainer>
        <Webcam
          ref={webcamRef}
          width={1280}
          height={960}
          //mirrored={true}
          videoConstraints={videoDeviceId ? { deviceId: videoDeviceId } : {}}
        ></Webcam>
      </WebcamContainer> */}
      
      {/* bounding boxes, labels, confidence or probably better: draw on a transparent canvas instead of adding dom elements  */}
      {/* {detections.map(detection => {

      })} */}
    </Container>
  );
}

export default CocoSsd;
