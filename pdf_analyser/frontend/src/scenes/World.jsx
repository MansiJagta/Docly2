// import React from 'react';
// import QuantumCore from './QuantumCore';
// import Synapse from './Synapse';
// import KineticDoor from './KineticDoor';
// import { DashboardScene, LibraryScene, BatchScene } from './AdditionalScenes';
// import { Text } from '@react-three/drei';

// const World = () => {
//     return (
//         <>
//             {/* Home Zone */}
//             <QuantumCore />

//             {/* Analysis Zone (The Synapse) */}
//             <group position={[0, 2, 0]}>
//                 <Synapse />
//                 <Text position={[0, 1.5, 0]} color="#22D3EE" fontSize={0.3} anchorX="center" anchorY="middle">
//                     Neural Analysis
//                 </Text>
//             </group>

//             {/* Dashboard Zone */}
//             <group position={[5, 2, 8]}>
//                 <DashboardScene />
//                 <Text position={[0, 2, 0]} color="#7C3AED" fontSize={0.5}>
//                     Analytics
//                 </Text>
//             </group>

//             {/* Library Zone */}
//             <group position={[-5, 0, 8]}>
//                 <LibraryScene />
//             </group>

//             {/* Batch Zone (Conveyor) */}
//             <group position={[10, 0, 5]}>
//                 <BatchScene />
//             </group>

//             {/* Privacy Vault Zone */}
//             <group position={[0, 5, 5]} rotation={[0, 0, 0]}>
//                 <KineticDoor />
//             </group>
//         </>
//     );
// };

// export default World;




// import React from 'react';
// import { Text } from '@react-three/drei';

// import Synapse from './Synapse';
// import KineticDoor from './KineticDoor';
// import { DashboardScene, LibraryScene, BatchScene } from './AdditionalScenes';

// const World = () => {
//     return (
//         <>
//             {/* =====================
//                ANALYSIS ZONE
//                (PINE / WIRE / LINE KEPT ✅)
//             ====================== */}
//             <group position={[0, 2, 0]}>
//                 <Synapse />
//                 <Text
//                     position={[0, 1.5, 0]}
//                     color="#22D3EE"
//                     fontSize={0.3}
//                     anchorX="center"
//                     anchorY="middle"
//                 >
//                     Neural Analysis
//                 </Text>
//             </group>

//             {/* =====================
//                DASHBOARD ZONE
//             ====================== */}
//             <group position={[5, 2, 8]}>
//                 <DashboardScene />
//                 <Text
//                     position={[0, 2, 0]}
//                     color="#7C3AED"
//                     fontSize={0.45}
//                     anchorX="center"
//                     anchorY="middle"
//                 >
//                     Analytics
//                 </Text>
//             </group>

//             {/* =====================
//                LIBRARY ZONE
//             ====================== */}
//             <group position={[-5, 0, 8]}>
//                 <LibraryScene />
//             </group>

//             {/* =====================
//                BATCH ZONE
//             ====================== */}
//             <group position={[10, 0, 5]}>
//                 <BatchScene />
//             </group>

//             {/* =====================
//                VAULT ZONE
//             ====================== */}
//             <group position={[0, 5, 5]}>
//                 <KineticDoor />
//             </group>
//         </>
//     );
// };

// export default World;









import React from 'react';
import { Float, Sparkles } from '@react-three/drei';

import Synapse from './Synapse';
import KineticDoor from './KineticDoor';
import { DashboardScene, LibraryScene, BatchScene } from './AdditionalScenes';

const World = () => {
    return (
        <>
            {/* =====================
               CENTER HERO (WIRE / PINE) -> Now moved to RIGHT as requested
               "instead of that image let there be that keeppine / wire / line animationt"
            ====================== */}
            <group position={[2.5, 0, 0]}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Synapse />
                    <Sparkles count={100} scale={[5, 5, 5]} size={4} speed={0.4} opacity={0.5} color="#22D3EE" />
                </Float>
            </group>

            {/* =====================
               DASHBOARD ZONE
            ====================== */}
            <group position={[5, 2, 8]}>
                <DashboardScene />
            </group>

            {/* =====================
               LIBRARY ZONE
            ====================== */}
            <group position={[-5, 0, 8]}>
                <LibraryScene />
            </group>

            {/* =====================
               BATCH ZONE
            ====================== */}
            <group position={[10, 0, 5]}>
                <BatchScene />
            </group>

            {/* =====================
               VAULT ZONE
            ====================== */}
            <group position={[0, 5, 5]}>
                <KineticDoor />
            </group>
        </>
    );
};

export default World;
