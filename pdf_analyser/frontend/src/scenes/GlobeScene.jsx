import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

const GlobeScene = () => {
    const globeRef = useRef(null);
    const atmosphereRef = useRef(null);

    useFrame((state, delta) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += delta * 0.1;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.15;
            atmosphereRef.current.rotation.z += delta * 0.05;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Core Globe */}
            <Sphere ref={globeRef} args={[1.5, 64, 64]}>
                <meshStandardMaterial
                    color="#1E293B"
                    emissive="#7C3AED"
                    emissiveIntensity={0.2}
                    wireframe={true}
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            {/* Glowing Atmosphere/Network */}
            <Sphere ref={atmosphereRef} args={[1.8, 64, 64]}>
                <MeshDistortMaterial
                    color="#22D3EE"
                    wireframe
                    transparent
                    opacity={0.1}
                    distort={0.3}
                    speed={2}
                />
            </Sphere>

            {/* Inner Light */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#7C3AED" distance={5} />
        </group>
    );
};

export default GlobeScene;
