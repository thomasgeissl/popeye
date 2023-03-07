import useStore from "./store/store";
import { publish } from "./mqtt";

const send = (address, args) => {
  const state = useStore.getState();

  if (state.oscActive) {
    const argsList = [];
    if (args.x && args.y && args.z) {
      argsList.push(args.x);
      argsList.push(args.y);
      argsList.push(args.z);
      if(args.visibility){
        argsList.push(args.visibility);
      }
    }
    if (args.confidence) {
      argsList.push(args.confidence);
    }
    const oscAddress = state.oscSessionPrefix
    ? `/${state.oscSessionPrefix}/popeye/${address}`
    : `/popeye/${address}`;
    window.api?.send("sendMessage", {
      address: oscAddress,
      args: argsList,
    });
  }
  if (state.mqttActive) {
    const topic = state.mqttSessionPrefix !== ""
      ? `${state.mqttSessionPrefix}/popeye/${address}`
      : `popeye/${address}`;
    publish(topic, args);
    //console.log(topic, args)
  }
};
export { send };
