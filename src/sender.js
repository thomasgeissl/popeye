import useStore from "./store/store";
import { publish } from "./mqtt";

import { appWindow } from "@tauri-apps/api/window";

const send = (address, args) => {
  const state = useStore.getState();

  if (state.oscActive) {
    const argsList = [];
    if (args.x && args.y && args.z) {
      argsList.push(args.x);
      argsList.push(args.y);
      argsList.push(args.z);
      if (args.visibility) {
        argsList.push(args.visibility);
      }
    }
    if (args.confidence) {
      argsList.push(args.confidence);
    }
    const oscAddress = state.oscSessionPrefix
      ? `/${state.oscSessionPrefix}/popeye/${address}`
      : `/popeye/${address}`;
    // emit an event that is only visible to the current window
    appWindow?.emit("event-name", {
      host: state.oscDestinationHost,
      port: state.oscDestinationPort,
      address: oscAddress,
      args: argsList,
    });
  }
  if (state.mqttActive) {
    const topic =
      state.mqttSessionPrefix !== ""
        ? `${state.mqttSessionPrefix}/popeye/${address}`
        : `popeye/${address}`;
    publish(topic, args);
    //console.log(topic, args)
  }
};
export { send };
