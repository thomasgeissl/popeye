import create from "zustand";
import { devtools } from "zustand/middleware";
import { connectClient as connectBroker, setThrottleTime } from "../mqtt";

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
    });
    window.api?.receive("setTeachableMachineModelUrl", (data) => {
      console.log(data);
      set(() => ({
        teachableMachineModelUrl: data,
      }));
    });
    return {
      videoDeviceId: null,
      tracker: TRACKERS.HANDS,
      activePoseLandmarkPoints: [],
      activeHandLandmarkPoints: ["index_finger_tip"], //["pinky_tip", "ring_finger_tip", "middle_finger_tip", "index_finger_tip", "thumb_tip", "wrist"],
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
      oscThrottleTime: 16,
      mqttActive: true,
      mqttBroker: "ws://localhost:9001",
      mqttSessionPrefix: "",
      mqttThrottleTime: 32,
      showSettings: false,
      log: [],
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
      setOscThrottleTime: (oscThrottleTime) => {
        window.api?.send("setOscThrottleTime", oscThrottleTime);
        set((state) => ({ oscThrottleTime }));
      },
      setMqttActive: (active) => {
        set((state) => {
          if (active) {
            connectBroker(state.mqttBroker);
          }
          return { mqttActive: active };
        });
      },
      setMqttBroker: (broker) => {
        set((state) => ({ mqttActive: false, mqttBroker: broker }));
      },
      setMqttSessionPrefix: (mqttSessionPrefix) => {
        set((state) => ({ mqttSessionPrefix }));
      },
      setMqttThrottleTime: (mqttThrottleTime) => {
        setThrottleTime(mqttThrottleTime);
        set((state) => ({ mqttThrottleTime }));
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
      setNoneHandLandmarkPointsActive: () => {
        set((state) => {
          return { activeHandLandmarkPoints: [] };
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
      logging:(msg) => {
        let _log = get().log
        _log.push(msg)
        if(_log.length > 10)
          _log.shift()
        set((state) => {
          return { log: [..._log] };
        });
      },
      clipLog:() => {
        let _log = get().log
          _log.shift()
        set((state) => {
          return { log: [..._log] };
        });
      }
    };
  })
);

export default useStore;
export { TRACKERS, TM_MODE };
