/**
 * Tailwind build config for islandinnovatorsbahamas.com
 *
 * The site used to load Tailwind from the CDN (cdn.tailwindcss.com), which
 * compiles CSS in the visitor's browser on every page load. It is now compiled
 * once into assets/css/tailwind.css and served as a static file.
 *
 * If you add or change any Tailwind class in an HTML file, rebuild:
 *
 *   npm run build:css
 *
 * and commit the updated assets/css/tailwind.css along with your HTML change.
 */
module.exports = {
  content: ['./*.html', './join/**/*.html'],
  // Classes toggled by JavaScript rather than written in the HTML.
  safelist: ['hidden'],
  theme: {
    extend: {
      colors: {
        ocean: '#1B5E7B',
        orange: '#D4722A',
        coral: '#E8573D',
        teal: '#2AA5A0',
        gold: '#F2B830',
        night: '#0D1B2A',
        sand: '#FFF8F0',
        cream: '#FDF6EC',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
