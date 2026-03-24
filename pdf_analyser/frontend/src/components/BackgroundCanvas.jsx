// import React, { useRef, useEffect } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { useLocation } from 'react-router-dom';
// import * as THREE from 'three';
// import { Stars } from '@react-three/drei';
// import World from '../scenes/World';

// // This component controls the camera based on the route
// const CameraRig = () => {
//     const { } = useThree();
//     const location = useLocation();
//     const targetPos = useRef(new THREE.Vector3(0, 0, 5));
//     const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

//     useEffect(() => {
//         // Restore CameraRig animation as requested
//         targetLookAt.current.set(0, 0, 0);

//         switch (location.pathname) {
//             case '/':
//                 targetPos.current.set(0, 0, 6);
//                 targetLookAt.current.set(0, 0, 0); // Look at Quantum Core
//                 break;
//             case '/dashboard':
//                 targetPos.current.set(5, 2, 12);
//                 targetLookAt.current.set(5, 2, 8);
//                 break;
//             case '/library':
//                 targetPos.current.set(-5, 2, 12);
//                 targetLookAt.current.set(-5, 0, 8);
//                 break;
//             case '/analysis':
//                 targetPos.current.set(0, 2, 5);
//                 targetLookAt.current.set(0, 2, 0);
//                 break;
//             case '/batch':
//                 targetPos.current.set(10, 2, 10);
//                 targetLookAt.current.set(10, 0, 5);
//                 break;
//             case '/vault':
//                 targetPos.current.set(0, 5, 8);
//                 targetLookAt.current.set(0, 5, 5);
//                 break;
//             default:
//                 targetPos.current.set(0, 0, 10);
//                 targetLookAt.current.set(0, 0, 0);
//         }
//     }, [location]);

//     useFrame((state, delta) => {
//         // Smoothly interpolate camera position
//         state.camera.position.lerp(targetPos.current, 2 * delta);

//         // Optional: lookAt interpolation could occur here if we stored previous lookAt
//         // state.camera.lookAt(targetLookAt.current); 
//     });

//     return null;
// };

// // Global Lights and Environment
// const GlobalScene = () => (
//     <>
//         <ambientLight intensity={0.2} />
//         <pointLight position={[10, 10, 10]} intensity={1.5} color="#7C3AED" />
//         <pointLight position={[-10, -5, -10]} intensity={0.5} color="#22D3EE" />
//         <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
//     </>
// );

// const BackgroundCanvas = () => {
//     return (
//         <div className="absolute inset-0 w-full h-full">
//             <Canvas
//                 camera={{ position: [0, 0, 5], fov: 45 }}
//                 dpr={[1, 2]} // Performance optimization
//                 gl={{ antialias: false }} // Style choice + Perf
//             >
//                 <GlobalScene />
//                 <World />
//                 <CameraRig />
//             </Canvas>
//         </div>
//     );
// };

// export default BackgroundCanvas;




import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';
import World from '../scenes/World';

/* =========================
   Camera Rig
========================= */
const CameraRig = () => {
    const location = useLocation();

    const targetPos = useRef(new THREE.Vector3(0, 0, 6));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
    const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                targetPos.current.set(0, 0, 6);
                targetLookAt.current.set(0, 0, 0);
                break;

            case '/dashboard':
                targetPos.current.set(5, 2, 12);
                targetLookAt.current.set(5, 2, 8);
                break;

            case '/library':
                targetPos.current.set(-5, 2, 12);
                targetLookAt.current.set(-5, 0, 8);
                break;

            case '/analysis':
                targetPos.current.set(0, 2, 5);
                targetLookAt.current.set(0, 2, 0);
                break;

            case '/batch':
                targetPos.current.set(10, 2, 10);
                targetLookAt.current.set(10, 0, 5);
                break;

            case '/vault':
                targetPos.current.set(0, 5, 8);
                targetLookAt.current.set(0, 5, 5);
                break;

            default:
                targetPos.current.set(0, 0, 10);
                targetLookAt.current.set(0, 0, 0);
        }
    }, [location.pathname]);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Smooth camera movement
        const speed = location.pathname === '/' ? 1.5 : 3;
        state.camera.position.lerp(targetPos.current, speed * delta);

        // Subtle breathing motion
        state.camera.position.x += Math.sin(t * 0.2) * 0.002;
        state.camera.position.y += Math.cos(t * 0.15) * 0.002;

        // Smooth lookAt
        currentLookAt.current.lerp(targetLookAt.current, speed * delta);
        state.camera.lookAt(currentLookAt.current);

        // Prevent camera going too far
        state.camera.position.z = Math.min(state.camera.position.z, 15);
    });

    return null;
};

/* =========================
   Global Scene
========================= */
const GlobalScene = () => (
    <>
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#7C3AED" />
        <pointLight position={[-10, -5, -10]} intensity={0.6} color="#22D3EE" />

        <Stars
            radius={15}
            depth={40}
            count={3000}
            factor={3}
            saturation={0}
            fade
            speed={1}
        />
    </>
);

/* =========================
   Background Canvas
========================= */
const BackgroundCanvas = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: false }}
                onCreated={({ gl }) => {
                    // Remove black background
                    gl.setClearColor('#000000', 0);
                }}
            >
                {/* Cinematic Fog */}
                <fog attach="fog" args={['#020617', 8, 25]} />

                <GlobalScene />
                <World />
                <CameraRig />
            </Canvas>
        </div>
    );
};

export default BackgroundCanvas;
