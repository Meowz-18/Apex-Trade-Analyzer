'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function LogoGeometry(props: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        // Continuous slow rotation
        mesh.current.rotation.y += delta * 0.5;
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    });

    return (
        <mesh
            {...props}
            ref={mesh}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.1 : 1}
        >
            {/* icosahedronGeometry is a cool crystal shape */}
            <icosahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
                backside
                backsideThickness={5}
                thickness={2}
                roughness={0}
                transmission={1}
                ior={1.5}
                chromaticAberration={1}
                anisotropy={20}
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.5}
                color="#3b82f6" // Primary blue
            />
        </mesh>
    );
}

import { cn } from "@/lib/utils";

export function Logo3D({ className }: { className?: string }) {
    return (
        <div className={cn("h-10 w-10 relative", className)}>
            <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Environment preset="city" />
                <Float speed={5} rotationIntensity={1} floatIntensity={2}>
                    <LogoGeometry />
                </Float>
            </Canvas>
        </div>
    );
}
