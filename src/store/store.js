import create from "zustand";
import { devtools } from "zustand/middleware";
import { connectClient as connectBroker, setThrottleTime } from "../mqtt";

const TRACKERS = {
  COCOSSD: "COCOSSD",
  POSE: "POSE",
  HANDS: "HANDS",
  // FACE_MESH: "FACE_MESH",
  TEACHABLE_MACHINE: "TEACHABLE_MACHINE",
};
const TM_MODE = {
  IMAGE: "IMAGE",
  POSE: "POSE",
};

// import { landmarkPoints as poseLandmarkPoints } from "../components/MPose";
// import { landmarkPoints as handLandmarkPoints } from "../components/MHands";
import { send } from "../sender";

const useStore = create(
  devtools((set, get) => {
    window.api?.receive("load", (data) => {
      set(() => data);
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
      landmarkPoints: [], //["left_eye", "right_eye"], //["pinky_tip", "ring_finger_tip", "middle_finger_tip", "index_finger_tip", "thumb_tip", "wrist"],
      allPoseLandmarkPointsAsJson: false,
      allHandLandmarkPointsAsJson: false,
      teachableMachineModelUrl:
        "https://teachablemachine.withgoogle.com/models/22h08P6zo/",
      tmMode: TM_MODE.IMAGE,
      active: true,
      oscActive: false,
      oscDestinationHost: "127.0.0.1",
      oscDestinationPort: 8000,
      oscSessionPrefix: "",
      oscThrottleTime: 16,
      mqttStatus: "connecting",
      mqttActive: false,
      mqttProtocol: "ws",
      mqttHost: "127.0.0.1",
      mqttPort: "9001",
      mqttSessionPrefix: "",
      mqttThrottleTime: 32,
      showSettings: false,

      log: [],
      toggleSettings: () =>
        set((state) => ({ showSettings: !state.showSettings })),
      setTracker: (tracker) =>
        set((state) => {
          return { 
            landmarkPoints: [],
            tracker: tracker };
        }),
      setVideoDeviceId: (videoDeviceId) =>
        set((state) => ({ videoDeviceId: videoDeviceId })),
      setOscActive: (active) => {
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
            connectBroker(
              state.mqttProtocol,
              state.mqttHost,
              state.mqttPort,
              (broker) => {
                get().setMqttStatus("connected");
              },
              (broker) => {
                get().setMqttStatus("connecting");
              }
            );
          }
          return { mqttActive: active };
        });
      },
      setMqttProtocol: (protocol) => {
        set((state) => ({ mqttActive: false, mqttProtocol: protocol }));
      },
      setMqttHost: (host) => {
        set((state) => ({ mqttActive: false, mqttHost: host }));
      },
      setMqttPort: (port) => {
        set((state) => ({ mqttActive: false, mqttPort: port }));
      },
      setMqttSessionPrefix: (mqttSessionPrefix) => {
        set((state) => ({ mqttSessionPrefix }));
      },
      setMqttThrottleTime: (mqttThrottleTime) => {
        setThrottleTime(mqttThrottleTime);
        set((state) => ({ mqttThrottleTime }));
      },
      setMqttStatus: (mqttStatus) => {
        set((state) => ({ mqttStatus }));
      },
      setAllPoseLandmarkPointsAsJson: (allPoseLandmarkPointsAsJson) => {
        set((state) => {
          return { allPoseLandmarkPointsAsJson };
        });
      },
      setAllHandLandmarkPointsAsJson: (allHandLandmarkPointsAsJson) => {
        set((state) => {
          return { allHandLandmarkPointsAsJson };
        });
      },
      addLandmarkPoints: (landmarkPoints) => {
        set((state) => {
          return {
            landmarkPoints: [...state.landmarkPoints, ...landmarkPoints],
          };
        });
      },
      toggleLandmarkPoint: (landmarkPoint) => {
        set((state) => {
          let landmarkPoints = [...state.landmarkPoints];
          if (landmarkPoints.includes(landmarkPoint)) {
            landmarkPoints.splice(landmarkPoints.indexOf(landmarkPoint), 1);
          } else {
            landmarkPoints.push(landmarkPoint);
          }
          return { landmarkPoints };
        });
      },
      clearLandmarkPoints: () => {
        set(() => {
          return { landmarkPoints: [] };
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
      send: (topic, value) => {
        set((state) => {
          const newEntries = [];
          if (state.mqttActive) {
            newEntries.push({
              type: "MQTT",
              topic:
                state.mqttSessionPrefix !== ""
                  ? `${state.mqttSessionPrefix}/popeye/${topic}`
                  : `popeye/${topic}`,
              args: value,
            });
          }
          if (state.oscActive) {
            newEntries.push({
              type: "OSC",
              topic:
                state.oscSessionPrefix !== ""
                  ? `/${state.oscSessionPrefix}/popeye/${topic}`
                  : `/popeye/${topic}`,
              args: value,
            });
          }
          return {
            log: [...newEntries, ...state.log].slice(0, 10),
          };
        });
        send(topic, value);
      },
      clipLog: () => {
        let _log = get().log;
        _log.shift();
        set((state) => {
          return { log: [..._log] };
        });
      },
    };
  })
);

export default useStore;
export { TRACKERS, TM_MODE };
