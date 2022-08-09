// https://codesandbox.io/s/react-teachable-machine-image-obmef?file=/src/Ml5tmimg.jsx:0-1579
import { useRef, useEffect, useState } from "react";
import ml5 from "ml5";
import useStore from "../store/store";

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
    console.log(results);
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
    [setResults],
    () => {
      clearInterval(intervalId);
    }
  );
  return (
    <div>
      <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width="300"
        height="150"
      />
      <h3>results</h3>
      <ul>
        {results.map((result) => {
          <li>
            {result.label} {result.confidence}
          </li>;
        })}
      </ul>
    </div>
  );
}

export default TeachableMachine;
