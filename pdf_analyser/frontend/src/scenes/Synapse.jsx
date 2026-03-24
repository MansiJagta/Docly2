import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Sphere } from '@react-three/drei';

const Synapse = () => {
    const groupRef = useRef(null);

    // Generate random points on a sphere surface to simulate brain nodes
    const count = 50;
    const radius = 1.2;

    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    // Generate connections (synapses)
    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < count; i++) {
            // Connect to nearest neighbors
            const node = nodes[i];
            for (let j = i + 1; j < count; j++) {
                const other = nodes[j];
                if (node.distanceTo(other) < 1.0) {
                    lines.push([node, other]); // Pair of vectors
                }
            }
        }
        return lines;
    }, [nodes]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Nodes */}
            {nodes.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.02, 16, 16]} />
                    <meshBasicMaterial color="#22D3EE" />
                </mesh>
            ))}

            {/* Connections (Synapses) */}
            {connections.map((pair, i) => (
                <Line
                    key={i}
                    points={pair}
                    color="#22D3EE"
                    transparent
                    opacity={0.2}
                    lineWidth={1}
                />
            ))}

            {/* Inner Glow */}
            <Sphere args={[radius * 0.8, 32, 32]}>
                <meshBasicMaterial color="#7C3AED" transparent opacity={0.1} />
            </Sphere>
        </group>
    );
};

export default Synapse;
