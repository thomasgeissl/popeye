import useStore from "../../store/store";
import styled from "@emotion/styled";

import Tooltip from "@mui/material/Tooltip";
import Radio from "@mui/material/Radio";
import { RoomPreferencesSharp } from "@mui/icons-material";

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
  offset = {x: 0, y: 0}
}) {
  const activePoseLandmarkPoints = useStore(
    (state) => state.activePoseLandmarkPoints
  );

  const toggleActivePoseLandmarkPoint = useStore(
    (state) => state.toggleActivePoseLandmarkPoint
  );

  return (
    <LandmarkOptions hidden={hidden}>
      <Sketch src={sketch} />
      <LandmarkRadioContainer>
        {landmarks.map((landmark, key) => {
          return (
            <Tooltip title={landmark.label} placement="right">
              <LandmarkRadio
                key={key}
                style={{
                  left: landmark.x + offset.x,
                  top: landmark.y + offset.y,
                }}
              >
                <Radio
                  size="small"
                  checked={activePoseLandmarkPoints.includes(landmark.label)}
                  onClick={() => toggleActivePoseLandmarkPoint(landmark.label)}
                />
              </LandmarkRadio>
            </Tooltip>
          );
        })}
      </LandmarkRadioContainer>
    </LandmarkOptions>
  );
}

export default LandmarkOptionsPanel;
