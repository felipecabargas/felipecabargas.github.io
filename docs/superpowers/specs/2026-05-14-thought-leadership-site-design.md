# Thought Leadership Site — Design Spec
**Date:** 2026-05-14
**Project:** felipecabargas.github.io
**Author:** Felipe Cabargas

---

## Overview

Replace the current consulting-focused felipecabargas.github.io with a thought leadership writing site. The site centers Felipe's writing on product, AI, and governance, with a clear link to cabargas.consulting for consulting inquiries.

---

## Goals

- Establish a home for long-form essays and shorter notes on product, AI, governance, startups, and policy
- Drive social sharing (LinkedIn, X) and consulting inquiries as primary outcomes
- Serve a broad, intelligent professional audience — not a single niche persona
- Link clearly to cabargas.consulting without making the site feel like a consulting pitch

---

## Non-Goals

- Newsletter/email list (not in scope)
- Multilingual content (English only at launch)
- CMS or dynamic backend (static HTML, same as current site)

---

## Pages

### 1. Homepage (`/`)

**Purpose:** Surface writing, establish identity, funnel readers to consulting.

**Layout:**
- Nav: `Felipe Cabargas` (left, links home) | `About` · `Projects` · `Consulting ↗` (right, gold underline on consulting link)
- Tagline: *"Thinking out loud on product, AI, and what it means to build responsibly."*
- Filter tabs: All / AI / Product / Governance / Startups / Policy
- Article list: chronological, each row shows title + one-line excerpt (left) and type badge + date (right)
  - Essays: navy badge (`#001d39` bg, white text)
  - Notes: gold badge (`#E4C441` bg, navy text)
  - Inline topic tags below excerpt (warm grey pills)
- Consulting CTA block: dark navy (`#001d39`), "Need a strategy, not just an opinion?" + "Work with me ↗" gold button
- Footer: © + LinkedIn / GitHub links

---

### 2. Article Page (`/<slug>`)

**Purpose:** Reading experience for essays and notes.

**Layout:**
- Same nav + `← All writing` back link added in nav
- Article header: type badge + date + read time · title (28px, navy, tight tracking) · topic tags
- **Essay body:** section headings (`h2`), blockquotes (gold left border), generous spacing, 16px / 1.8 line-height
- **Note body:** same shell, preceded by a small gold-bordered banner: *"This is a note — a shorter, quicker take."*
- Post-article: horizontal rule → share buttons (LinkedIn / X / Copy link) → author bio card (avatar initials + 2-line bio) → consulting CTA block (same as homepage)

---

### 3. About (`/about`)

**Purpose:** Context on who Felipe is and why his perspective matters.

**Layout:**
- Avatar (FC initials, navy circle) + name + role line + one-sentence intro
- **What I write about:** topic pills (AI, Product, Governance, Startups, Policy)
- **A bit more:** 3-paragraph bio
  - Para 1: Enterprise-scale product experience — scaling digital platforms for complex, high-stakes markets
  - Para 2: Chile + Denmark cross-market lens — regulatory awareness, different risk appetites
  - Para 3: What this site is, invitation to engage, consulting bridge
- **Find me elsewhere:** LinkedIn / GitHub / cabargas.consulting ↗ as equal buttons
- Consulting CTA block
- Footer

---

### 4. Projects (`/projects`)

**Purpose:** Showcase open-source tools and experiments.

**Layout:**
- Page title + one-line description
- Project cards (white, 1px border, hover: navy border + subtle shadow):
  - Project name + status badge (Active = gold/navy; WIP = grey)
  - Description paragraph
  - Topic tags
  - Footer row: "View on GitHub ↗" link + repo path

**Initial projects:**
1. **Gambit** — PM skills and workflow agents for Claude/Gemini. Covers the full product lifecycle: feature requests, sprint reviews, OKRs, roadmaps, user research synthesis. Active.
2. **Parcel Tracking MCP** — MCP server for worldwide parcel tracking via 17track API. Works with Claude and any MCP-compatible AI. Active.

---

## Visual Design

| Token | Value |
|---|---|
| Background | `#fafaf8` (warm off-white) |
| Primary text | `#111` |
| Navy (brand) | `#001d39` |
| Gold (accent) | `#E4C441` |
| Muted text | `#888` / `#bbb` |
| Border | `#e8e8e0` / `#f0ede8` |
| Font | `system-ui, -apple-system, sans-serif` |
| Body size | 16px / 1.8 line-height |
| Max content width | 680px centered |

**Design principles:**
- Warm off-white base — not stark white, not grey
- Navy and gold used sparingly as accents, not fills
- No hero images, no heavy graphics — typography-led
- Consulting link always visible in nav, gold underline to distinguish it

---

## Navigation (all pages)

```
Felipe Cabargas    Writing  Projects  About  Consulting ↗
```

- `Felipe Cabargas` (left) — always links to homepage
- `Writing`, `Projects`, `About` — active state on their respective page
- On article pages, add `← All writing` before the right-side links
- `Consulting ↗` links to cabargas.consulting, opens in new tab
- All five elements present on every page for consistency

---

## Social & Sharing

- **Footer social links:** LinkedIn, GitHub
- **Article share buttons:** LinkedIn, X (Twitter), Copy link
- No newsletter CTA

---

## Tech Stack

- Static HTML + CSS (no framework, matches current site)
- Hosted on GitHub Pages (felipecabargas.github.io)
- No JavaScript required except for filter tab interaction on homepage
- `.gitignore` should include `.superpowers/`

---

## Out of Scope (future)

- Search
- RSS feed
- Dark mode
- Comments
- Analytics (can be added independently)
