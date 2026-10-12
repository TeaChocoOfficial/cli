// -Path: 'ui\src\components\screen\RotatingBox.tsx'
// -Path: "vite-react-typescript/src/components/screen/RotatingBox.tsx"
import { Mesh } from 'three';
import { useRef } from 'react';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function RotatingBox() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta;
            meshRef.current.rotation.y += delta;
        }
    });

    return (
        <Box ref={meshRef} args={[2, 2, 2]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="green" />
        </Box>
    );
}
