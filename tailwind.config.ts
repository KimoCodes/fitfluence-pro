import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#ff3b3f',
          600: '#ea1f3a',
          700: '#c61330',
          800: '#a41330',
          900: '#88152f'
        }
      },
      boxShadow: {
        glow: '0 20px 50px rgba(255, 59, 63, 0.18)'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(255,59,63,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(255,255,255,0.07), transparent 25%)'
      }
    }
  },
  plugins: []
};

export default config;
