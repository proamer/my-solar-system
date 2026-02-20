import { create } from 'zustand';

// Starts at J2000 epoch approx or just current time
const START_DATE = new Date();

export const useStore = create((set) => ({
  simulationDate: START_DATE,
  isPlaying: true,
  // speed: how many milliseconds of simulation pass per realtime millisecond
  // Decreased to 1 real second = 1 simulation hour (3600000 ms) instead of 1 day
  timeSpeed: 3600000, 
  focusedPlanetId: null,

  setSimulationDate: (date) => set({ simulationDate: date }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setFocusedPlanetId: (id) => set({ focusedPlanetId: id }),
  advanceTime: (deltaMs) => set((state) => {
    if (!state.isPlaying) return state;
    return {
      simulationDate: new Date(state.simulationDate.getTime() + deltaMs * state.timeSpeed)
    };
  })
}));
