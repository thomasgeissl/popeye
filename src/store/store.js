import create from "zustand";
import { devtools } from "zustand/middleware";

const TRACKERS = {
  POSE: "POSE",
  HANDS: "HANDS",
};

const useStore = create(
  devtools((set) => ({
    tracker: null,
    oscActive: false,
    oscDestinationHost: "localhost",
    oscDestinationPort: 8000,
    mqttActive: false,
    mqttBroker: "mqtt://localhost:1883",
    showSettings: false,
    toggleSettings: () =>
      set((state) => ({ showSettings: !state.showSettings })),
    setTracker: (tracker) => set((state) => ({ tracker: tracker })),
    setOscActive: (active) => {
      window.api?.send("setOscActive", active);
      set((state) => ({ oscActive: active }));
    },
    setOscDestinationHost: (host) => {
      window.api?.send("setOscDestinationHost", host);
      set((state) => ({ oscDestinationHost: host }));
    },
    setOscDestinationPort: (port) => {
      window.api?.send("setOscDestinationPort", port);
      set((state) => ({ oscDestinationPort: port }));
    },
    setMqttActive: (active) => {
      window.api?.send("setMqttActive", active);
      set((state) => ({ mqttActive: active }));
    },
    setMqttBroker: (broker) => {
      window.api?.send("setMqttBroker", broker);
      set((state) => ({ mqttBroker: broker }));
    },
  }))
);

export default useStore;
export { TRACKERS };
