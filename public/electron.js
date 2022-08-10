// Module to control the application lifecycle and the native browser window.
const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  systemPreferences,
} = require("electron");
const path = require("path");
const url = require("url");

const { Client, Message } = require("node-osc");
const mqtt = require("mqtt");
let oscClient = new Client("127.0.0.1", 8000);
let mqttClient = mqtt.connect("mqtt://localhost:1883");
let oscSessionPrefix = "";
let mqttSessionPrefix = "";

let active = true;
let oscActive = false;
let mqttActive = false;

mqttClient.on("connect", function () {
  mqttClient.subscribe("presence", function (err) {
    if (!err) {
      mqttClient.publish("presence", "Hello mqtt");
    }
  });
});

mqttClient.on("message", function (topic, message) {});

// const camera = systemPreferences.askForMediaAccess("camera");

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const appURL = app.isPackaged
    ? // ? url.format({
      //     pathname: path.join(__dirname, "index.html"),
      //     protocol: "file:",
      //     slashes: true,
      //   })
      `file://${path.join(__dirname, "..", "dist", "index.html")}`
    : "http://localhost:5173";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

async function askForMediaAccess() {
  try {
    if (platform !== "darwin") {
      return true;
    }

    const status = await systemPreferences.getMediaAccessStatus("camera");
    log.info("Current camera access status:", status);

    if (status === "not-determined") {
      const success = await systemPreferences.askForMediaAccess("camera");
      log.info(
        "Result of camera access:",
        success.valueOf() ? "granted" : "denied"
      );
      return success.valueOf();
    }

    return status === "granted";
  } catch (error) {
    log.error("Could not get camera permission:", error.message);
  }
  return false;
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // await askForMediaAccess();
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("sendMessage", (event, arg) => {
  if (!active) {
    return;
  }
  // console.log(arg);
  if (oscActive) {
    const oscAddress = `${oscSessionPrefix}/popeye/${arg.address}`;
    const message = new Message(oscAddress);
    arg?.args.forEach((arg) => {
      if (typeof arg === "object") {
        message.append(arg.x);
        message.append(arg.y);
        message.append(arg.z);
      } else {
        message.append(arg);
      }
    });
    oscClient.send(message, (err) => {
      if (err) {
        console.error(new Error(err));
      }
    });
  }

  if (mqttActive) {
    const topic = `${mqttSessionPrefx}/popeye/${arg.address}`;
    mqttClient.publish(topic, JSON.stringify(arg));
  }
});
ipcMain.on("setActive", (event, arg) => {
  active = arg;
});
ipcMain.on("setOscActive", (event, arg) => {
  oscActive = arg;
});
ipcMain.on("setOscDestinationHost", (event, arg) => {
  oscClient = new Client(arg, oscClient.port);
});
ipcMain.on("setOscDestinationPort", (event, arg) => {
  oscClient = new Client(oscClient.host, arg);
});
ipcMain.on("setOscSessionPrefix", (event, arg) => {
  oscSessionPrefx = arg;
});
ipcMain.on("setMqttActive", (event, arg) => {
  mqttActive = arg;
});
ipcMain.on("setMqttBroker", (event, arg) => {
  mqttClient = mqtt.connect(arg);
});
ipcMain.on("setMqttSessionPrefix", (event, arg) => {
  mqttSessionPrefx = arg;
});
