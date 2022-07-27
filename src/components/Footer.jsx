import packageJson from "../../package.json";
import styled from "@emotion/styled";

const Container = styled.div`
  background-color: lightgreen;
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
