import React, { useState, useCallback } from 'react'
import IntroScreen   from './components/IntroScreen'
import DeckScreen    from './components/DeckScreen'
import ResultsScreen from './components/ResultsScreen'
import CONFIG        from './config/config'

// ─── Screen name constants ────────────────────────────────────────────────────
const SCREENS = {
  INTRO:   'intro',
  DECK:    'deck',
  RESULTS: 'results',
}

function App() {
  // ── Current screen ───────────────────────────────────────────────────────
  const [screen, setScreen] = useState(SCREENS.INTRO)

  // ── Results data ──────────────────────────────────────────────────────────
  // Stored here (at root level) so ResultsScreen can access it even after
  // DeckScreen unmounts / resets for a new session.
  const [likedCats, setLikedCats]   = useState([])
  const [totalCats, setTotalCats]   = useState(CONFIG.TOTAL_CATS)

  // ── Screen transition handlers ────────────────────────────────────────────

  /**
   * handleStart – called by IntroScreen when the user clicks "Let's Go!".
   * Transitions to the deck and lets DeckScreen handle loading.
   */
  const handleStart = useCallback(() => {
    setScreen(SCREENS.DECK)
  }, [])

  /**
   * handleDeckComplete – called by DeckScreen when all cards have been swiped.
   * Receives the array of liked URLs and the total count, then navigates to results.
   *
   * @param {string[]} liked  URLs the user swiped right on
   * @param {number}   total  Total cards shown this session
   */
  const handleDeckComplete = useCallback((liked) => {
    setLikedCats(liked)
    setTotalCats(CONFIG.TOTAL_CATS)
    setScreen(SCREENS.RESULTS)
  }, [])

  /**
   * handleRestart – called by ResultsScreen "Try Again" button.
   * Resets liked data and returns to the intro screen.
   * DeckScreen will re-initialise when isActive becomes true again.
   */
  const handleRestart = useCallback(() => {
    setLikedCats([])
    setScreen(SCREENS.INTRO)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    // Outer wrapper fills the full viewport and acts as the position root
    // for the absolutely-positioned screen layers.
    <div className="relative w-full h-full bg-cream overflow-hidden font-sans text-text-dark">

      {/* ── Screen 1: Intro ───────────────────────────────────────────────── */}
      <IntroScreen
        isActive={screen === SCREENS.INTRO}
        onStart={handleStart}
      />

      {/* ── Screen 2: Swipe Deck ──────────────────────────────────────────── */}
      {/*
        DeckScreen re-initialises its cat list every time isActive flips to true,
        so a "Try Again" flow always starts with a fresh set of cats.
      */}
      <DeckScreen
        isActive={screen === SCREENS.DECK}
        onComplete={handleDeckComplete}
      />

      {/* ── Screen 3: Results ─────────────────────────────────────────────── */}
      <ResultsScreen
        isActive={screen === SCREENS.RESULTS}
        liked={likedCats}
        total={totalCats}
        onRestart={handleRestart}
      />
    </div>
  )
}

export default App
