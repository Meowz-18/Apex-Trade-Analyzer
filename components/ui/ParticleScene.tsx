'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<THREE.Points>(null!);

    const count = 4000;
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const r = 6 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            // Continuous slow rotation
            ref.current.rotation.y += delta / 20;

            // Interactive Mouse Rotation
            // linear interpolation to smooth out the movement
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.2, 0.1);
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, state.mouse.x * 0.2, 0.1);
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#6366f1" // Indigo-500
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
    );
}

export function ParticleScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Accessibility: Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Optimization: Disable on mobile
        const isMobile = window.innerWidth < 768;

        if (containerRef.current && (prefersReducedMotion || isMobile)) {
            containerRef.current.style.display = 'none';
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0 animate-in fade-in duration-1000">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]} // Handle high DPI screens
            >
                <ParticleField />
            </Canvas>
        </div>
    );
}
