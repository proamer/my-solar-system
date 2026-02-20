import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, FlyControls, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';
import Planet from './Planet';
import AsteroidBelt from './AsteroidBelt';
import Spacecraft from './Spacecraft';
import Constellations from './Constellations';
import { planetsData } from '../data/planets';
import { spacecraftsData } from '../data/spacecrafts';

function Sun({ onSelect }) {
  const meshRef = useRef();
  const sunTexture = useTexture('/textures/sun.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect({
          id: 'sun',
          name: 'Sun',
          description: 'The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds the solar system together.',
          type: 'Star',
          radius: 3 // visual scale
        });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[3, 64, 64]} />
      {/* Sun material uses an emissive glow */}
      <meshBasicMaterial map={sunTexture} color="#ffffff" />
    </mesh>
  );
}

function SceneController() {
  const cameraControlsRef = useRef();
  const focusedPlanetId = useStore(state => state.focusedPlanetId);

  const getBodyData = (id) => {
    // Check planets and dwarfs
    for (const p of planetsData) {
      if (p.id === id) return { type: 'planet', body: p };
      if (p.satellites) {
        const sat = p.satellites.find(s => s.id === id);
        if (sat) return { type: 'satellite', body: sat, parent: p };
      }
    }
    // Check spacecrafts
    const sc = spacecraftsData.find(s => s.id === id);
    if (sc) return { type: 'spacecraft', body: sc };
    
    return null;
  };

  const getBodyPosition = (bodyData, elapsedDays) => {
    if (bodyData.type === 'planet' || bodyData.type === 'spacecraft') {
      const angle = elapsedDays * bodyData.body.speed;
      return {
        x: Math.cos(angle) * bodyData.body.distance,
        z: Math.sin(angle) * bodyData.body.distance
      };
    } else {
      const pAngle = elapsedDays * bodyData.parent.speed;
      const px = Math.cos(pAngle) * bodyData.parent.distance;
      const pz = Math.sin(pAngle) * bodyData.parent.distance;
      
      const sAngle = elapsedDays * bodyData.body.speed;
      const sx = Math.cos(sAngle) * bodyData.body.distance;
      const sz = Math.sin(sAngle) * bodyData.body.distance;
      
      return {
        x: px + sx,
        z: pz + sz
      };
    }
  };

  useEffect(() => {
    if (!cameraControlsRef.current || !focusedPlanetId) return;
    
    // Initial zoom-in animation when a planet is clicked
    if (focusedPlanetId === 'sun') {
      cameraControlsRef.current.setLookAt(0, 10, 25, 0, 0, 0, true);
      return;
    }
    
    const bodyData = getBodyData(focusedPlanetId);
    if (bodyData) {
      const simulationDate = useStore.getState().simulationDate;
      const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
      const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
      
      const { x, z } = getBodyPosition(bodyData, elapsedDays);
      
      // Calculate a good offset based on planet radius
      const offset = bodyData.body.radius * 5;
      cameraControlsRef.current.setLookAt(x + offset, offset, z + offset, x, 0, z, true);
    }
  }, [focusedPlanetId]);

  useFrame((state, delta) => {
    // Advance simulation time
    useStore.getState().advanceTime(delta * 1000);
    
    // Continuously pan target for focused planet
    if (focusedPlanetId && cameraControlsRef.current && focusedPlanetId !== 'sun') {
      const bodyData = getBodyData(focusedPlanetId);
      if (bodyData) {
        const simulationDate = useStore.getState().simulationDate;
        const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
        const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
        
        const { x, z } = getBodyPosition(bodyData, elapsedDays);
        
        // Slowly update target without interrupting rotation controls (animation false)
        cameraControlsRef.current.setTarget(x, 0, z, false);
      }
    }
  });

  return (
    <>
      <CameraControls ref={cameraControlsRef} maxDistance={200} minDistance={1} />
    </>
  );
}

export default function SolarSystem({ onPlanetSelect }) {
  const showAsteroids = useStore(state => state.showAsteroids);
  const showSpacecrafts = useStore(state => state.showSpacecrafts);
  const showDwarfs = useStore(state => state.showDwarfs);
  const showConstellations = useStore(state => state.showConstellations);
  const flightMode = useStore(state => state.flightMode);

  // Filter planets based on dwarf setting
  const visiblePlanets = planetsData.filter(p => showDwarfs || p.type !== 'Dwarf Planet');

  return (
    <Canvas camera={{ position: [0, 40, 80], fov: 45 }}>
      {/* Dark space background with stars */}
      <color attach="background" args={['#050505']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      {/* The sun's light radiating outwards */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={2.5} 
        color="#fff4e0" 
        distance={200}
        decay={1.2}
      />

      {/* Sun */}
      <Sun onSelect={onPlanetSelect} />

      {/* Asteroid Belts */}
      {showAsteroids && (
        <>
          {/* Main Asteroid Belt (Between Mars and Jupiter) */}
          <AsteroidBelt innerRadius={18} outerRadius={21} count={2000} color="#888888" />
          {/* Kuiper Belt (Beyond Neptune) */}
          <AsteroidBelt innerRadius={55} outerRadius={65} count={3000} color="#667788" />
        </>
      )}

      {/* Planets and Dwarfs */}
      {visiblePlanets.map((planet) => (
        <Planet 
          key={planet.id} 
          planet={planet} 
          onSelect={onPlanetSelect} 
        />
      ))}

      {/* Spacecrafts */}
      {showSpacecrafts && spacecraftsData.map((sc) => (
        <Spacecraft 
          key={sc.id} 
          spacecraft={sc} 
          onSelect={onPlanetSelect} 
        />
      ))}

      {/* Constellations */}
      {showConstellations && <Constellations />}

      {/* Interaction Controls with Logic */}
      {!flightMode && <SceneController />}
      {flightMode && <FlyControls rollSpeed={0.5} movementSpeed={20} dragToLook={true} />}

      {/* Postprocessing for the Sun's glow */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
      </EffectComposer>
    </Canvas>
  );
}
