import React, { useEffect, useRef, useState } from 'react';

export default function SplashGlobe({ onFinish }) {
  const canvasRef = useRef(null);
  const [split, setSplit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [ready, setReady] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animation fiable de la barre de loading
  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += 2;
      setProgress(pct);
      if (pct >= 100) {
        setProgress(100);
        setReady(true);
        clearInterval(interval);
      }
    }, 50); // 2s total
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let phi = 0;
    let globe = null;
    import('https://cdn.skypack.dev/cobe').then(({ default: createGlobe }) => {
      function resizeGlobe() {
        if (!canvasRef.current) return;
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth * dpr;
        const height = window.innerHeight * dpr;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        if (globe && globe.destroy) globe.destroy();
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: dpr,
          width,
          height,
          phi: 0,
          theta: 0.3,
          dark: 1,
          diffuse: 1.2,
          scale: 1,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [1, 1, 1],
          markerColor: [1, 0.5, 1],
          glowColor: [1, 1, 1],
          markers: [],
          onRender: (state) => {
            state.phi = phi;
            phi += 0.005;
          },
        });
      }
      resizeGlobe();
      window.addEventListener('resize', resizeGlobe);
      return () => {
        window.removeEventListener('resize', resizeGlobe);
        if (globe && globe.destroy) globe.destroy();
      };
    });
    // Clean up on unmount
    return () => {
      if (globe && globe.destroy) globe.destroy();
    };
  }, []);

  // Split puis fade-out du globe après clic sur le bouton
  useEffect(() => {
    if (!clicked) return;
    setSplit(true);
    const fadeTimer = setTimeout(() => setFadeOut(true), 700); // Fade-out du globe après split
    const finish = setTimeout(() => onFinish && onFinish(), 1200); // Fin après 1.2s
    return () => { clearTimeout(fadeTimer); clearTimeout(finish); };
  }, [clicked, onFinish]);

  return (
    <div className={`fixed inset-0 z-50 w-full h-full bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          background: 'black',
          pointerEvents: 'none',
        }}
      />
      {/* Barre de loading centrée */}
      {!ready && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-50">
          <div className="relative h-7 w-[320px] rounded-full bg-black/80 border-2 border-yellow-400/80 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full shadow-2xl animate-pulse"
              style={{ width: `${progress}%`, transition: 'width 0.2s cubic-bezier(.7,0,.3,1)' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-yellow-300 drop-shadow-lg tracking-widest" style={{textShadow:'0 0 16px #fde047, 0 2px 0 #fff2'}}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      )}
      {/* Bouton Découvrir animé */}
      {ready && !clicked && (
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black text-3xl font-extrabold shadow-2xl border-4 border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:shadow-yellow-400/40 focus:outline-none focus:ring-4 focus:ring-yellow-400 animate-fadein"
          style={{textShadow:'0 0 24px #fff, 0 2px 0 #fde047'}}
          onClick={() => setClicked(true)}
        >
          Découvrir l'univers
        </button>
      )}
      {/* Split net */}
      <div className="pointer-events-none">
        {/* Left half */}
        <div className={`fixed top-0 left-0 h-full bg-black z-60 transition-all duration-800 ${split ? '-translate-x-full' : 'translate-x-0'} w-1/2`}></div>
        {/* Right half */}
        <div className={`fixed top-0 right-0 h-full bg-black z-60 transition-all duration-800 ${split ? 'translate-x-full' : 'translate-x-0'} w-1/2`}></div>
      </div>
      {/* Animation fade-in bouton */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .animate-fadein { animation: fadein 1s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
} 