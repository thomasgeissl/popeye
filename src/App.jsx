import { useState, useEffect } from "react";
import MPose from "./components/MPose";
import MHands from "./components/MHands";
// import MFaceMesh from "./components/MFaceMesh";
import MHolistic from "./components/MHolistic";
import FaceExpression from "./components/FaceExpression";
import TeachableMachineImage from "./components/TeachableMachineImage";
import TeachableMachinePose from "./components/TeachableMachinePose";
import Settings from "./components/Settings";
import Logger from "./components/Logger";
import styled from "@emotion/styled";
import useStore from "./store/store";
import { TRACKERS, TM_MODE } from "./store/store";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  //color: #fff;
`;
const Content = styled.div`
  flex-grow: 1;
  padding: 0px;
  overflow: scroll;
`;

function App() {
  const showSettings = useStore((state) => state.showSettings);
  const tracker = useStore((state) => state.tracker);
  const tmMode = useStore((state) => state.tmMode);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Content>
          {tracker === TRACKERS.POSE && <MPose></MPose>}
          {tracker === TRACKERS.HANDS && <MHands></MHands>}
          {/* {tracker === TRACKERS.FACE_MESH && <MFaceMesh></MFaceMesh>} */}
          {tracker === TRACKERS.TEACHABLE_MACHINE &&
            tmMode === TM_MODE.IMAGE && (
              <TeachableMachineImage></TeachableMachineImage>
            )}
          {tracker === TRACKERS.TEACHABLE_MACHINE &&
            tmMode === TM_MODE.POSE && (
              <TeachableMachinePose></TeachableMachinePose>
            )}
        </Content>
        <Logger></Logger>
        {(showSettings || !tracker) && <Settings></Settings>}
      </Container>
    </ThemeProvider>
  );
}

export default App;
