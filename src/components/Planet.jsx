import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

function Satellite({ satellite, onSelect, parentPlanet }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHover] = useState(false);
  const setFocusedPlanetId = useStore(state => state.setFocusedPlanetId);
  const showOrbits = useStore(state => state.showOrbits);
  const realisticScale = useStore(state => state.realisticScale);

  const texture = useTexture(satellite.texture);

  // Apply scaling
  const sRadius = realisticScale ? satellite.radius * 0.05 : satellite.radius;
  const sDistance = realisticScale ? satellite.distance * 2 : satellite.distance;

  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * sDistance, 0, Math.sin(theta) * sDistance));
  }

  useFrame(() => {
    const simulationDate = useStore.getState().simulationDate;
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
    
    const angle = elapsedDays * satellite.speed;
    const x = Math.cos(angle) * sDistance;
    const z = Math.sin(angle) * sDistance;
    
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsedDays * satellite.rotationSpeed;
    }
  });

  return (
    <>
      {showOrbits && (
        <Line
          points={points}
          color="#777777"
          lineWidth={0.5}
          transparent
          opacity={0.4}
        />
      )}
      <group ref={groupRef}>
        <mesh 
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ ...satellite, parentId: parentPlanet?.id });
            setFocusedPlanetId(satellite.id);
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
          <sphereGeometry args={[sRadius, 32, 32]} />
          <meshStandardMaterial 
            map={texture} 
            color={satellite.color || '#ffffff'} 
            roughness={0.8} 
            metalness={0.2} 
            emissive="#ffffff"
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </mesh>
      </group>
    </>
  );
}

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
  const showOrbits = useStore(state => state.showOrbits);
  const realisticScale = useStore(state => state.realisticScale);

  // Apply scaling
  const pRadius = realisticScale ? planet.radius * 0.05 : planet.radius;
  const pDistance = realisticScale ? planet.distance * 2 : planet.distance;
  const rInner = realisticScale ? planet.ringInnerRadius * 0.05 : planet.ringInnerRadius;
  const rOuter = realisticScale ? planet.ringOuterRadius * 0.05 : planet.ringOuterRadius;

  // Generate orbit path points
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * pDistance, 0, Math.sin(theta) * pDistance));
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
    const x = Math.cos(angle) * pDistance;
    const z = Math.sin(angle) * pDistance;
    
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
      {showOrbits && (
        <Line
          points={points}
          color={hovered ? "#aaaaaa" : "#333333"}
          lineWidth={1}
          transparent
          opacity={hovered ? 0.8 : 0.3}
        />
      )}

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
          <sphereGeometry args={[pRadius, 64, 64]} />
          <meshStandardMaterial 
            map={texture}
            roughness={0.7} 
            metalness={0.2}
            emissive="#ffffff"
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </mesh>

        {/* Planet Rings, if any */}
        {planet.hasRings && (
          <mesh ref={ringRef} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
            <ringGeometry args={[rInner, rOuter, 64]} />
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

        {/* Satellites */}
        {planet.satellites && planet.satellites.map(sat => (
          <Satellite key={sat.id} satellite={sat} onSelect={onSelect} parentPlanet={planet} />
        ))}
      </group>
    </>
  );
}
