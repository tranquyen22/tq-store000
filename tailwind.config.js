/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float-sparkle': 'floatSparkle 2s infinite ease-in-out alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(2, 132, 199, 0.2)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 0 16px rgba(2, 132, 199, 0)', transform: 'scale(1.04)' },
        },
        floatSparkle: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.7' },
          '100%': { transform: 'translateY(-6px) rotate(20deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
