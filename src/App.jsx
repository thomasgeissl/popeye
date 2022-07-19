import { useState } from 'react'
import MPose from './components/MPose'
import MHands from './components/MHands'
import MFaceMesh from './components/MFaceMesh'
import MHolistic from './components/MHolistic'
import FaceExpression from './components/FaceExpression'

function App() {
  return (
    <div className="App">
      {/* <MPose></MPose> */}
      {/* <MHands></MHands> */}
      {/* <MFaceMesh></MFaceMesh> */}
      <MHolistic></MHolistic>
      {/* <FaceExpression></FaceExpression> */}
    </div>
  )
}

export default App
