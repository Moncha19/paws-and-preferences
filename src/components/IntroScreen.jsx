/**
 * IntroScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The landing / welcome screen users see when they first open the app.
 *
 * Sections:
 *   1. Background decorative paw prints (animated, purely visual)
 *   2. Hero block  – app icon, title, subtitle
 *   3. Swipe hint  – visual legend showing "👈 Nope" and "Like 👉"
 *   4. CTA button  – "Let's Go!" triggers cat loading and deck transition
 *
 * Props:
 *   @prop {boolean}    isActive  - Whether this screen is currently shown
 *   @prop {() => void} onStart   - Callback fired when the user clicks "Let's Go!"
 */

import React from 'react'

// ─── Background paw decoration data ──────────────────────────────────────────
// Each object defines position, animation delay for the floating paw prints
// scattered behind the hero content.
const BG_PAWS = [
  { top: '8%',  left: '10%',  delay: '0s'   },
  { top: '15%', right: '12%', delay: '1.2s' },
  { top: '55%', left: '5%',   delay: '0.7s' },
  { top: '70%', right: '8%',  delay: '1.8s' },
  { top: '85%', left: '30%',  delay: '0.3s' },
  { top: '40%', right: '3%',  delay: '2.1s' },
  { top: '30%', left: '50%',  delay: '1.5s' },
]

function IntroScreen({ isActive, onStart }) {
  return (
    <section
      className={`screen ${isActive ? 'active' : ''} bg-cream gap-8`}
      aria-label="Welcome screen"
    >
      {/* ── Decorative Background Paws ──────────────────────────────────────
          Absolutely-positioned emoji paw prints that gently float.
          aria-hidden so screen readers skip them entirely.
      ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {BG_PAWS.map((paw, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-[0.08] select-none animate-float"
            style={{
              top:              paw.top,
              left:             paw.left,
              right:            paw.right,
              animationDelay:   paw.delay,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* ── Hero Block ───────────────────────────────────────────────────────
          Centred title and subtitle. The cat emoji bounces on a slow loop
          to draw the eye and set a playful tone.
      ── */}
      <div className="relative z-10 text-center">
        {/* Bouncing cat icon */}
        <span
          className="block text-7xl mb-4 animate-bounce-slow"
          role="img"
          aria-label="Cat face"
        >
          🐱
        </span>

        {/* App title – serif font for editorial feel */}
        <h1 className="font-serif font-bold text-text-dark leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)' }}>
          Paws &amp;<br />
          {/* Italic accent colour on the keyword */}
          <em className="not-italic italic text-accent">Preferences</em>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-text-mid leading-relaxed max-w-[300px] mx-auto text-base">
          Swipe through adorable kitties and discover your favourite feline type!
        </p>
      </div>

      {/* ── Swipe Direction Hint ─────────────────────────────────────────────
          Visual legend showing what left/right swipe means.
          Helps new users understand the mechanic before starting.
      ── */}
      <div
        className="relative z-10 flex items-center gap-4 text-sm text-text-mid"
        aria-label="Swipe left to dislike, swipe right to like"
      >
        {/* Nope chip */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-nope-soft text-nope font-medium">
          👈 Nope
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-accent-soft" aria-hidden="true" />

        {/* Like chip */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-like-soft text-like font-medium">
          Like 👉
        </div>
      </div>

      {/* ── CTA Button ───────────────────────────────────────────────────────
          Clicking this calls onStart which triggers cat loading and
          transitions the app from the intro screen to the deck screen.
      ── */}
      <button
        className="
          relative z-10
          inline-flex items-center gap-2
          px-10 py-4
          rounded-pill
          bg-accent text-white
          font-sans font-semibold text-base
          shadow-btn-primary
          active:scale-95 active:shadow-md
          transition-all duration-150
        "
        onClick={onStart}
        aria-label="Start swiping cats"
      >
        Let&apos;s Go! 🐾
      </button>
    </section>
  )
}

export default IntroScreen
