// components/Background.js
import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Bg() {
  const { scene } = useGLTF('/models/backdrop.glb');
  
  // Enable shadows for the backdrop
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <>
      {/* Add ambient light for overall scene illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Add directional light with shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <primitive 
        object={scene} 
        position={[0, 0, -1]} 
        rotation={[0, 150, 0]}
        scale={[0.5, 0.5, 0.5]}
      />
    </>
  );
}

useGLTF.preload('/models/backdrop.glb');