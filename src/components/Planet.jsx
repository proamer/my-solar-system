import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

export default function Planet({ planet, onSelect }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const ringRef = useRef();
  const [hovered, setHover] = useState(false);

  // Load planet texture
  const texture = useTexture(planet.texture);
  
  // Load ring texture if needed
  const ringTexture = planet.hasRings && planet.ringTexture ? useTexture(planet.ringTexture) : null;

  const setFocusedPlanetId = useStore(state => state.setFocusedPlanetId);

  // Generate orbit path points
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * planet.distance, 0, Math.sin(theta) * planet.distance));
  }

  useFrame((state, delta) => {
    // Fetch global time directly from store state avoiding reactivity overhead in useFrame
    const simulationDate = useStore.getState().simulationDate;
    
    // Calculate how many days have passed since a reference epoch (e.g. 2000-01-01)
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
    
    // Calculate angle based on planet speed (radians per day)
    const angle = elapsedDays * planet.speed;
    
    // Convert polar coordinates to cartesian for the group's position
    const x = Math.cos(angle) * planet.distance;
    const z = Math.sin(angle) * planet.distance;
    
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    
    if (meshRef.current) {
      // Rotation on its own axis based on elapsed days
      meshRef.current.rotation.y = elapsedDays * planet.rotationSpeed;
    }
    
    if (ringRef.current) {
      // Rings rotate slightly
      ringRef.current.rotation.z = elapsedDays * planet.rotationSpeed * 0.5;
    }
  });

  return (
    <>
      {/* Orbit Line */}
      <Line
        points={points}
        color={hovered ? "#aaaaaa" : "#333333"}
        lineWidth={1}
        transparent
        opacity={hovered ? 0.8 : 0.3}
      />

      {/* Planet Group (Positioned on the orbit) */}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation(); // Prevent clicks from passing through
            onSelect(planet);
            setFocusedPlanetId(planet.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[planet.radius, 64, 64]} />
          <meshStandardMaterial 
            map={texture}
            color={planet.color} 
            roughness={0.7} 
            metalness={0.2}
            emissive={hovered ? planet.color : "#000000"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>

        {/* Planet Rings, if any */}
        {planet.hasRings && (
          <mesh ref={ringRef} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
            <ringGeometry args={[planet.ringInnerRadius, planet.ringOuterRadius, 64]} />
            <meshStandardMaterial 
              map={ringTexture}
              color={planet.ringColor} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.8}
              roughness={0.8}
            />
          </mesh>
        )}
      </group>
    </>
  );
}
