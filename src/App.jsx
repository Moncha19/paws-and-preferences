// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root component for Paws & Preferences.
 *
 * Manages top-level application state:
 *   • Which screen is currently active ('intro' | 'deck' | 'results')
 *   • The list of liked cat URLs passed to the results screen
 *   • The total count of cats shown (for the results stats line)
 *
 * Screen flow:
 *   intro  ──[Start]──►  deck  ──[All swiped]──►  results
 *     ▲                                               │
 *     └──────────────[Try Again]─────────────────────┘
 *
 * All three screens are always in the DOM; visibility is toggled via
 * the `.screen` / `.screen.active` CSS classes so CSS transitions fire.
 */

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
