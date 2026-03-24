import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

const KineticDoor = () => {
    const outerRingRef = useRef(null);
    const innerRingRef = useRef(null);
    const lockRef = useRef(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (outerRingRef.current) outerRingRef.current.rotation.z = t * 0.1;
        if (innerRingRef.current) innerRingRef.current.rotation.z = -t * 0.2;
        if (lockRef.current) lockRef.current.rotation.z = Math.sin(t) * 0.5;
    });

    return (
        <group rotation={[90, 0, 0]} position={[0, -1, 0]}>
            {/* Main Door Body */}
            <Cylinder args={[2, 2, 0.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Outer Gear Ring */}
            <Torus args={[2.2, 0.1, 16, 64]} ref={outerRingRef} rotation={[0, 0, 0]}>
                <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.5} />
            </Torus>

            {/* Inner Gear Ring */}
            <Torus args={[1.5, 0.1, 16, 64]} ref={innerRingRef} rotation={[0, 0, 0]}>
                <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.5} />
            </Torus>

            {/* Center Lock */}
            <group position={[0, 0, 0.2]} ref={lockRef}>
                <Cylinder args={[0.5, 0.5, 0.2, 8]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#E5E7EB" metalness={1} roughness={0.1} />
                </Cylinder>
                <Torus args={[0.3, 0.05, 16, 32]} rotation={[0, 0, 0]}>
                    <meshBasicMaterial color="#EF4444" />
                </Torus>
            </group>
        </group>
    );
};

export default KineticDoor;
