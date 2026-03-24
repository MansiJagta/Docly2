import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CyberTunnel = () => {
    const tunnel1 = useRef(null);
    const tunnel2 = useRef(null);

    useFrame((state, delta) => {
        if (tunnel1.current) tunnel1.current.rotation.z += delta * 0.1;
        if (tunnel2.current) tunnel2.current.rotation.z -= delta * 0.2;
    });

    return (
        <group rotation={[Math.PI / 2, 0, 0]}> {/* Rotate to face camera */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                {/* Outer Wireframe Tunnel */}
                <Cylinder ref={tunnel1} args={[5, 5, 40, 6, 1, true]} rotation={[0, 0, 0]}>
                    <meshBasicMaterial color="#7C3AED" wireframe side={THREE.BackSide} transparent opacity={0.2} />
                </Cylinder>

                {/* Inner Neon Tunnel */}
                <Cylinder ref={tunnel2} args={[3, 3, 40, 3, 1, true]} rotation={[0, 0, Math.PI / 4]}>
                    <meshBasicMaterial color="#22D3EE" wireframe side={THREE.BackSide} />
                </Cylinder>
            </Float>

            {/* Floating Data Particles */}
            <Sparkles
                count={400}
                scale={[4, 4, 30]}
                size={4}
                speed={0.4}
                opacity={0.6}
                color="#FFFFFF"
            />
        </group>
    );
};

export default CyberTunnel;
