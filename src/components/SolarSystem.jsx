import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
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

      {/* Interaction Controls */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxDistance={150}
        minDistance={5}
      />

      {/* Postprocessing for the Sun's glow */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
      </EffectComposer>
    </Canvas>
  );
}
