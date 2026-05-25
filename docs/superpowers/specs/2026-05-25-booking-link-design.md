# Booking Link Placement Design

**Date:** 2026-05-25  
**Status:** Approved (Option C)

## Goal

Add the Google Calendar booking link (`https://calendar.app.google/xSEioGnYZp1zk3Ra6`) to the site for broad visibility — useful to consulting prospects and general readers alike.

## Chosen Approach: Option C

- **About page** — two touchpoints:
  1. A `connect-btn` in the `connect-section` alongside LinkedIn, GitHub, and cabargas.consulting
  2. A secondary CTA button in the `consulting-cta` box alongside the existing "Work with me ↗" button
- **Footer on all three pages** (`index.html`, `about.html`, `projects.html`) — a link in the existing `social-links` row

## Copy

| Location | EN | ES |
|---|---|---|
| connect-btn | Book a call ↗ | Reservar una llamada ↗ |
| cta secondary btn | Book a call ↗ | Reservar una llamada ↗ |
| Footer link | Book a call | Reservar llamada |

Footer uses bilingual `<span data-lang>` spans so the existing lang-switcher JS handles visibility.

## CSS Changes

Add to `style.css`:

- `.cta-actions` — flex wrapper for the two CTA buttons (gap: 8px, flex-shrink: 0)
- `.cta-btn-secondary` — outline/ghost variant of `.cta-btn` for use on the dark navy CTA background (transparent bg, gold border and text)

## Files Changed

- `style.css` — two new rules
- `about.html` — connect-section (both lang blocks) + consulting-cta (both lang blocks) + footer
- `index.html` — footer only
- `projects.html` — footer only
