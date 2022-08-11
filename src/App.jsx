import { useState } from "react";
import MPose from "./components/MPose";
import MHands from "./components/MHands";
// import MFaceMesh from "./components/MFaceMesh";
import MHolistic from "./components/MHolistic";
import FaceExpression from "./components/FaceExpression";
import TeachableMachine from "./components/TeachableMachine";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import styled from "@emotion/styled";
import useStore from "./store/store";
import { TRACKERS } from "./store/store";
import { ThemeProvider } from "@mui/material";
import theme from "./theme"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;
const Content = styled.div`
  flex-grow: 1;
  padding: 24px;
  overflow:scroll;
`;

function App() {
  const showSettings = useStore((state) => state.showSettings);
  const tracker = useStore((state) => state.tracker);
  const setTracker = useStore((state) => state.setTracker);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header></Header>
        <Content>
          {(showSettings || !tracker) && <Settings></Settings>}
          {!showSettings && (
            <div>
              {tracker === TRACKERS.POSE && <MPose></MPose>}
              {tracker === TRACKERS.HANDS && <MHands></MHands>}
              {/* {tracker === TRACKERS.FACE_MESH && <MFaceMesh></MFaceMesh>} */}
              {tracker === TRACKERS.TEACHABLE_MACHINE && <TeachableMachine></TeachableMachine>}
              {/* <MFaceMesh></MFaceMesh> */}
              {/* <MHolistic></MHolistic> */}
              {/* <FaceExpression></FaceExpression> */}
            </div>
          )}
        </Content>
        <Footer></Footer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
