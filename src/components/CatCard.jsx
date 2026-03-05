/**
 * CatCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A single cat card in the swipe deck.
 *
 * Responsibilities:
 *   • Renders the cat image with a gradient overlay
 *   • Displays LIKE / NOPE rubber-stamp labels during dragging
 *   • Applies live rotation & translation transforms while being dragged
 *   • Attaches touch event listeners with { passive: false } (required to
 *     call preventDefault() and block browser scroll during horizontal swipes)
 *   • Triggers fly-off animation and notifies parent on confirmed swipe
 *
 * Props:
 *   @prop {string}   imageUrl    - The Cataas image URL for this card
 *   @prop {number}   index       - Card index in the original array (0-based)
 *   @prop {number}   depth       - 0 = top card, 1 = second, 2 = third, etc.
 *   @prop {boolean}  isTop       - True only for the top-most visible card
 *   @prop {Function} onSwipe     - Called with (index, isLike) when card flies off
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import CONFIG from '../config/config'

function CatCard({ imageUrl, index, depth, isTop, onSwipe }) {
  // ── Ref to the card DOM node (needed for touch listener attachment) ───────
  const cardRef = useRef(null)

  // ── Drag tracking state ───────────────────────────────────────────────────
  // Keeping drag internals in a plain ref avoids re-renders on every
  // pointer-move event (which would fire at 60fps during a drag).
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
  })

  // ── Visual feedback state (drives React re-render only when needed) ───────
  const [dragDelta, setDragDelta]     = useState(0)    // current horizontal offset
  const [isDragging, setIsDragging]   = useState(false) // disables CSS transition
  const [isFlying, setIsFlying]       = useState(null)  // 'right' | 'left' | null

  // ─────────────────────────────────────────────────────────────────────────
  // GESTURE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  /** Normalise pointer position from either a TouchEvent or MouseEvent */
  const getXY = (e) => {
    if (e.touches?.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    return { x: e.clientX, y: e.clientY }
  }

  /** Called when the user starts pressing / touching the card */
  const handleDragStart = useCallback((e) => {
    if (!isTop || isFlying) return

    const { x, y } = getXY(e)
    dragRef.current = { active: true, startX: x, startY: y, deltaX: 0 }
    setIsDragging(true)
  }, [isTop, isFlying])

  /** Called on every pointer move while dragging */
  const handleDragMove = useCallback((e) => {
    if (!dragRef.current.active) return

    const { x, y } = getXY(e)
    const deltaX = x - dragRef.current.startX
    const deltaY = y - dragRef.current.startY

    // Only intercept horizontal motion; let vertical scroll pass through
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Block the browser's native vertical scroll during a horizontal swipe
      if (e.cancelable) e.preventDefault()
    } else {
      return // Vertical dominates – don't interfere
    }

    dragRef.current.deltaX = deltaX
    setDragDelta(deltaX)
  }, [])

  /** Called when the user releases the pointer */
  const handleDragEnd = useCallback(() => {
    if (!dragRef.current.active) return
    dragRef.current.active = false

    const { deltaX } = dragRef.current
    setIsDragging(false)

    if (Math.abs(deltaX) >= CONFIG.SWIPE_THRESHOLD) {
      // ── Swipe confirmed ──────────────────────────────────────────────────
      // 1. Start the fly-off animation
      const isLike = deltaX > 0
      setIsFlying(isLike ? 'right' : 'left')

      // 2. Wait for the CSS fly animation to complete, then notify parent
      setTimeout(() => {
        onSwipe(index, isLike)
      }, 450) // matches --fly-duration: 0.45s in the stylesheet
    } else {
      // ── Swipe cancelled – snap card back to centre ───────────────────────
      setDragDelta(0)
    }
  }, [index, onSwipe])

  // ─────────────────────────────────────────────────────────────────────────
  // TOUCH EVENT ATTACHMENT
  // ─────────────────────────────────────────────────────────────────────────
  /*
    We attach touchmove / touchend via addEventListener (not JSX event props)
    because React's synthetic events are passive by default in newer versions,
    which prevents calling preventDefault() to block native scroll.

    { passive: false } opts back in to the old behaviour so we can
    intercept horizontal touches and prevent unintended page scrolling.
  */
  useEffect(() => {
    const card = cardRef.current
    if (!card || !isTop) return

    card.addEventListener('touchmove', handleDragMove, { passive: false })
    card.addEventListener('touchend',  handleDragEnd,  { passive: true  })

    return () => {
      card.removeEventListener('touchmove', handleDragMove)
      card.removeEventListener('touchend',  handleDragEnd)
    }
  }, [isTop, handleDragMove, handleDragEnd])

  // Global mouse listeners so drag continues if cursor leaves the card
  useEffect(() => {
    if (!isTop) return
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup',   handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup',   handleDragEnd)
    }
  }, [isTop, handleDragMove, handleDragEnd])

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED STYLES
  // ─────────────────────────────────────────────────────────────────────────

  // ── Stack position transform (for depth 1 / 2 cards below the top) ───────
  // Cards beneath the top card are pushed down and scaled down to create
  // the illusion of a physical stack without 3D CSS.
  const cappedDepth = Math.min(depth, CONFIG.VISIBLE_STACK_DEPTH - 1)
  const stackOffsetY   = cappedDepth * CONFIG.STACK_OFFSET_Y     // e.g. 12, 24 px
  const stackScaleDown = cappedDepth * CONFIG.STACK_SCALE_STEP   // e.g. 0.04, 0.08

  // ── Drag transform (only for the top card while being dragged) ────────────
  let dragTransform = ''
  if (isTop && dragDelta !== 0 && !isFlying) {
    // Tilt proportional to horizontal drag, capped at MAX_TILT degrees
    const tilt = Math.min(
      Math.abs(dragDelta) * CONFIG.TILT_FACTOR,
      CONFIG.MAX_TILT
    ) * Math.sign(dragDelta)

    dragTransform = `translateX(${dragDelta}px) rotate(${tilt}deg)`
  }

  // ── LIKE / NOPE stamp opacity ─────────────────────────────────────────────
  // Ramps from 0 → STAMP_MAX_OPACITY as drag progresses toward the threshold
  const stampProgress  = Math.min(Math.abs(dragDelta) / CONFIG.SWIPE_THRESHOLD, 1)
  const stampOpacity   = stampProgress * CONFIG.STAMP_MAX_OPACITY
  const showLikeStamp  = dragDelta > 0
  const showNopeStamp  = dragDelta < 0

  // ── Final inline style ────────────────────────────────────────────────────
  const cardStyle = {
    // z-index: top card sits highest, deeper cards sit lower
    zIndex: isFlying ? 0 : 100 - depth,

    // Visibility: hide cards beyond the visible stack depth to save GPU
    opacity:    depth < CONFIG.VISIBLE_STACK_DEPTH ? 1 : 0,
    visibility: depth < CONFIG.VISIBLE_STACK_DEPTH ? 'visible' : 'hidden',

    // Transform priority:
    //   1. If flying off → CSS class handles it (card-flying-right/left)
    //   2. If dragging   → live drag transform
    //   3. Otherwise     → stack depth transform
    transform: isFlying
      ? undefined // overridden by CSS class
      : dragTransform || `translateY(${stackOffsetY}px) scale(${1 - stackScaleDown})`,
  }

  // ── CSS class selection ───────────────────────────────────────────────────
  const cardClasses = [
    // Base card styles
    'absolute inset-0 rounded-card overflow-hidden shadow-card select-none',
    // Cursor style: grab when idle, grabbing while dragging
    isTop ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'pointer-events-none',
    // Transition: disabled during drag (card follows finger exactly),
    // enabled otherwise (snap-back spring animation or stack reorder)
    isDragging   ? 'card-dragging'
    : isFlying   ? `card-flying-${isFlying}`
    :               'card-stack-transition',
  ].join(' ')

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={cardStyle}
      data-index={index}
      role="img"
      aria-label={`Cat ${index + 1}`}
      // Mouse drag start (touch start is handled via addEventListener above)
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      // Prevent the browser from natively dragging the <img> element
      draggable={false}
    >
      {/* ── Cat Photo ─────────────────────────────────────────────────────
          object-fit: cover fills the card without distorting the image.
          loading="lazy" defers off-screen images for better initial load.
      ── */}
      <img
        src={imageUrl}
        alt={`Cat number ${index + 1}`}
        className="w-full h-full object-cover block pointer-events-none"
        loading="lazy"
        draggable={false}
      />

      {/* ── Gradient Overlay ────────────────────────────────────────────────
          Darkens the bottom of the card creating visual depth and making
          the stamp labels readable against any cat photo.
      ── */}
      <div className="absolute inset-0 card-gradient pointer-events-none" aria-hidden="true" />

      {/* ── LIKE Stamp ──────────────────────────────────────────────────────
          Fades in when the user drags right toward the like threshold.
          Tilted slightly to look like a real rubber stamp.
      ── */}
      <div
        className="
          absolute top-7 right-6
          px-5 py-2 rounded-lg
          font-serif font-bold text-2xl tracking-widest
          text-like border-[3px] border-like bg-white/90
          pointer-events-none
          transition-opacity duration-100
        "
        style={{
          opacity:   showLikeStamp ? stampOpacity : 0,
          transform: 'rotate(15deg)',
        }}
        aria-hidden="true"
      >
        LIKE
      </div>

      {/* ── NOPE Stamp ──────────────────────────────────────────────────────
          Fades in when the user drags left toward the nope threshold.
      ── */}
      <div
        className="
          absolute top-7 left-6
          px-5 py-2 rounded-lg
          font-serif font-bold text-2xl tracking-widest
          text-nope border-[3px] border-nope bg-white/90
          pointer-events-none
          transition-opacity duration-100
        "
        style={{
          opacity:   showNopeStamp ? stampOpacity : 0,
          transform: 'rotate(-15deg)',
        }}
        aria-hidden="true"
      >
        NOPE
      </div>
    </div>
  )
}

export default CatCard
