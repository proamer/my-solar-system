import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import TimeControl from './components/TimeControl';
import { useStore } from './store';

function App() {
  const [selectedBody, setSelectedBody] = useState(null);
  const setFocusedPlanetId = useStore(state => state.setFocusedPlanetId);

  const handleResetFocus = () => {
    setFocusedPlanetId(null);
    setSelectedBody(null);
    // You could also add a way to tell CameraControls to zoom out here, 
    // but we can just let it stay where it is or add an effect in SolarSystem.jsx
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 3D Canvas Container */}
      <SolarSystem onPlanetSelect={(body) => setSelectedBody(body)} />

      {/* UI Overlay */}
      <div className="ui-overlay">
        <header className="header">
          <h1>Solar System</h1>
          <p>Interactive 3D Explorer</p>
        </header>
        
        <div className={`info-panel ${selectedBody ? '' : 'hidden'}`}>
          {selectedBody && (
            <>
              <h2>{selectedBody.name}</h2>
              <p>{selectedBody.description}</p>

              <div style={{ marginTop: '1.5rem' }}>
                <div className="stat">
                  <span>Type</span>
                  <span className="stat-value">{selectedBody.type}</span>
                </div>
                {selectedBody.distance !== undefined && (
                  <div className="stat">
                    <span>Distance from Sun</span>
                    <span className="stat-value">{selectedBody.distance} AU</span>
                  </div>
                )}
                {selectedBody.radius !== undefined && (
                  <div className="stat">
                    <span>Relative Radius</span>
                    <span className="stat-value">{selectedBody.radius}x</span>
                  </div>
                )}
                {selectedBody.moons !== undefined && (
                  <div className="stat">
                    <span>Moons</span>
                    <span className="stat-value">{selectedBody.moons}</span>
                  </div>
                )}
              </div>
              <button className="back-btn" onClick={handleResetFocus}>
                Unfocus
              </button>
            </>
          )}
        </div>
        
        {/* Time Control UI */}
        <TimeControl />
      </div>
    </div>
  );
}

export default App;
