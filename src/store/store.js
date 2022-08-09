import create from "zustand";
import { devtools } from "zustand/middleware";

const TRACKERS = {
  POSE: "POSE",
  HANDS: "HANDS",
  // FACE_MESH: "FACE_MESH",
  TEACHABLE_MACHINE: "TEACHABLE_MACHINE",
};

const useStore = create(
  devtools((set) => ({
    videoDeviceId: null,
    tracker: null,
    teachableMachineModelUrl:
      "https://teachablemachine.withgoogle.com/models/4F0vC57p4/",
    active: true,
    oscActive: false,
    oscDestinationHost: "localhost",
    oscDestinationPort: 8000,
    oscSessionPrefix: "",
    mqttActive: false,
    mqttBroker: "mqtt://localhost:1883",
    showSettings: true,
    toggleSettings: () =>
      set((state) => ({ showSettings: !state.showSettings })),
    setTracker: (tracker) => set((state) => ({ tracker: tracker })),
    setVideoDeviceId: (videoDeviceId) =>
      set((state) => ({ videoDeviceId: videoDeviceId })),
    setActive: (active) => {
      window.api?.send("setActive", active);
      set((state) => ({ active: active }));
    },
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
    setOscSessionPrefix: (oscSessionPrefix) => {
      window.api?.send("setOscSessionPrefix", oscSessionPrefix);
      set((state) => ({ oscSessionPrefix }));
    },
    setMqttActive: (active) => {
      window.api?.send("setMqttActive", active);
      set((state) => ({ mqttActive: active }));
    },
    setMqttBroker: (broker) => {
      window.api?.send("setMqttBroker", broker);
      set((state) => ({ mqttBroker: broker }));
    },
    setMqttSessionPrefix: (mqttSessionPrefix) => {
      window.api?.send("setMqttSessionPrefix", mqttSessionPrefix);
      set((state) => ({ mqttSessionPrefix }));
    },
    setTeachableMachineModelUrl: (teachableMachineModelUrl) => {
      set((state) => ({ teachableMachineModelUrl }));
    },
  }))
);

export default useStore;
export { TRACKERS };
