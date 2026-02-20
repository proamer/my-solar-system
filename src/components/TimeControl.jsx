import React from 'react';
import { useStore } from '../store';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

export default function TimeControl() {
  const { simulationDate, isPlaying, timeSpeed, togglePlaying, setTimeSpeed, setSimulationDate } = useStore();

  const handleDateChange = (e) => {
    setSimulationDate(new Date(e.target.value));
  };

  const speedMultiplier = timeSpeed / 86400000; // Relative to 1 day/sec

  return (
    <div className="time-control-panel">
      <div className="date-display">
        {simulationDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
      
      <div className="controls">
        <button onClick={() => setTimeSpeed(timeSpeed / 2)}>
          <Rewind size={16} />
        </button>
        
        <button onClick={togglePlaying} className="play-pause">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button onClick={() => setTimeSpeed(timeSpeed * 2)}>
          <FastForward size={16} />
        </button>
      </div>
      
      <div className="speed-display">
        {speedMultiplier.toFixed(1)}x Speed (Days/Sec)
      </div>

      <input 
        type="date" 
        value={simulationDate.toISOString().split('T')[0]} 
        onChange={handleDateChange}
        className="date-picker"
      />
    </div>
  );
}
