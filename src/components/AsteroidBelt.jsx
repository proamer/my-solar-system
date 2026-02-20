import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

export default function AsteroidBelt({ innerRadius, outerRadius, count, color = '#666666' }) {
  const meshRef = useRef();
  const realisticScale = useStore(state => state.realisticScale);

  // Create an array of dummy objects to set matrix data
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random asteroid data
  const asteroids = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      
      const x = Math.cos(angle) * radius;
      // Some vertical spread, thicker in the middle
      const y = (Math.random() - 0.5) * (Math.random() * 2);
      const z = Math.sin(angle) * radius;

      // Random sizes and rotations
      const scale = 0.02 + Math.random() * 0.05;
      const rotationX = Math.random() * Math.PI;
      const rotationY = Math.random() * Math.PI;
      const rotationZ = Math.random() * Math.PI;

      // Orbital speed base
      // Inner belt moves faster than outer, Kepler's third law approximation
      const speed = (0.005 / Math.sqrt(radius)) * (0.8 + Math.random() * 0.4);

      data.push({ x, y, z, scale, rotationX, rotationY, rotationZ, angle, radius, speed });
    }
    return data;
  }, [innerRadius, outerRadius, count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Instead of computing absolute time which requires iterating over all 3000 instances 
    // and multiplying large numbers, we just step them by a delta for performance.
    // For true time elasticity, we could use a shader, but for now we'll do a simple CPU side update.
    
    const timeSpeed = useStore.getState().timeSpeed;
    const isPlaying = useStore.getState().isPlaying;
    
    // Scale delta. If 1 day/sec (86400000), meaning ~30 days per frame at 60fps.
    const deltaDays = isPlaying ? (timeSpeed / 86400000) * (1 / 60) : 0;

    asteroids.forEach((asteroid, i) => {
      // Advance angle
      asteroid.angle += asteroid.speed * deltaDays;
      
      const rScale = realisticScale ? 2 : 1;
      const sScale = realisticScale ? 0.05 : 1;
      
      // Calculate new position
      const x = Math.cos(asteroid.angle) * (asteroid.radius * rScale);
      const z = Math.sin(asteroid.angle) * (asteroid.radius * rScale);

      dummy.position.set(x, asteroid.y * rScale, z);
      dummy.rotation.set(asteroid.rotationX, asteroid.rotationY, asteroid.rotationZ);
      dummy.scale.set(asteroid.scale * sScale, asteroid.scale * sScale, asteroid.scale * sScale);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}
