import { useState, useEffect } from "react";
import MPose from "./components/MPose";
import MHands from "./components/MHands";
// import MFaceMesh from "./components/MFaceMesh";
import MHolistic from "./components/MHolistic";
import FaceExpression from "./components/FaceExpression";
import TeachableMachineImage from "./components/TeachableMachineImage";
import TeachableMachinePose from "./components/TeachableMachinePose";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Overlay from "./components/Overlay";
import styled from "@emotion/styled";
import useStore from "./store/store";
import { TRACKERS, TM_MODE } from "./store/store";
import { ThemeProvider } from "@mui/material";
import theme from "./theme"

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
  overflow:scroll;
`;

function App() {

  const showSettings = useStore((state) => state.showSettings);
  const tracker = useStore((state) => state.tracker);
  const tmMode = useStore((state) => state.tmMode);
  const setTracker = useStore((state) => state.setTracker);
  const setMqttActive = useStore((state) => state.setMqttActive);

  useEffect(() => {
    setMqttActive(true)
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* <Header></Header> */}
        <Content>
          {/* {(showSettings || !tracker) && <Settings></Settings>}
          {!showSettings && ( */}
            <div>
              {tracker === TRACKERS.POSE && <MPose></MPose>}
              {tracker === TRACKERS.HANDS && <MHands></MHands>}
              {/* {tracker === TRACKERS.FACE_MESH && <MFaceMesh></MFaceMesh>} */}
              {tracker === TRACKERS.TEACHABLE_MACHINE && tmMode === TM_MODE.IMAGE && <TeachableMachineImage></TeachableMachineImage>}
              {tracker === TRACKERS.TEACHABLE_MACHINE && tmMode === TM_MODE.POSE && <TeachableMachinePose></TeachableMachinePose>}
              {/* <MFaceMesh></MFaceMesh> */}
              {/* <MHolistic></MHolistic> */}
              {/* <FaceExpression></FaceExpression> */}
            </div>
          {/* )} */}
        </Content>
        <Overlay></Overlay>
        {(showSettings || !tracker) && <Settings></Settings>}
        {/* <Footer></Footer> */}
      </Container>
    </ThemeProvider>
  );
}

export default App;
