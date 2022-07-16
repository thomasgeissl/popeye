// security find-identity -vp codesigning
// https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  const appName = context.packager.appInfo.productFilename;
  return await notarize({
    appBundleId: "com.thomasgeissl.popeye",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_PASS,
  });
};
