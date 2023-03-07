import useStore from "../../store/store";
import styled from "@emotion/styled";

import Tooltip from "@mui/material/Tooltip";
import Radio from "@mui/material/Radio";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const LandmarkOptions = styled.div`
  position: relative;
  margin: 24px;
`;

const Sketch = styled.img`
  opacity: 0.1;
`;

const LandmarkRadioContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const LandmarkRadio = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

function LandmarkOptionsPanel({
  sketch = "./hands.svg",
  hidden = false,
  landmarks = [{ label: "empty", x: 0, y: 0 }],
  offset = { x: 0, y: 0 },
}) {
  // const activePoseLandmarkPoints = useStore(
  //   (state) => state.activePoseLandmarkPoints
  // );

  const landmarkPoints = useStore(
    (state) => state.landmarkPoints
  );

  // const toggleActivePoseLandmarkPoint = useStore(
  //   (state) => state.toggleActivePoseLandmarkPoint
  // );

  const addLandmarkPoints = useStore(
    (state) => state.addLandmarkPoints
  );

  const clearLandmarkPoints = useStore(
    (state) => state.clearLandmarkPoints
  );

  const toggleLandmarkPoint = useStore(
    (state) => state.toggleLandmarkPoint
  );

  const allLandmarkPointLabels = () => {
    let allLandmarkPointLabels = []
    landmarks.map(landmark => {
      allLandmarkPointLabels.push(landmark.label)
    })
    return allLandmarkPointLabels
  }

  const addAllLandmarkPoints = () => {
    addLandmarkPoints(allLandmarkPointLabels())
  }


  return (
    <LandmarkOptions hidden={hidden}>
      <Grid container direction="column">
        <Grid item>
          <Sketch src={sketch} />
          <LandmarkRadioContainer>
            {landmarks.map((landmark, key) => {
              return (
                <Tooltip key={key} title={landmark.label} placement="right">
                  <LandmarkRadio
                    style={{
                      left: landmark.x + offset.x,
                      top: landmark.y + offset.y,
                    }}
                  >
                    <Radio
                      size="small"
                      checked={landmarkPoints.includes(
                        landmark.label
                      )}
                      onClick={() =>
                        toggleLandmarkPoint(landmark.label)
                        //toggleActivePoseLandmarkPoint(landmark.label)
                      }
                    />
                  </LandmarkRadio>
                </Tooltip>
              );
            })}
          </LandmarkRadioContainer>
        </Grid>
        <Grid item>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Grid item>
              <Button
                variant="text"
                size="small"
                onClick={() => addAllLandmarkPoints()}
              >
                All
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="text"
                size="small"
                onClick={() => clearLandmarkPoints()}
              >
                None
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LandmarkOptions>
  );
}

export default LandmarkOptionsPanel;
