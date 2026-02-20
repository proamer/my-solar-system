import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

export default function Spacecraft({ spacecraft, onSelect }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHover] = useState(false);
  const showOrbits = useStore(state => state.showOrbits);
  const realisticScale = useStore(state => state.realisticScale);
  const setFocusedPlanetId = useStore(state => state.setFocusedPlanetId);

  const sRadius = realisticScale ? spacecraft.radius * 0.05 : spacecraft.radius;
  const sDistance = realisticScale ? spacecraft.distance * 2 : spacecraft.distance;

  // Generate orbit path points
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * sDistance, 0, Math.sin(theta) * sDistance));
  }

  useFrame(() => {
    const simulationDate = useStore.getState().simulationDate;
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const elapsedDays = (simulationDate.getTime() - J2000) / (1000 * 60 * 60 * 24);
    
    const angle = elapsedDays * spacecraft.speed;
    const x = Math.cos(angle) * sDistance;
    const z = Math.sin(angle) * sDistance;
    
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsedDays * spacecraft.rotationSpeed;
      meshRef.current.rotation.x = elapsedDays * (spacecraft.rotationSpeed * 0.5);
    }
  });

  return (
    <>
      {showOrbits && (
        <Line
          points={points}
          color={hovered ? "#ffffff" : "#44bbff"}
          lineWidth={1}
          transparent
          opacity={hovered ? 0.8 : 0.2}
        />
      )}

      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(spacecraft);
            setFocusedPlanetId(spacecraft.id);
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
          {spacecraft.id === 'iss' && <cylinderGeometry args={[sRadius/2, sRadius/2, sRadius*4, 8]} />}
          {spacecraft.id === 'jwst' && <octahedronGeometry args={[sRadius*1.5]} />}
          {spacecraft.id === 'voyager' && <coneGeometry args={[sRadius, sRadius*2.5, 8]} />}
          
          <meshStandardMaterial 
            color={spacecraft.color} 
            roughness={0.5} 
            metalness={0.8}
            emissive={spacecraft.color}
            emissiveIntensity={hovered ? 0.5 : 0.1}
          />
        </mesh>
      </group>
    </>
  );
}
