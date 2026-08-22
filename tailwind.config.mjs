/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'Arial', 'sans-serif'],
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
    },
  },
};
