/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── Custom Colour Palette ───────────────────────────────────────────────
      // Matching the warm cream + rose editorial aesthetic from the original design
      colors: {
        // Page & surface backgrounds
        cream:       '#fdf6ee',   // warm cream – page background
        card:        '#ffffff',   // pure white – card surface

        // Text hierarchy
        'text-dark': '#1a1210',   // near-black – primary text
        'text-mid':  '#6b5a52',   // warm brown – secondary text
        'text-light':'#b09e96',   // dusty rose-grey – muted text

        // Interaction accents
        like:        '#e8445a',   // rose red – swipe right / like
        'like-soft': '#ffeef1',   // light tint – like label background
        nope:        '#3d7be8',   // cobalt blue – swipe left / nope
        'nope-soft': '#eef3ff',   // light tint – nope label background

        // Brand accent
        accent:      '#e8445a',   // primary CTA / highlights (same as like)
        'accent-soft':'#f7c5cc',  // softer tint – decorative use
      },

      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],     // headlines & decorative text
        sans:  ['DM Sans', 'system-ui', 'sans-serif'], // body & UI labels
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        card: '24px',   // card corners
        pill: '99px',   // buttons & pills
      },

      // ─── Box Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        card:   '0 12px 40px rgba(0,0,0,0.12)',
        'btn-like': '0 4px 16px rgba(232,68,90,0.2)',
        'btn-nope': '0 4px 16px rgba(61,123,232,0.2)',
        'btn-primary': '0 8px 24px rgba(232,68,90,0.35)',
        thumb:  '0 4px 16px rgba(0,0,0,0.1)',
      },

      // ─── Keyframe Animations ─────────────────────────────────────────────────
      keyframes: {
        // Gentle floating for background paw decorations
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':       { transform: 'translateY(-12px) rotate(8deg)' },
        },
        // Subtle bounce for the cat icon on the intro screen
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        // Spinner rotation for loading state
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        // Scale-in entrance for result thumbnails
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.7)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float:   'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        spin:    'spin 0.8s linear infinite',
        'pop-in':'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}
