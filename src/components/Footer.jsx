import packageJson from "../../package.json"
function Footer() {
  return <div>{packageJson.version}({COMMIT_HASH})</div>;
}

export default Footer;
