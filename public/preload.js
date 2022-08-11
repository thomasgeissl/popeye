// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);

  contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [
        "setActive",
        "setOscActive",
        "setOscDestinationPort",
        "setOscDestinationHost",
        "setMqttActive",
        "setMqttBroker",
        "sendMessage",
        "setOscSessionPrefix",
        "setMqttSessionPrefix",
        "save",
        "load",
        "loadTeachableMachineModel",
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain", "load", "setTeachableMachineModelUrl"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  });
});
