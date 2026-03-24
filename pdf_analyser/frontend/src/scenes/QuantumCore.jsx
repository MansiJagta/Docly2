import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

const QuantumCore = () => {
    const meshRef = useRef(null);

    useFrame((state) => {
        // Rotate and bob the core
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
            meshRef.current.position.y = Math.sin(t) * 0.1;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Central Geometry - Replaced Sphere with TorusKnot */}
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <MeshDistortMaterial
                    color="#7C3AED"
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.5}
                    distort={0.4}
                    speed={2}
                    wireframe={false}
                />
            </mesh>

            {/* Outer Cage Removed as per 'remove moving lines' request */}
        </group>
    );
};

export default QuantumCore;
