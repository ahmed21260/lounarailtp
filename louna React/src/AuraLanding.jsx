import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { Stars, OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';

function RotatingGlobe({ zooming }) {
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

function Overlay() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center px-6"
      >
        <h1 className="text-globe-ocean text-4xl md:text-6xl font-bold drop-shadow-lg" style={{textShadow: '0 0 24px #64b5f6, 0 2px 0 #fff2'}}>
          LOUNA RAIL TP
        </h1>
        <p className="text-globe-atmosphere mt-4 text-lg md:text-xl font-semibold drop-shadow">
          Formation, sécurité et expertise ferroviaire.<br />Votre réussite, notre priorité.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="bg-black bg-opacity-40 rounded-lg px-6 py-4 shadow-lg border border-globe-atmosphere">
            <h2 className="text-xl font-semibold mb-2 text-globe-land">Modules de Formation</h2>
            <ul className="space-y-2 text-left text-globe-ice text-base font-medium">
              <li>• Sécurité ferroviaire</li>
              <li>• Maintenance des voies</li>
              <li>• Conduite d'engins</li>
              <li>• Gestion de projet</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuraLanding({ zoom = true }) {
  // Animation de zoom sur la caméra
  const cameraRef = useRef();
  const [zoomValue, setZoomValue] = useState(5);

  useEffect(() => {
    if (!zoom) return;
    let frame;
    let start;
    function animateZoom(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 2200, 1); // 2.2s
      setZoomValue(5 - 3.2 * progress); // de 5 à 1.8
      if (progress < 1) {
        frame = requestAnimationFrame(animateZoom);
      }
    }
    frame = requestAnimationFrame(animateZoom);
    return () => cancelAnimationFrame(frame);
  }, [zoom]);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, zoomValue], fov: 50 }} ref={cameraRef}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
        <RotatingGlobe />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <Overlay />
    </div>
  );
}
