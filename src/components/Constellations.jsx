import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Constellations() {
  const lines = useMemo(() => {
    // Generate 20 fake constellations
    const consts = [];
    for (let i = 0; i < 20; i++) {
      const points = [];
      const numStars = 4 + Math.floor(Math.random() * 5);
      
      // Starting point far away
      const startRadius = 150 + Math.random() * 50;
      const startTheta = Math.random() * Math.PI * 2;
      const startPhi = Math.random() * Math.PI;
      
      let currentPos = new THREE.Vector3(
        startRadius * Math.sin(startPhi) * Math.cos(startTheta),
        startRadius * Math.cos(startPhi),
        startRadius * Math.sin(startPhi) * Math.sin(startTheta)
      );
      
      points.push(currentPos.clone());
      
      for (let j = 1; j < numStars; j++) {
        // Next point is close to current point but still far away
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        );
        currentPos.add(offset);
        points.push(currentPos.clone());
      }
      
      consts.push(points);
    }
    return consts;
  }, []);

  return (
    <group>
      {lines.map((pts, i) => (
        <Line 
          key={i} 
          points={pts} 
          color="rgba(100, 150, 255, 0.4)" 
          lineWidth={1} 
          transparent
        />
      ))}
    </group>
  );
}
