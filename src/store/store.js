import create from "zustand";
import { devtools } from "zustand/middleware";

const TRACKERS = {
  POSE: "POSE",
  HANDS: "HANDS",
};

const useStore = create(
  devtools((set) => ({
    tracker: null,
    oscDestinationHost: "localhost",
    oscDestinationPort: 8000,
    showSettings: false,
    toggleSettings: () =>
      set((state) => ({ showSettings: !state.showSettings })),
    setTracker: (tracker) => set((state) => ({ tracker: tracker })),
    setOscDestinationHost: (host) => {
      window.api?.send("setOscDestinationHost", host);
      set((state) => ({ oscDestinationHost: host }));
    },
    setOscDestinationPort: (port) => {
      window.api?.send("setOscDestinationPort", port);
      set((state) => ({ oscDestinationPort: port }));
    },
  }))
);

export default useStore;
export { TRACKERS };
