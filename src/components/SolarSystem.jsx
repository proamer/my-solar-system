import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';
import Planet from './Planet';
import { planetsData } from '../data/planets';

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

  useEffect(() => {
    if (!cameraControlsRef.current || !focusedPlanetId) return;
    
    // Initial zoom-in animation when a planet is clicked
    if (focusedPlanetId === 'sun') {
      cameraControlsRef.current.setLookAt(0, 10, 25, 0, 0, 0, true);
      return;
    }
    
    const planet = planetsData.find(p => p.id === focusedPlanetId);
    if (planet) {
      const simulationDate = useStore.getState().simulationDate;
      const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
      const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
      const angle = elapsedDays * planet.speed;
      const px = Math.cos(angle) * planet.distance;
      const pz = Math.sin(angle) * planet.distance;
      
      // Calculate a good offset based on planet radius
      const offset = planet.radius * 5;
      cameraControlsRef.current.setLookAt(px + offset, offset, pz + offset, px, 0, pz, true);
    }
  }, [focusedPlanetId]);

  useFrame((state, delta) => {
    // Advance simulation time
    useStore.getState().advanceTime(delta * 1000);
    
    // Continuously pan target for focused planet
    if (focusedPlanetId && cameraControlsRef.current && focusedPlanetId !== 'sun') {
      const planet = planetsData.find(p => p.id === focusedPlanetId);
      if (planet) {
        const simulationDate = useStore.getState().simulationDate;
        const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
        const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
        const angle = elapsedDays * planet.speed;
        const px = Math.cos(angle) * planet.distance;
        const pz = Math.sin(angle) * planet.distance;
        
        // Slowly update target without interrupting rotation controls (animation false)
        cameraControlsRef.current.setTarget(px, 0, pz, false);
      }
    }
  });

  return <CameraControls ref={cameraControlsRef} maxDistance={200} minDistance={1} />;
}

export default function SolarSystem({ onPlanetSelect }) {
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

      {/* Planets */}
      {planetsData.map((planet) => (
        <Planet 
          key={planet.id} 
          planet={planet} 
          onSelect={onPlanetSelect} 
        />
      ))}

      {/* Interaction Controls with Logic */}
      <SceneController />

      {/* Postprocessing for the Sun's glow */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
      </EffectComposer>
    </Canvas>
  );
}
