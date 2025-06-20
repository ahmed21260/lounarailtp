export default {
  content: ['./lounarailtp.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        globe: {
          ocean: '#1a237e',      // Bleu profond
          land: '#388e3c',       // Vert terre
          desert: '#bcaaa4',     // Marron/sable
          ice: '#e3f2fd',        // Blanc/bleuté
          atmosphere: '#64b5f6'  // Bleu clair
        }
      }
    },
  },
  plugins: [],
};
