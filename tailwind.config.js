module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b2b20',
        gold: '#c89b4a',
        cream: '#f6efe6',
        beige: '#efe6db',
        warm: '#ff8a4b'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
