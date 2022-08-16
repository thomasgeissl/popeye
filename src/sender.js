import useStore from "./store/store";
import { publish } from "./mqtt";

const send = (address, args) => {
  const state = useStore.getState();
  if (!state.active) {
    return;
  }
  if (state.oscActive) {
    window.api?.send("sendMessage", {
      address,
      args,
    });
  }
  if (state.mqttActive) {
    const topic = state.mqttSessionPrefix
      ? `${state.mqttSessionPrefix}/popeye/${address}`
      : `popeye/${address}`;
    publish(topic, args);
  }
};
export { send };
