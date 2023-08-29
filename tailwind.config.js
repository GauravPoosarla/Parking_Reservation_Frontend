/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        modal: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        3: '3px',
      },
      colors: {
        'light-bg': '#f7fafc',
        accent: '#805ad5',
        'accent-hover': '#6b46c1',
        'selected-bg': '#e2e8f0',
        'selected-bg-hover': '#cbd5e0',
        'text-primary': '#4a5568',
      },
      fontSize: {
        xs: '0.75rem',
      },
    },
  },
  plugins: [],
};
