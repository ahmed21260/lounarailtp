import React, { useState } from 'react';
import SplashGlobe from './SplashGlobe';
import Home from './Home';
import './index.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <div className="w-full min-h-screen bg-black">
      {showSplash ? (
        <SplashGlobe onFinish={() => setShowSplash(false)} />
      ) : (
        <Home />
      )}
    </div>
  );
} 