// -Path: 'ui\src\components\screen\Screen.tsx'
// -Path: "vite-react-typescript/src/components/screen/Screen.tsx"
import { Suspense } from 'react';
import RotatingBox from './RotatingBox';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Screen() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-full w-full">
                    Loading...
                </div>
            }
        >
            <Canvas
                dpr={[1, 1.5]}
                frameloop="demand"
                camera={{ position: [0, 0, 5] }}
                gl={{ powerPreference: 'high-performance', antialias: false }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RotatingBox />
                <OrbitControls />
            </Canvas>
        </Suspense>
    );
}
