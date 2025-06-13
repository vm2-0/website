import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        primary: {
          100: '#292441',
          200: '#211d35',
          300: '#19172a',
          400: '#12101d',
          500: '#0b0a13'
        },
        secondary: {
          100: '#d468ff', //2
          200: '#CD4EFF', //
          300: '#bb4eff', //4
          400: '#8c4fff', //5
          500: '#6050ff', //6
          600: '#4E51FF', //2
          700: '#3a3cd1'
        },
        accent: {
          100: '#ffffff',
          200: '#f1f1f1',
          300: '#e4e4e4',
          400: '#cdcdcd',
          500: '#bdbdbd',
          600: '#9f9f9f'
        }
      },
      keyframes: {
        'side-to-side': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(30%)' }
        }
      },
      animation: {
        'side-to-side': 'side-to-side .70s ease-in-out infinite'
      }
    }
  },

  plugins: [typography]
} satisfies Config;
