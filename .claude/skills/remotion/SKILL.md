---
name: remotion
description: "Animation planning and motion-design best practices (Remotion-style, planning only — no rendering). Use when choreographing UI or video motion: hero animations, intros, transitions, staggered reveals, loops, power-on sequences, timing and easing. Concepts: frames, fps, durationInFrames, useCurrentFrame, interpolate, spring, Sequence/Series, easing curves, enter/exit, stagger, reduced-motion. PLANNING AND GUIDANCE ONLY — does NOT install Remotion, add npm dependencies, or render video. Implement the resulting motion spec with the project's existing stack (framer-motion + CSS)."
---
# Remotion — Animation Planning & Motion Best Practices

This skill provides a frame-based way to PLAN and choreograph motion. It does
**not** install Remotion, add dependencies, or render video. Use it to produce a
clear motion spec, then implement it with whatever the project already uses
(here: framer-motion + CSS/SVG).

## When to use
- Planning a hero/intro animation, transition, loop, or multi-step sequence.
- Deciding timing, easing, ordering, and enter/exit choreography.
- Translating a "feel" ("powers on, then settles") into concrete beats.

## Frame-based timing model
- Think in frames at a target fps (e.g. 30fps): `frame = seconds * fps`,
  `durationInFrames = seconds * fps`.
- Map a storyboard to a timeline of beats with start/end times.
- When implementing in framer-motion/CSS, convert frames→seconds for
  `transition`/`animation-duration` and `delay`.

## Core primitives (as planning vocabulary)
- `useCurrentFrame()` / time → drives every value.
- `interpolate(input, [inRange], [outRange], { extrapolateLeft/Right: 'clamp' })`
  → map time to opacity/translate/scale; always clamp to avoid overshoot leaks.
- `spring({ frame, fps, config })` → natural overshoot/settle for "snap" beats.
- `Sequence` / `Series` → place and order beats on the timeline.
- `AbsoluteFill` → stacked full-bleed layers (maps to absolute-positioned layers).

## Motion best practices
- Durations: 150–300ms micro-interactions; 300–600ms larger moves; >800ms only
  for deliberate cinematic beats.
- Easing: ease-out for entrances, ease-in for exits; spring for physical "settle".
- Stagger reveals (~60–120ms apart) for groups; never animate everything at once.
- Enter/exit should be asymmetric (faster exit).
- Animate transform/opacity only (GPU-friendly); avoid width/height/top/left.
- Loops must be seamless (match first/last frame); keep ambient loops subtle.
- Always define a `prefers-reduced-motion` fallback (freeze to final state).

## Planning workflow
1. Storyboard the beats in order (e.g. rotate-in → power → data → fans → counter).
2. Assign each beat a start/end (frames + seconds).
3. Choose an easing/spring per beat.
4. Define enter/exit + reduced-motion fallback.
5. Sanity-check performance (transform/opacity, layer count).

## Output format — motion spec
Produce a timeline table: | Beat | Start | End | Property | From→To | Easing |
plus a one-line reduced-motion fallback. Hand that spec to the implementation
step (framer-motion/CSS) — do not render with Remotion.
