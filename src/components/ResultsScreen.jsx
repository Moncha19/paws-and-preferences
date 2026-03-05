/**
 * ResultsScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The summary screen shown after all cards have been swiped.
 *
 * Sections:
 *   1. Header  – emoji + title + stats ("You liked X out of Y cats")
 *   2. Grid    – thumbnail photos of all liked cats (or a "no faves" message)
 *   3. Footer  – "Try Again" button that resets the session
 *
 * Props:
 *   @prop {boolean}    isActive  - Whether this screen is currently shown
 *   @prop {string[]}   liked     - Array of Cataas image URLs the user liked
 *   @prop {number}     total     - Total number of cats shown in the session
 *   @prop {() => void} onRestart - Callback fired when the user hits "Try Again"
 */

import React from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * getResultEmoji – picks a celebratory emoji based on how many cats were liked.
 * A small UX touch that personalises the results screen.
 *
 * @param  {number} likeCount
 * @returns {string} Emoji string
 */
function getResultEmoji(likeCount) {
  if (likeCount === 0)  return '😢'
  if (likeCount < 5)   return '😊'
  if (likeCount < 10)  return '😍'
  return '🐱💕'
}

// ─── Component ────────────────────────────────────────────────────────────────

function ResultsScreen({ isActive, liked, total, onRestart }) {
  const likeCount = liked.length

  return (
    <section
      className={`screen ${isActive ? 'active' : ''} justify-start overflow-y-auto`}
      style={{ gap: 0, padding: '24px 20px 40px' }}
      aria-label="Results screen"
    >
      {/* ── Results Header ────────────────────────────────────────────────── */}
      <div className="w-full max-w-[480px] text-center mb-7">
        {/* Emoji reacts to how many cats were liked */}
        <span
          className="block text-6xl mb-3"
          role="img"
          aria-label="Result emoji"
        >
          {getResultEmoji(likeCount)}
        </span>

        {/* Dynamic title */}
        <h2 className="font-serif font-bold text-text-dark"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
          {likeCount === 0
            ? <>Hmm, <em className="italic text-accent">No Faves?</em></>
            : <>Your <em className="italic text-accent">Favourite</em> Kitties</>
          }
        </h2>

        {/* Stats line */}
        <p className="mt-2.5 text-text-mid text-sm">
          You liked{' '}
          <strong className="text-text-dark">{likeCount}</strong>
          {' '}out of{' '}
          <strong className="text-text-dark">{total}</strong>
          {' '}cats
        </p>
      </div>

      {/* ── Liked Photos Grid ─────────────────────────────────────────────── */}
      {/*
        Responsive grid:
          - 2 columns on mobile  (default)
          - 3 columns on ≥ 480px (sm breakpoint)

        Each thumbnail pops in with a staggered entrance animation
        so they reveal in a satisfying wave rather than all at once.
      */}
      <div
        className="w-full max-w-[480px] grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7"
        role="list"
        aria-label="Cats you liked"
      >
        {likeCount === 0 ? (
          // No-likes fallback message
          <p className="col-span-2 sm:col-span-3 text-center text-text-mid text-sm p-5">
            Looks like none of the cats caught your eye today. Try again!
          </p>
        ) : (
          // Thumbnail for each liked cat
          liked.map((url, i) => (
            <div
              key={url}
              className="aspect-square rounded-2xl overflow-hidden shadow-thumb pop-in"
              style={{
                // Stagger each thumbnail's pop-in by 60ms per item
                animationDelay: `${i * 0.06}s`,
              }}
              role="listitem"
            >
              <img
                src={url}
                alt={`Liked cat ${i + 1}`}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>

      {/* ── Try Again Button ──────────────────────────────────────────────── */}
      {/*
        Outlined ghost button style to visually contrast with the filled
        CTA on the intro screen.
      */}
      <button
        className="
          inline-flex items-center gap-2
          px-9 py-3.5
          rounded-pill
          border-2 border-accent
          bg-transparent text-accent
          font-sans font-semibold text-sm
          hover:bg-accent hover:text-white
          active:bg-accent active:text-white
          transition-colors duration-200
        "
        onClick={onRestart}
        aria-label="Play again"
      >
        🔄 Try Again
      </button>
    </section>
  )
}

export default ResultsScreen
