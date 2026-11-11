---
name: Loaders
component: Loader
parts: WlddLoader, WlddLogo
summary: Ring for waits, Notch for step-by-step jobs, the WLDD Cycle for AI. Each settles when done.
status: stable
group: motion
---

## When to use

WLDD uses three loaders. Nothing else.

- **`kind="ring"`**, the everyday wait: saving, fetching, inside a button.
- **`kind="notch"`**, a step-by-step job: syncing, scheduling, importing.
- **`kind="ai"`**, the assistant thinking: the WLDD letters take turns in one slot (the wordmark's Cycle). In chat, beside "Thinking", in the AI's reply bubble.
- **WlddLoader** for brand moments only: first load, a full-page wait. Its other modes (press, dance, drop, build, travel, portal) live on Brand › Logo animations.

## Do

- The app's own logo is always `<WlddLogo />`, drawn in code. It presses into its shadows on hover. Never use an image of the WLDD logo.
- Flip `done` when the work finishes. Ring and Notch settle into a check; AI lands its letters in the word. Hold it briefly, then show the result.
- Size to context: 14 inside small buttons, 16–20 inline, 48–96 for a whole panel.
- Pair a button's loader with a TextMorph label: "Saving" → "Saved".

## Don't

- Don't use any other spinner, orb or animation for loading. Ring, Notch and AI cover every wait.
- Don't use the AI loader for things that aren't the assistant.
- Don't show a loader for waits under about 300ms. Nothing is better than a flash.
- Don't use the WLDD wordmark for small, frequent waits.
- Don't stack several loaders on one screen. Use one for the region that's loading.
- Don't use loaders for decoration. They mean "working".

## Accessibility

- Loader renders `role="status"` with its `label`, and says "Done" when finished.
- Under reduced motion, keep the loader but expect less movement.
