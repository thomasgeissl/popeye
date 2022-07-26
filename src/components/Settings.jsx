import { useState } from "react";
import styled from "@emotion/styled";
import useStore from "../store/store";
import { TRACKERS } from "../store/store";
import { TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex-grow: 1;
  position: relative;
`;

function Settings() {
  const tracker = useStore((state) => state.tracker);
  const setTracker = useStore((state) => state.setTracker);
  const oscDestinationPort = useStore((state) => state.oscDestinationPort);
  const setOscDestinationPort = useStore(
    (state) => state.setOscDestinationPort
  );
  const oscDestinationHost = useStore((state) => state.oscDestinationHost);
  const setOscDestinationHost = useStore(
    (state) => state.setOscDestinationHost
  );

  return (
    <Container>
      <h2>trackers</h2>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={tracker}
        onChange={(event)=>setTracker(event.target.value)}
      >
        {Object.entries(TRACKERS).map(([key, value]) => {
          return (
            <FormControlLabel
              value={value}
              key={key}
              control={<Radio />}
              label={value}
            ></FormControlLabel>
          );
        })}
      </RadioGroup>
      <ul></ul>
      <h2>output</h2>
      <TextField
        label="host"
        variant="outlined"
        value={oscDestinationHost}
        onChange={(event) => {
          setOscDestinationHost(event.target.value);
        }}
      />
      <TextField
        label="port"
        variant="outlined"
        value={oscDestinationPort}
        onChange={(event) => {
          setOscDestinationPort(event.target.value);
        }}
      />
    </Container>
  );
}

export default Settings;
