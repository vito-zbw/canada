/** @type {import('tailwindcss').Config} */
// Tokens are derived from docs/DESIGN.md. When the two disagree, DESIGN.md wins.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#EEF4F0',
          700: '#1F3D2B',
          900: '#13251A',
        },
      },
      fontFamily: {
        serif: [
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        display: ['4rem', { lineHeight: '1.05' }],
        h1: ['2.75rem', { lineHeight: '1.1' }],
        h2: ['2rem', { lineHeight: '1.15' }],
        h3: ['1.375rem', { lineHeight: '1.25' }],
        lead: ['1.25rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        meta: ['0.875rem', { lineHeight: '1.4' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        40: '10rem',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
