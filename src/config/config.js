/**
 * config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central configuration for the Paws & Preferences application.
 * Keeping all magic numbers here makes tuning easy without hunting
 * through component files.
 */

const CONFIG = {
  // ── Cat Loading ─────────────────────────────────────────────────────────────

  /** Total number of cat cards presented per session */
  TOTAL_CATS: 15,

  /**
   * Cataas (Cat as a Service) base URL.
   * GET /cat returns a random JPEG directly – no JSON wrapper needed.
   * We append a unique ?uid param to bust the browser cache so every
   * request fetches a visually different cat.
   * Docs: https://cataas.com/
   */
  CATAAS_BASE: 'https://cataas.com/cat',

  // ── Swipe Physics ────────────────────────────────────────────────────────────

  /**
   * Horizontal drag distance (px) required to confirm a swipe decision.
   * Below this the card snaps back; at or above it the card flies off.
   */
  SWIPE_THRESHOLD: 100,

  /**
   * Tilt angle applied per pixel of horizontal drag.
   * e.g. at 100 px drag → 100 × 0.07 = 7° tilt (then capped by MAX_TILT)
   */
  TILT_FACTOR: 0.07,

  /** Maximum rotation angle in degrees regardless of drag distance */
  MAX_TILT: 20,

  // ── Stamp Labels ─────────────────────────────────────────────────────────────

  /**
   * Maximum opacity of the LIKE / NOPE rubber-stamp shown while dragging.
   * Opacity scales linearly from 0 → STAMP_MAX_OPACITY as drag goes from
   * 0 → SWIPE_THRESHOLD pixels.
   */
  STAMP_MAX_OPACITY: 0.9,

  // ── Card Stack Visuals ────────────────────────────────────────────────────────

  /** Vertical offset (px) added per depth level in the card stack */
  STACK_OFFSET_Y: 12,

  /**
   * Scale reduction per depth level in the card stack.
   * e.g. depth 1 → scale(1 - 0.04) = scale(0.96)
   *      depth 2 → scale(1 - 0.08) = scale(0.92)
   */
  STACK_SCALE_STEP: 0.04,

  /** Only the top N cards are rendered visually (rest are opacity:0) */
  VISIBLE_STACK_DEPTH: 3,

  // ── Timing ───────────────────────────────────────────────────────────────────

  /** Delay (ms) between the last card flying off and showing the results screen */
  RESULTS_DELAY: 800,
}

export default CONFIG
