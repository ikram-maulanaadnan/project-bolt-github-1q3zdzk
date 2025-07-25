/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Definisikan warna dasar untuk tema gelap dan neon
        'background-dark': '#0D1117', // Warna latar belakang utama yang sangat gelap
        'card-dark': '#161B22',       // Warna untuk kartu dan elemen sekunder
        'border-dark': '#30363D',      // Warna untuk border
        'neon-cyan': '#00E5FF',        // Warna aksen neon sian
        'neon-pink': '#FF00C7',        // Warna aksen neon pink
      },
      boxShadow: {
        // Efek bayangan neon untuk elemen interaktif
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.5), 0 0 30px rgba(0, 229, 255, 0.2)',
        'neon-pink': '0 0 15px rgba(255, 0, 199, 0.5), 0 0 30px rgba(255, 0, 199, 0.2)',
      },
      animation: {
        // Animasi untuk latar belakang aurora yang bergerak lambat
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        // Keyframe untuk animasi aurora
        aurora: {
          from: { backgroundPosition: '0% 50%' },
          to: { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [],
};
