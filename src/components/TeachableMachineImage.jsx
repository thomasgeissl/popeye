import { useRef, useEffect, useState } from "react";
import ml5 from "ml5";
import useStore from "../store/store";
import styled from "@emotion/styled";

const Results = styled.ul`
  list-style-type: none;
`;
const Result = styled.li`
  position: relative;
  .confidence {
    position: relative;
    width: ${(props) =>
      (props.confidence > 0.3 ? props.confidence : 0.3) * 100}%;
  }
`;

const Video = styled.video`
  position: absolute;
  //right: 0;
  top: 0;
  width: 100%;
  //min-width: 100%;
  //min-height: 100%;
`;

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
`;

function TeachableMachineImage() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [classifier, setClassifier] = useState(null);
  const [results, setResults] = useState([]);
  const videoDeviceId = useStore((state) => state.videoDeviceId);
  const sessionPrefix = useStore((state) => state.sessionPrefix);
  const modelUrl = useStore((state) => state.teachableMachineModelUrl);

  useEffect(
    () => {
      const classifier = ml5.imageClassifier(modelUrl, () => {
        navigator.mediaDevices
          .getUserMedia({
            video: videoDeviceId ? { deviceId: videoDeviceId } : true,
            audio: false,
          })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
        setClassifier(classifier);
      });
      const onResults = (error, r) => {
        if (error) {
          console.error(error);
          return;
        }
        setResults([...r]);
      };

      const intervalId = setInterval(function () {
        if (classifier && videoRef.current) {
          classifier.classify(videoRef.current, onResults);
        }
      }, 100);
    },
    [setClassifier, setResults],
    () => {
      clearInterval(intervalId);
    }
  );

  useEffect(() => {
    results.forEach((result) => {
      window.api?.send("sendMessage", {
        address: `tm/${result.label}`,
        sessionPrefix,
        args: [result.confidence],
      });
    });
  }, [sessionPrefix, results]);

  const requestRef = useRef();

  const animate = (time) => {

    const canvasCtx = canvasRef.current.getContext("2d");

    canvasCtx.save();
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
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasCtx.filter = "none";

    canvasCtx.fillStyle = "rgba(0, 0, 0, .5)";
    canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasCtx.globalCompositeOperation = "screen";

    canvasCtx.restore();

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Container>
      <WebcamContainer>
        <Video
          ref={videoRef}
          style={{ transform: "scale(-1, 1)" }}
          width="1280"
          height="960"
        />
      </WebcamContainer>
      <Overlay
        ref={canvasRef}
        className="output_canvas"
        width="1280"
        height="960"
      ></Overlay>
    </Container>
    // <div>
    //   <Video
    //     ref={videoRef}
    //     style={{ transform: "scale(-1, 1)" }}
    //     width="1280"
    //     height="960"
    //   />
    //   <h3>results</h3>
    //   <Results>
    //     {results
    //       .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))
    //       .map((result) => {
    //         return (
    //           <Result
    //             key={`result-${result.label}`}
    //             confidence={result.confidence}
    //           >
    //             <span className="confidence">
    //               {result.label}: {Math.round(result.confidence * 100) / 100}
    //             </span>
    //           </Result>
    //         );
    //       })}
    //   </Results>
    // </div>
  );
}

export default TeachableMachineImage;
