import React from 'react';
import { useStore } from '../store';
import { Settings } from 'lucide-react';

export default function SettingsPanel() {
  const {
    showAsteroids, setShowAsteroids,
    showSpacecrafts, setShowSpacecrafts,
    showOrbits, setShowOrbits,
    flightMode, setFlightMode,
    realisticScale, setRealisticScale,
    showConstellations, setShowConstellations,
    showDwarfs, setShowDwarfs
  } = useStore();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <button className="settings-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="settings-content">
          <h3>Simulation Settings</h3>
          
          <div className="setting-group">
            <h4>Visuals</h4>
            <label>
              <input type="checkbox" checked={showOrbits} onChange={(e) => setShowOrbits(e.target.checked)} />
              Show Orbit Trails
            </label>
            <label>
              <input type="checkbox" checked={showConstellations} onChange={(e) => setShowConstellations(e.target.checked)} />
              Show Constellations
            </label>
            <label className="warning">
              <input type="checkbox" checked={realisticScale} onChange={(e) => setRealisticScale(e.target.checked)} />
              True Scale (Warning: Planets very small)
            </label>
          </div>

          <div className="setting-group">
            <h4>Celestial Bodies</h4>
            <label>
              <input type="checkbox" checked={showAsteroids} onChange={(e) => setShowAsteroids(e.target.checked)} />
              Show Asteroid Belts
            </label>
            <label>
              <input type="checkbox" checked={showDwarfs} onChange={(e) => setShowDwarfs(e.target.checked)} />
              Show Dwarf Planets
            </label>
            <label>
              <input type="checkbox" checked={showSpacecrafts} onChange={(e) => setShowSpacecrafts(e.target.checked)} />
              Show Spacecraft
            </label>
          </div>

          <div className="setting-group">
            <h4>Controls</h4>
            <label className="flight-mode">
              <input type="checkbox" checked={flightMode} onChange={(e) => setFlightMode(e.target.checked)} />
              Flight Mode (WASD)
            </label>
            {flightMode && (
              <p className="hint">Use W,A,S,D to move and mouse to look around.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
