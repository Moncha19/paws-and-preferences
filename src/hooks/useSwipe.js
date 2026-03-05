/**
 * useSwipe.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom React hook that encapsulates all swipe / drag gesture logic.
 *
 * Handles both:
 *   • Touch events  (mobile – finger gestures)
 *   • Mouse events  (desktop – click & drag)
 *
 * Both input types are normalised into a single drag model so the rest
 * of the app doesn't need to care which device the user is on.
 *
 * Returns handlers to spread onto the card container, plus live drag
 * state so the parent can apply visual feedback.
 *
 * Usage:
 *   const { dragState, handlers } = useSwipe({ onSwipe, threshold, ... })
 *   <div {...handlers}>...</div>
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import CONFIG from '../config/config'

/**
 * @typedef {Object} DragState
 * @property {boolean} active   - Is a drag gesture currently in progress?
 * @property {number}  deltaX   - Horizontal distance from drag start (px)
 * @property {number}  deltaY   - Vertical distance from drag start (px)
 */

/**
 * @typedef {Object} UseSwipeOptions
 * @property {(isLike: boolean) => void} onSwipe    - Called when threshold is crossed
 * @property {boolean}                   disabled   - Disable all gestures when true
 */

/**
 * useSwipe – main hook export.
 *
 * @param {UseSwipeOptions} options
 * @returns {{ dragState: DragState, handlers: object }}
 */
export function useSwipe({ onSwipe, disabled = false }) {
  // ── Drag state exposed to parent for visual feedback ─────────────────────
  const [dragState, setDragState] = useState({
    active: false,
    deltaX: 0,
    deltaY: 0,
  })

  // ── Internal ref for tracking start position ──────────────────────────────
  // Using a ref (not state) for start coords avoids triggering re-renders
  // on every pointer move, keeping the drag smooth at 60 fps.
  const startRef = useRef({ x: 0, y: 0, active: false })

  // ── Helper: extract normalised x / y from TouchEvent or MouseEvent ────────
  const getPointerXY = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }, [])

  // ── onDragStart: record the start position ────────────────────────────────
  const onDragStart = useCallback((e) => {
    if (disabled) return

    const { x, y } = getPointerXY(e)
    startRef.current = { x, y, active: true }

    setDragState({ active: true, deltaX: 0, deltaY: 0 })
  }, [disabled, getPointerXY])

  // ── onDragMove: update delta and conditionally prevent scroll ─────────────
  const onDragMove = useCallback((e) => {
    if (!startRef.current.active) return

    const { x, y } = getPointerXY(e)
    const deltaX = x - startRef.current.x
    const deltaY = y - startRef.current.y

    // Only intercept horizontal swipes; let vertical scrolling pass through
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Block native vertical scroll while the user is swiping sideways
      if (e.cancelable) e.preventDefault()
    } else {
      // Vertical dominates → bail out and let the browser handle scroll
      return
    }

    setDragState({ active: true, deltaX, deltaY })
  }, [getPointerXY])

  // ── onDragEnd: decide whether to confirm the swipe or snap back ───────────
  const onDragEnd = useCallback(() => {
    if (!startRef.current.active) return
    startRef.current.active = false

    setDragState(prev => {
      const { deltaX } = prev

      if (Math.abs(deltaX) >= CONFIG.SWIPE_THRESHOLD) {
        // Threshold crossed → fire swipe callback with direction
        const isLike = deltaX > 0
        onSwipe(isLike)
      }
      // Reset drag state regardless – card snap-back is handled by CSS
      return { active: false, deltaX: 0, deltaY: 0 }
    })
  }, [onSwipe])

  // ── Attach mousemove / mouseup globally so drag continues outside element ─
  //    (without this, releasing the mouse outside the card breaks the gesture)
  useEffect(() => {
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup',   onDragEnd)
    return () => {
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup',   onDragEnd)
    }
  }, [onDragMove, onDragEnd])

  // ── Event handlers to spread onto the card element ───────────────────────
  const handlers = {
    onMouseDown:  onDragStart,
    onTouchStart: onDragStart,
    // touchmove / touchend need to be attached via addEventListener (not JSX)
    // because we need { passive: false } to call preventDefault().
    // This is handled inside the CatCard component using a ref + useEffect.
  }

  return { dragState, handlers }
}
