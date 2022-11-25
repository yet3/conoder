/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#111111',
      },
      backgroundColor: {
        node: '#1C1C1C',
        input: '#444444',
        'node-border-selected': 'rgb(254,215,170)',
      },
      textColor: {
        node: {
          primary: '#e0e0e0',
          secondary: '#969696',
        },
      },
      borderColor: {
        node: '#444444',
        'node-hi': '#656565',
        'node-selected': 'rgb(254,215,170)',
      },
      stroke: {
        'pointer': '#656565',
        'pointer-selected': 'rgb(254,215,170)'
      }
    },
  },
  plugins: [],
};
