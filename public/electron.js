const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const url = require("url");
const cors = require("cors");

const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  systemPreferences,
  dialog,
  session,
} = require("electron");
const Express = require("express");
const { Client, Message } = require("node-osc");

const debounce = require("lodash.debounce");
const throttle = require("lodash.throttle");

const express = Express();
const port = 3333;
express.use(
  cors({
    origin: "*",
  })
);
express.use("/model", Express.static(app.getPath("userData")));
express.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// https://levelup.gitconnected.com/use-tensorflow-js-models-in-offline-applications-a7b5b0c67d4
protocol.registerSchemesAsPrivileged([
  {
    scheme: "static",
    privileges: {
      standard: true,
      supportFetchAPI: true,
      bypassCSP: true,
      secure: true,
    },
  },
]);

let mainWindow;
let oscClient = new Client("127.0.0.1", 8000);
let oscSessionPrefix = "";

let active = true;
let oscActive = false;
let oscThrottleTime = 16;

// const camera = systemPreferences.askForMediaAccess("camera");

const throttledSendFunctions = {};
const sendThrottledMessage = (address, message) => {
  if (!Object.keys(throttledSendFunctions).includes(address)) {
    throttledSendFunctions[address] = throttle((message) => {
      oscClient.send(message, (err) => {
        if (err) {
          console.error(new Error(err));
        }
      });
    }, oscThrottleTime);
  }
  console.log(oscThrottleTime);
  throttledSendFunctions[address](message);
};

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
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
  session.defaultSession.protocol.registerFileProtocol(
    "static",
    (request, callback) => {
      const fileUrl = request.url.replace("static://", "");
      // const filePath = path.join(app.getAppPath(), '.webpack/renderer', fileUrl);
      callback({ path: path.normalize(`${__dirname}/${fileUrl}`) });
    }
  );
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
    sendThrottledMessage(oscAddress, message);
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
  oscSessionPrefix = arg;
});
ipcMain.on("setOscThrottleTime", (event, arg) => {
  for (const prop of Object.getOwnPropertyNames(throttledSendFunctions)) {
    delete throttledSendFunctions[prop];
  }
  oscThrottleTime = arg;
});

ipcMain.on("save", (event, arg) => {
  dialog
    .showSaveDialog(mainWindow, {
      defaultPath: path.join(app.getPath("home"), "popeye_settings.json"),
    })
    .then((result) => {
      if (!result.canceled) {
        fs.writeFile(result.filePath, arg, (err, data) => {});
      }
    });
});
ipcMain.on("load", (event, arg) => {
  dialog
    .showOpenDialog(mainWindow, {
      defaultPath: app.getPath("home"),
      properties: ["openFile"],
    })
    .then((result) => {
      if (!result.canceled) {
        fs.readFile(result.filePaths[0], (err, data) => {
          if (err) throw err;
          const state = JSON.parse(data);
          mainWindow.webContents.send("load", state);
        });
      }
    });
});
ipcMain.on("loadTeachableMachineModel", (event, arg) => {
  dialog
    .showOpenDialog(mainWindow, {
      defaultPath: app.getPath("home"),
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        console.log(app.getPath("userData"));
        const sourcePath = result.filePaths[0];
        const destinationPath = path.join(
          app.getPath("userData"),
          "model",
          path.basename(sourcePath)
        );
        fse.copy(sourcePath, destinationPath, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            mainWindow.webContents.send(
              "setTeachableMachineModelUrl",
              `http://localhost:3333/model/${path.basename(destinationPath)}`
            );
          }
        });
      }
    });
});
