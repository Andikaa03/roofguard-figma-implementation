/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'Arial', 'sans-serif'],
      },
    },
  },
};
