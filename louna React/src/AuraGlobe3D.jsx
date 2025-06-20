import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Stars, OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';

function RotatingGlobe() {
  const ref = useRef();
  const texture = useLoader(TextureLoader, '/images/unnamed.jpg');
  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = mouse.x * Math.PI;
      ref.current.rotation.x = mouse.y * Math.PI * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Atmosphere effect */}
      <mesh scale={1.53}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.25}
          roughness={0.5}
          thickness={1.2}
          color={'#64b5f6'}
          emissive={'#64b5f6'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

export default function AuraGlobe3D() {
  return (
    <div className="w-full h-full fixed inset-0 z-50 bg-black">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
        <RotatingGlobe />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
} 