import useStore from "./store/store";
import { publish } from "./mqtt";

const send = (address, args) => {
  const state = useStore.getState();
  const logging = useStore((state) => state.logging);

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
    logging("MQTT " + topic + " / " + args)

  }
};
export { send };
