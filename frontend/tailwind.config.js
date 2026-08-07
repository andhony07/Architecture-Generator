/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "#4F46E5",
          "indigo-light": "#EEF2FF",
          blue: "#2563EB",
          "blue-light": "#EFF6FF",
          cyan: "#0891B2",
          "cyan-light": "#ECFEFF",
          purple: "#7C3AED",
          "purple-light": "#F5F3FF",
          emerald: "#059669",
          "emerald-light": "#ECFDF5",
          orange: "#EA580C",
          "orange-light": "#FFF7ED",
          rose: "#E11D48",
          "rose-light": "#FFF1F2",
          sky: "#0284C7",
          "sky-light": "#F0F9FF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};