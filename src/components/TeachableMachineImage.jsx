import { useRef, useEffect, useState } from "react";
import ml5 from "ml5";
import useStore from "../store/store";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const Results = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  mix-blend-mode: screen;
  margin: 24px;
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
  const theme = useTheme();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [classifier, setClassifier] = useState(null);
  const [results, setResults] = useState([]);
  const videoDeviceId = useStore((state) => state.videoDeviceId);
  const sessionPrefix = useStore((state) => state.sessionPrefix);
  const modelUrl = useStore((state) => state.teachableMachineModelUrl);
  const send = useStore((state) => state.send);

  useEffect(
    () => {
      console.log("setting up new classifier, TODO: delete old one", modelUrl)
      const newClassifier = ml5.imageClassifier(modelUrl, () => {
        navigator.mediaDevices
          .getUserMedia({
            video: videoDeviceId ? { deviceId: videoDeviceId } : true,
            audio: false,
          })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
        setClassifier(newClassifier);
      });
      const onResults = (error, r) => {
        if (error) {
          console.error(error);
          return;
        }
        setResults([...r]);
      };

      const intervalId = setInterval(function () {
        if (newClassifier && videoRef.current) {
          newClassifier.classify(videoRef.current, onResults);
        }
      }, 100);
    },
    [setClassifier, setResults, modelUrl],
    () => {
      // TODO: delete classifier, or stop
      // delete newClassifier
      clearInterval(intervalId);
    }
  );

  useEffect(() => {
    results.forEach((result) => {
      send(`tm/${result.label}`, { confidence: result.confidence });
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
      {/* <Results>
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
      </Results> */}
      {/* <Results>
        <Grid container direction="column">
          {results
            .sort((a, b) =>
              a.label < b.label ? -1 : a.label > b.label ? 1 : 0
            )
            .map((result) => {
              return (
                <Grid item xs={12} key={`result-${result.label}`}>
                  <Typography
                    variant="caption"
                    color={theme.palette.secondary.main}
                    sx={{ opacity: result.confidence > 0.5 ? 1 : 0.2 }}
                    xs={12}
                  >
                    <Grid container direction="row" spacing={2}>
                      <Grid item>
                        <strong>{result.label}</strong>
                      </Grid>
                      <Grid item>{result.confidence.toFixed(2)}</Grid>
                    </Grid>
                  </Typography>
                </Grid>
              );
            })}
        </Grid>
      </Results> */}
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
