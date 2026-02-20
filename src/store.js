import { create } from 'zustand';

// Starts at J2000 epoch approx or just current time
const START_DATE = new Date();

export const useStore = create((set) => ({
  simulationDate: START_DATE,
  isPlaying: true,
  // speed: how many milliseconds of simulation pass per realtime millisecond
  // Default: Realtime (1 real millisecond = 1 simulation millisecond)
  timeSpeed: 1,
  focusedPlanetId: null,

  // Feature Toggles
  showAsteroids: true,
  showSpacecrafts: true,
  showOrbits: true,
  flightMode: false,
  realisticScale: false,
  showConstellations: false,
  showDwarfs: true,

  setSimulationDate: (date) => set({ simulationDate: date }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setFocusedPlanetId: (id) => set({ focusedPlanetId: id }),
  
  // Toggle Setters
  setShowAsteroids: (val) => set({ showAsteroids: val }),
  setShowSpacecrafts: (val) => set({ showSpacecrafts: val }),
  setShowOrbits: (val) => set({ showOrbits: val }),
  setFlightMode: (val) => set({ flightMode: val }),
  setRealisticScale: (val) => set({ realisticScale: val }),
  setShowConstellations: (val) => set({ showConstellations: val }),
  setShowDwarfs: (val) => set({ showDwarfs: val }),

  advanceTime: (deltaMs) => set((state) => {
    if (!state.isPlaying) return state;
    return {
      simulationDate: new Date(state.simulationDate.getTime() + deltaMs * state.timeSpeed)
    };
  })
}));
