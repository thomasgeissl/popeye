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

function TeachableMachine() {
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
  return (
    <div>
      <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width="640"
        height="480"
      />
      <h3>results</h3>
      <Results>
        {results
          .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))
          .map((result) => {
            return (
              <Result
                key={`result-${result.label}`}
                confidence={result.confidence}
              >
                <span className="confidence">
                  {result.label}: {Math.round(result.confidence * 100) / 100}
                </span>
              </Result>
            );
          })}
      </Results>
    </div>
  );
}

export default TeachableMachine;
