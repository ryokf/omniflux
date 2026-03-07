/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Background & Surface
        bg: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-el': '#242424',
        'surface-border': '#2E2E2E',
        divider: '#2A2A2A',
        'input-bg': '#1E1E1E',

        // Primary Accent (Brand)
        primary: '#6C5CE7',
        'primary-light': '#8B7CF7',
        secondary: '#4A6CF7',

        // Semantic (Financial Status)
        profit: '#00C48C',
        loss: '#FF4757',
        warning: '#FFB347',
        'warning-dark': '#E5983D',

        // Text
        'txt': '#F5F5F5',
        'txt-secondary': '#8E8E93',
        'txt-muted': '#636366',

        // Tab
        'tab-inactive': '#636366',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
