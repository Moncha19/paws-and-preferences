/**
 * Props:
 *   @prop {boolean}              isActive   - Whether this screen is shown
 *   @prop {(liked: string[]) => void} onComplete - Called with liked[] when deck is done
 *
 * The component exposes an imperative "start" method via the onComplete flow:
 * the parent (App) resets this component when it sets isActive to true.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import CatCard from './CatCard'
import CONFIG from '../config/config'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * @param  {number} index  Card position in the deck
 * @returns {string}       Full image URL
 */
function buildCatUrl(index) {
  const uid = `${Date.now()}-${index}`
  return `${CONFIG.CATAAS_BASE}?uid=${uid}`
}

// ─── Component ────────────────────────────────────────────────────────────────

function DeckScreen({ isActive, onComplete }) {
  // ── Deck data ─────────────────────────────────────────────────────────────
  const [cats, setCats]               = useState([])        // array of image URLs
  const [currentIndex, setCurrentIndex] = useState(0)       // index of top card
  const [liked, setLiked]             = useState([])        // collected liked URLs

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading]     = useState(true)
  const [isEmpty, setIsEmpty]         = useState(false)

  // Prevent rapid double-clicking the action buttons while a card is flying
  const isAnimating = useRef(false)

  // ── Load cats whenever this screen becomes active ─────────────────────────
  useEffect(() => {
    if (!isActive) return

    // Reset all state for a fresh session (handles "Try Again" restarts)
    setIsLoading(true)
    setIsEmpty(false)
    setCurrentIndex(0)
    setLiked([])

    // Build all cat URLs upfront.
    // Cataas serves images directly (no JSON), so this is synchronous –
    // the browser will lazy-load actual image data on demand.
    const urls = Array.from({ length: CONFIG.TOTAL_CATS }, (_, i) => buildCatUrl(i))
    setCats(urls)
    setIsLoading(false)
  }, [isActive])

  // ── Handle a confirmed swipe from a CatCard ───────────────────────────────
  /**
   * handleSwipe – processes the result of a card flying off screen.
   * Records liked cards and advances the deck index.
   *
   * @param {number}  cardIndex  Which card was swiped
   * @param {boolean} isLike     true = swiped right, false = swiped left
   */
  const handleSwipe = useCallback((cardIndex, isLike) => {
    // Guard against race conditions from rapid button taps
    if (isAnimating.current) return
    isAnimating.current = true

    // Record the like
    if (isLike) {
      setLiked(prev => [...prev, cats[cardIndex]])
    }

    // Advance to the next card
    const nextIndex = cardIndex + 1

    if (nextIndex >= cats.length) {
      // ── All cards exhausted ───────────────────────────────────────────────
      setIsEmpty(true)

      // Brief delay so the "All done" message is visible before navigating
      setTimeout(() => {
        setLiked(prev => {
          onComplete(prev) // hand off liked list to parent
          return prev
        })
        isAnimating.current = false
      }, CONFIG.RESULTS_DELAY)
    } else {
      // ── Advance to next card ──────────────────────────────────────────────
      setCurrentIndex(nextIndex)
      isAnimating.current = false
    }
  }, [cats, onComplete])

  // ── Action button handlers (tap alternatives to swiping) ─────────────────

  /** Triggered by the ❤️ button – programmatic like swipe */
  const handleLikeBtn = useCallback(() => {
    if (isAnimating.current || currentIndex >= cats.length) return
    handleSwipe(currentIndex, true)
  }, [currentIndex, cats.length, handleSwipe])

  /** Triggered by the 👎 button – programmatic nope swipe */
  const handleNopeBtn = useCallback(() => {
    if (isAnimating.current || currentIndex >= cats.length) return
    handleSwipe(currentIndex, false)
  }, [currentIndex, cats.length, handleSwipe])

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      className={`screen ${isActive ? 'active' : ''} justify-between`}
      style={{ padding: '16px 16px 24px', gap: 0 }}
      aria-label="Cat swiping deck"
    >
      {/* ── Header Bar ────────────────────────────────────────────────────── */}
      <header className="w-full max-w-[420px] flex justify-between items-center py-2">
        {/* Brand name */}
        <div className="font-serif font-bold text-text-dark text-xl">
          Paws &amp; Prefs
        </div>

        {/* Progress pill: "3 / 15" – updates on every card advance */}
        <div
          className="
            bg-white border-[1.5px] border-accent-soft
            rounded-pill px-3.5 py-1.5
            text-xs font-semibold text-text-mid
          "
          aria-live="polite"
          aria-label={`Card ${currentIndex + 1} of ${cats.length}`}
        >
          {cats.length > 0 ? `${currentIndex + 1} / ${cats.length}` : '– / –'}
        </div>
      </header>

      {/* ── Card Stack ────────────────────────────────────────────────────── */}
      {/*
        The stack fills the space between header and action row.
        Cards are absolutely positioned inside, layered by z-index.
        max-height caps the card area on tall tablets / desktops.
      */}
      <div
        className="relative w-full max-w-[420px]"
        style={{ height: 'calc(100vh - 200px)', maxHeight: '560px' }}
        role="region"
        aria-label="Cat image cards"
      >

        {/* ── Loading Spinner ──────────────────────────────────────────────
            Shown while cat URLs are being generated.
            In practice this resolves instantly, but kept for robustness.
        ── */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-mid text-sm">
            <div className="w-10 h-10 rounded-full border-[3px] border-accent-soft border-t-accent animate-spin" role="status" aria-label="Loading cats" />
            <span>Fetching kitties…</span>
          </div>
        )}

        {/* ── Empty State ──────────────────────────────────────────────────
            Shown after the last card has been swiped, briefly before
            transitioning to the results screen.
        ── */}
        {isEmpty && !isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-mid text-base transition-opacity duration-400"
            aria-live="polite"
          >
            <span className="text-5xl">✨</span>
            <p>All done! Calculating your favourites…</p>
          </div>
        )}

        {/* ── Cat Cards ────────────────────────────────────────────────────
            Render all cards; CatCard handles its own visibility based on depth.
            Rendering all upfront (not just the top 3) lets images preload.
        ── */}
        {!isLoading && !isEmpty && cats.map((url, i) => {
          const depth = i - currentIndex  // 0 = top, 1 = second, etc.
          if (depth < 0) return null       // already swiped – skip render

          return (
            <CatCard
              key={url}           // URL is unique per session, safe as key
              imageUrl={url}
              index={i}
              depth={depth}
              isTop={depth === 0}
              onSwipe={handleSwipe}
            />
          )
        })}
      </div>

      {/* ── Action Buttons ────────────────────────────────────────────────── */}
      {/*
        Tap alternatives to swiping.
        Hidden when the deck is empty (isEmpty state) so they don't
        confusingly appear on the transition screen.
      */}
      <div
        className={`flex justify-center items-center gap-5 w-full max-w-[420px] pt-4 ${isEmpty ? 'invisible' : ''}`}
        role="group"
        aria-label="Like or dislike buttons"
      >
        {/* NOPE button – cobalt themed */}
        <button
          className="
            w-[62px] h-[62px] rounded-full
            bg-white shadow-btn-nope
            flex items-center justify-center
            text-2xl
            active:scale-90
            transition-transform duration-150
          "
          onClick={handleNopeBtn}
          aria-label="Dislike this cat"
          title="Nope"
        >
          👎
        </button>

        {/* LIKE button – rose themed */}
        <button
          className="
            w-[62px] h-[62px] rounded-full
            bg-white shadow-btn-like
            flex items-center justify-center
            text-2xl
            active:scale-90
            transition-transform duration-150
          "
          onClick={handleLikeBtn}
          aria-label="Like this cat"
          title="Like"
        >
          ❤️
        </button>
      </div>
    </section>
  )
}

export default DeckScreen
