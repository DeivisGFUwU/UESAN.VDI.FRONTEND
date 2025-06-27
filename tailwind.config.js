// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        esan: {
          primary: '#B80000', // Rojo institucional ESAN
          secondary: '#22223B', // Gris oscuro profesional
          accent: '#F2A900', // Amarillo dorado para detalles
          background: '#F8F8F8', // Fondo claro
          info: '#005F73', // Azul profesional para info
          // Modo oscuro
          'primary-dark': '#8B0000', // Rojo oscuro
          'secondary-dark': '#181825', // Gris casi negro
          'background-dark': '#181825', // Fondo oscuro
          'accent-dark': '#FFD600', // Amarillo más claro para contraste
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
