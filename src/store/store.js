import create from "zustand";
import { devtools } from "zustand/middleware";
import { connectClient as connectBroker } from "../mqtt";

const TRACKERS = {
  POSE: "POSE",
  HANDS: "HANDS",
  // FACE_MESH: "FACE_MESH",
  TEACHABLE_MACHINE: "TEACHABLE_MACHINE",
};
const TM_MODE = {
  IMAGE: "IMAGE",
  POSE: "POSE",
};

import { landmarkPoints as poseLandmarkPoints } from "../components/MPose";
import { landmarkPoints as handLandmarkPoints } from "../components/MHands";

const useStore = create(
  devtools((set, get) => {
    window.api?.receive("load", (data) => {
      set(() => data);
      window.api?.send("setActive", data.active);
      window.api?.send("setOscActive", data.oscActive);
      window.api?.send("setOscDestinationHost", data.oscDestinationHost);
      window.api?.send("setOscDestinationPort", data.oscDestinationPort);
      window.api?.send("setOscSessionPrefix", data.oscSessionPrefix);
      window.api?.send("setMqttActive", data.mqttActive);
      window.api?.send("setMqttBroker", data.mqttBroker);
      window.api?.send("setMqttSessionPrefix", data.mqttSessionPrefix);
    });
    window.api?.receive("setTeachableMachineModelUrl", (data) => {
      console.log(data);
      set(() => ({
        teachableMachineModelUrl: data,
      }));
    });
    return {
      videoDeviceId: null,
      tracker: null,
      activePoseLandmarkPoints: [],
      activeHandLandmarkPoints: [],
      allPoseLandmarkPointsAsJson: false,
      allHandLandmarkPointsAsJson: false,
      teachableMachineModelUrl:
        "https://teachablemachine.withgoogle.com/models/4F0vC57p4/",
      tmMode: TM_MODE.IMAGE,
      active: true,
      oscActive: false,
      oscDestinationHost: "localhost",
      oscDestinationPort: 8000,
      oscSessionPrefix: "",
      mqttActive: false,
      mqttBroker: "ws://localhost:9001",
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
        // window.api?.send("setMqttActive", active);
        set((state) => {
          if (active) {
            connectBroker(state.broker);
          }
          return { mqttActive: active };
        });
      },
      setMqttBroker: (broker) => {
        // window.api?.send("setMqttBroker", broker);
        set((state) => ({ mqttActive: false, mqttBroker: broker }));
      },
      setMqttSessionPrefix: (mqttSessionPrefix) => {
        // window.api?.send("setMqttSessionPrefix", mqttSessionPrefix);
        set((state) => ({ mqttSessionPrefix }));
      },
      toggleActivePoseLandmarkPoint: (landmarkPoint) => {
        set((state) => {
          let activePoseLandmarkPoints = [...state.activePoseLandmarkPoints];
          if (activePoseLandmarkPoints.includes(landmarkPoint)) {
            activePoseLandmarkPoints.splice(
              activePoseLandmarkPoints.indexOf(landmarkPoint),
              1
            );
          } else {
            activePoseLandmarkPoints.push(landmarkPoint);
          }
          return { activePoseLandmarkPoints };
        });
      },
      setAllPoseLandmarkPointsActive: () => {
        set((state) => {
          return { activePoseLandmarkPoints: [...poseLandmarkPoints] };
        });
      },
      setAllPoseLandmarkPointsAsJson: (allPoseLandmarkPointsAsJson) => {
        set((state) => {
          return { allPoseLandmarkPointsAsJson };
        });
      },
      toggleActiveHandLandmarkPoint: (landmarkPoint) => {
        set((state) => {
          let activeHandLandmarkPoints = [...state.activeHandLandmarkPoints];
          if (activeHandLandmarkPoints.includes(landmarkPoint)) {
            activeHandLandmarkPoints.splice(
              activeHandLandmarkPoints.indexOf(landmarkPoint),
              1
            );
          } else {
            activeHandLandmarkPoints.push(landmarkPoint);
          }
          return { activeHandLandmarkPoints };
        });
      },
      setAllHandLandmarkPointsActive: () => {
        set((state) => {
          return { activeHandLandmarkPoints: [...handLandmarkPoints] };
        });
      },
      setAllHandLandmarkPointsAsJson: (allHandLandmarkPointsAsJson) => {
        set((state) => {
          return { allHandLandmarkPointsAsJson };
        });
      },
      setTeachableMachineModelUrl: (teachableMachineModelUrl) => {
        set((state) => ({ teachableMachineModelUrl }));
      },
      setTmMode: (tmMode) => {
        set((state) => ({ tmMode }));
      },
      save: () => {
        const state = get();
        window.api?.send("save", JSON.stringify(state));
      },
    };
  })
);

export default useStore;
export { TRACKERS, TM_MODE };
