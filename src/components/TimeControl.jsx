import React from 'react';
import { useStore } from '../store';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

export default function TimeControl() {
  const { simulationDate, isPlaying, timeSpeed, togglePlaying, setTimeSpeed, setSimulationDate } = useStore();

  const handleDateChange = (e) => {
    setSimulationDate(new Date(e.target.value));
  };

  const getSpeedLabel = (speed) => {
    if (speed === 1) return "Realtime";
    if (speed < 1000) return `${speed.toFixed(1)}x Realtime`;
    if (speed < 86400000) return `${(speed / 3600000).toFixed(1)} Hrs/Sec`;
    return `${(speed / 86400000).toFixed(1)} Days/Sec`;
  };

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
        {getSpeedLabel(timeSpeed)}
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
