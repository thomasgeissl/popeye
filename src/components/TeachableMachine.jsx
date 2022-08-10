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
  const modelUrl = useStore((state) => state.teachableMachineModelUrl);

  const onResults = (error, r) => {
    if (error) {
      console.error(error);
      return;
    }
    setResults(r);
    r.forEach((result) => {
      // console.log(result.label, result.confidence)
      window.api?.send("sendMessage", {
        address: `tm/${result.label}`,
        sessionPrefix,
        args: [result.confidence],
      });
    });
  };

  useEffect(
    () => {
      const classifier = ml5.imageClassifier(modelUrl, () => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
        setClassifier(classifier);
      });

      const intervalId = setInterval(function () {
        if (classifier) {
          classifier.classify(videoRef.current, onResults);
        }
      }, 500);
    },
    [setClassifier, setResults],
    () => {
      clearInterval(intervalId);
    }
  );
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
              <Result confidence={result.confidence}>
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
