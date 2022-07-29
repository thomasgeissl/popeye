import packageJson from "../../package.json";
import styled from "@emotion/styled";
import { ThemeOptions } from "../theme";

const Container = styled.div`
  background-color: ${ThemeOptions.palette.primary.main};
  display:flex;
  flex-direction:row;
`;
const Spacer = styled.div`
flex-grow:1;
`;
function Footer() {
  return (
    <Container>
      <Spacer></Spacer>
      {packageJson.version} ({COMMIT_HASH.trim()})
    </Container>
  );
}

export default Footer;
