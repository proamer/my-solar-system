import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Planet({ planet, onSelect }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const ringRef = useRef();
  const [hovered, setHover] = useState(false);

  // Load planet texture
  const texture = useTexture(planet.texture);
  
  // Load ring texture if needed
  const ringTexture = planet.hasRings && planet.ringTexture ? useTexture(planet.ringTexture) : null;

  // Generate orbit path points
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * planet.distance, 0, Math.sin(theta) * planet.distance));
  }

  useFrame((state) => {
    // Revolution around the sun (time based)
    const time = state.clock.getElapsedTime();
    const angle = time * planet.speed;
    
    // Convert polar coordinates to cartesian for the group's position
    const x = Math.cos(angle) * planet.distance;
    const z = Math.sin(angle) * planet.distance;
    
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    
    // Rotation on its own axis
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed;
    }
    
    if (ringRef.current) {
      // Rings rotate slightly with the planet or around it
      ringRef.current.rotation.z += planet.rotationSpeed * 0.5;
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
