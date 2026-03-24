import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

export const DashboardScene = () => {
    // 3D Bars simulating data visualization
    const bars = useMemo(() => {
        return new Array(10).fill(0).map((_, i) => ({
            position: [(i - 4.5) * 0.5, 0, 0],
            height: Math.random() * 2 + 1,
            color: i % 2 === 0 ? '#7C3AED' : '#22D3EE'
        }));
    }, []);

    const groupRef = useRef(null);

    useFrame((state) => {
        // Animate bars scaling
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                if (child.isMesh) {
                    child.scale.y = 1 + Math.sin(t * 2 + i) * 0.5;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {bars.map((bar, i) => (
                <Box key={i} args={[0.4, 1, 0.4]} position={bar.position}>
                    <meshStandardMaterial color={bar.color} transparent opacity={0.8} />
                </Box>
            ))}
        </group>
    );
};

export const LibraryScene = () => {
    // Rotating Carousel of "Documents"
    const groupRef = useRef(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    const cards = useMemo(() => {
        return new Array(6).fill(0).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 2.5;
            return {
                position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius],
                rotation: [0, angle, 0]
            };
        });
    }, []);

    return (
        <group ref={groupRef}>
            {cards.map((card, i) => (
                <Plane key={i} args={[1, 1.4]} position={card.position} rotation={card.rotation}>
                    <meshBasicMaterial color="#E5E7EB" side={THREE.DoubleSide} wireframe />
                </Plane>
            ))}
        </group>
    );
};

export const BatchScene = () => {
    // Simple conveyor belt simulation
    const groupRef = useRef(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Move items along x axis
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                // Since Plane is also a child, skip it if needed or check type
                if (child.geometry && child.geometry.type === 'BoxGeometry') {
                    child.position.x = ((t + i * 2) % 6) - 3;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {/* Conveyor Items */}
            {[0, 1, 2].map((i) => (
                <Box key={i} args={[0.6, 0.2, 0.6]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color="#22D3EE" />
                </Box>
            ))}
            {/* Belt graphic could be a simple plane */}
            <Plane args={[8, 1]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
                <meshBasicMaterial color="#334155" />
            </Plane>
        </group>
    );
};
