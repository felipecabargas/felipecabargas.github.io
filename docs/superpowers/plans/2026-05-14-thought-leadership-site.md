# Thought Leadership Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace felipecabargas.github.io with a minimal thought leadership site featuring a writing list, article pages, about page, and projects page — all in static HTML/CSS.

**Architecture:** Pure static HTML + CSS + minimal vanilla JS. No build step, no framework. One shared `style.css` at the root, root-relative asset paths throughout. Article pages live in `articles/`. GitHub Pages serves `about.html` at `/about`, `projects.html` at `/projects`, etc.

**Tech Stack:** HTML5, CSS3, vanilla JS (ES6), GitHub Pages

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `style.css` | Replace | All shared styles — design tokens, nav, article list, article page, about, projects, footer |
| `index.html` | Replace | Homepage: tagline, filter tabs (JS), article list |
| `about.html` | Replace | About page: avatar intro, bio, topic pills, connect links |
| `projects.html` | Create | Projects page: Gambit + Parcel Tracking MCP cards |
| `articles/_template-essay.html` | Create | Essay template: copy this to write a new essay |
| `articles/_template-note.html` | Create | Note template: copy this to write a new note |

> **Note:** `da/` and `es/` pages inherit `style.css`. Their layouts differ from the new design — update them separately or leave as-is; they won't break, just look different.

---

## Task 1: Shared Stylesheet

**Files:**
- Modify: `style.css` (full replacement)

- [ ] **Step 1: Replace style.css**

```css
/* ── RESET ── */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #fafaf8;
  color: #111;
  line-height: 1.6;
  min-height: 100vh;
}

/* ── NAV ── */
.site-nav {
  max-width: 680px;
  margin: 0 auto;
  padding: 28px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e0;
}
.site-name {
  font-size: 15px;
  font-weight: 700;
  color: #001d39;
  letter-spacing: -0.3px;
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 13px;
}
.nav-links a { color: #555; text-decoration: none; }
.nav-links a:hover { color: #001d39; }
.nav-active { color: #001d39 !important; font-weight: 600; }
.consulting-link {
  color: #001d39 !important;
  font-weight: 600;
  border-bottom: 2px solid #E4C441;
  padding-bottom: 1px;
}
.back-link { font-size: 12px; color: #999; }

/* ── PAGE WRAPPER ── */
.page {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
.page-header { margin-bottom: 40px; padding-top: 48px; }
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #001d39;
  letter-spacing: -0.4px;
  margin-bottom: 8px;
}
.page-desc { font-size: 14px; color: #888; line-height: 1.6; }

/* ── SHARED CTA ── */
.consulting-cta {
  padding: 20px 24px;
  background: #001d39;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 48px;
}
.cta-text { color: #cdd8e3; font-size: 13px; line-height: 1.5; }
.cta-text strong { color: #fff; display: block; font-size: 14px; margin-bottom: 3px; }
.cta-btn {
  background: #E4C441;
  color: #001d39;
  font-size: 12px;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 4px;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
}

/* ── FOOTER ── */
.site-footer {
  max-width: 680px;
  margin: 40px auto 0;
  padding: 20px 24px;
  border-top: 1px solid #e8e8e0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #bbb;
}
.social-links { display: flex; gap: 12px; }
.social-links a { color: #bbb; text-decoration: none; }
.social-links a:hover { color: #001d39; }

/* ── HOMEPAGE: TAGLINE + FILTERS ── */
.tagline {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin: 32px 0 28px;
}
.filter-tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e0;
  margin-bottom: 28px;
  overflow-x: auto;
}
.tab {
  font-size: 11px;
  font-weight: 700;
  color: #999;
  padding: 8px 0;
  margin-right: 18px;
  margin-bottom: -1px;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  cursor: pointer;
}
.tab.active { color: #001d39; border-bottom-color: #E4C441; }
.tab:hover:not(.active) { color: #555; }

/* ── HOMEPAGE: ARTICLE LIST ── */
.article-list { display: flex; flex-direction: column; }
.article-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid #f0ede8;
  gap: 16px;
}
.article-item:last-child { border-bottom: none; }
.article-item.hidden { display: none; }
.article-left { flex: 1; }
.article-title {
  font-size: 15px;
  font-weight: 600;
  color: #001d39;
  line-height: 1.4;
  margin-bottom: 5px;
  display: block;
  text-decoration: none;
}
.article-title:hover { color: #003d73; }
.article-excerpt { font-size: 12px; color: #888; line-height: 1.5; }
.article-tags { display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
.article-tag {
  font-size: 10px;
  color: #999;
  background: #f0ede8;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}
.article-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.article-type {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
}
.type-essay { background: #001d39; color: #fff; }
.type-note { background: #E4C441; color: #001d39; }
.article-date { font-size: 11px; color: #bbb; }

/* ── ARTICLE PAGE ── */
.article { padding: 48px 0 80px; }
.article-header { margin-bottom: 40px; }
.article-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.article-readtime { font-size: 12px; color: #bbb; }
.dot-sep { color: #ddd; }
h1.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #001d39;
  line-height: 1.25;
  letter-spacing: -0.5px;
  margin-bottom: 14px;
}
.article-topic-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.article-topic-tag {
  font-size: 10px;
  color: #999;
  background: #f0ede8;
  padding: 2px 7px;
  border-radius: 3px;
  font-weight: 500;
}
.article-body { font-size: 16px; line-height: 1.8; color: #333; }
.article-body p { margin-bottom: 20px; }
.article-body p:last-child { margin-bottom: 0; }
.article-body strong { color: #111; }
.article-body h2 {
  font-size: 19px;
  color: #001d39;
  margin: 36px 0 14px;
  letter-spacing: -0.3px;
}
.article-body blockquote {
  border-left: 3px solid #E4C441;
  padding-left: 18px;
  color: #555;
  font-style: italic;
  margin: 28px 0;
}
.article-divider { border: none; border-top: 1px solid #e8e8e0; margin: 48px 0; }
.share-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #bbb;
  margin-bottom: 12px;
}
.share-links { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
.share-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 4px;
  text-decoration: none;
  border: 1px solid #e0ddd8;
  color: #444;
  background: #fff;
}
.share-btn:hover { border-color: #001d39; color: #001d39; }
.author-bio {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #f5f2ed;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 32px;
}
.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #001d39;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E4C441;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.author-info { flex: 1; }
.author-name { font-size: 13px; font-weight: 700; color: #001d39; margin-bottom: 4px; }
.author-desc { font-size: 12px; color: #666; line-height: 1.6; }
.note-banner {
  background: #fffdf0;
  border-left: 3px solid #E4C441;
  padding: 12px 16px;
  margin-bottom: 32px;
  font-size: 12px;
  color: #888;
  border-radius: 0 4px 4px 0;
}
.note-banner a { color: #001d39; }

/* ── ABOUT PAGE ── */
.intro { display: flex; gap: 28px; align-items: flex-start; margin-bottom: 44px; padding-top: 48px; }
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #001d39;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E4C441;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}
.intro-text { flex: 1; }
.intro-name { font-size: 22px; font-weight: 700; color: #001d39; letter-spacing: -0.4px; margin-bottom: 4px; }
.intro-role { font-size: 13px; color: #999; margin-bottom: 14px; }
.intro-bio { font-size: 15px; color: #333; line-height: 1.75; }
.section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #bbb;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e0;
}
.topics { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
.topic-pill {
  font-size: 13px;
  font-weight: 600;
  color: #001d39;
  background: #f0ede8;
  border-radius: 20px;
  padding: 6px 14px;
}
.bio-section { margin-bottom: 44px; }
.bio-text { font-size: 15px; color: #444; line-height: 1.8; }
.bio-text p { margin-bottom: 18px; }
.bio-text p:last-child { margin-bottom: 0; }
.bio-text a { color: #001d39; font-weight: 600; border-bottom: 1px solid #E4C441; text-decoration: none; }
.connect-section { margin-bottom: 44px; }
.connect-links { display: flex; gap: 10px; flex-wrap: wrap; }
.connect-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  border: 1px solid #e0ddd8;
  color: #444;
  background: #fff;
}
.connect-btn:hover { border-color: #001d39; color: #001d39; }

/* ── PROJECTS PAGE ── */
.project-list { display: flex; flex-direction: column; gap: 20px; }
.project-card {
  background: #fff;
  border: 1px solid #e8e8e0;
  border-radius: 8px;
  padding: 24px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.project-card:hover {
  border-color: #001d39;
  box-shadow: 0 2px 12px rgba(0,29,57,0.07);
}
.project-card.placeholder {
  background: #fafaf8;
  border-style: dashed;
}
.project-card.placeholder .project-name { color: #bbb; }
.project-card.placeholder .project-desc { color: #ccc; }
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 10px;
}
.project-name { font-size: 17px; font-weight: 700; color: #001d39; letter-spacing: -0.3px; }
.project-status {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  flex-shrink: 0;
  background: #E4C441;
  color: #001d39;
}
.project-status.wip { background: #f0ede8; color: #888; }
.project-desc { font-size: 14px; color: #555; line-height: 1.65; margin-bottom: 16px; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.project-tag {
  font-size: 11px;
  color: #666;
  background: #f5f2ed;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
}
.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f0ede8;
}
.project-link {
  font-size: 12px;
  font-weight: 600;
  color: #001d39;
  text-decoration: none;
  border-bottom: 1px solid #E4C441;
  padding-bottom: 1px;
}
.project-link:hover { color: #003d73; }
.project-meta { font-size: 11px; color: #bbb; }
```

- [ ] **Step 2: Verify — open in browser**

```bash
open index.html
```

Expected: page renders with warm off-white background, no broken styles. (index.html still has old content — that's fine, we're checking the stylesheet loads without errors.)

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: replace stylesheet with thought leadership design system"
```

---

## Task 2: Homepage

**Files:**
- Modify: `index.html` (full replacement)

- [ ] **Step 1: Replace index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Felipe Cabargas</title>
  <meta name="description" content="Thinking out loud on product, AI, and what it means to build responsibly.">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/" class="nav-active">Writing</a>
    <a href="/projects">Projects</a>
    <a href="/about">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
  </div>
</nav>

<main class="page">
  <p class="tagline">Thinking out loud on product, AI, and what it means to build responsibly.</p>

  <div class="filter-tabs" role="tablist">
    <button class="tab active" onclick="filterArticles('all', this)">All</button>
    <button class="tab" onclick="filterArticles('ai', this)">AI</button>
    <button class="tab" onclick="filterArticles('product', this)">Product</button>
    <button class="tab" onclick="filterArticles('governance', this)">Governance</button>
    <button class="tab" onclick="filterArticles('startups', this)">Startups</button>
    <button class="tab" onclick="filterArticles('policy', this)">Policy</button>
  </div>

  <div class="article-list">
    <!-- Add new articles here, newest first. data-topics is space-separated lowercase. -->

    <!-- EXAMPLE — replace with your first real article -->
    <div class="article-item" data-topics="ai governance">
      <div class="article-left">
        <a class="article-title" href="/articles/the-ai-governance-gap">The AI Governance Gap No One Is Talking About</a>
        <div class="article-excerpt">Why most companies are optimizing for compliance theater instead of actual risk reduction.</div>
        <div class="article-tags">
          <span class="article-tag">AI</span>
          <span class="article-tag">Governance</span>
        </div>
      </div>
      <div class="article-meta">
        <span class="article-type type-essay">Essay</span>
        <span class="article-date">May 2026</span>
      </div>
    </div>

  </div>

  <div class="consulting-cta">
    <div class="cta-text">
      <strong>Need a strategy, not just an opinion?</strong>
      I work with startups on product, AI readiness, and governance.
    </div>
    <a class="cta-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">Work with me ↗</a>
  </div>
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

<script>
  function filterArticles(topic, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.article-item').forEach(item => {
      const topics = (item.dataset.topics || '').split(' ');
      item.classList.toggle('hidden', topic !== 'all' && !topics.includes(topic));
    });
  }
</script>

</body>
</html>
```

- [ ] **Step 2: Verify — open in browser**

```bash
open index.html
```

Check:
- Nav renders: Writing (bold/active) · Projects · About · Consulting↗ (gold underline)
- Tagline appears in grey below nav
- Filter tabs render: All (active, gold underline) · AI · Product · Governance · Startups · Policy
- Article list shows the example row with navy Essay badge
- Dark navy CTA block at bottom with gold button
- Footer: copyright left, LinkedIn + GitHub right
- Click "AI" tab → article stays visible. Click "Product" → article hides. Click "All" → article reappears.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace homepage with thought leadership writing list"
```

---

## Task 3: About Page

**Files:**
- Modify: `about.html` (full replacement)

- [ ] **Step 1: Replace about.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — Felipe Cabargas</title>
  <meta name="description" content="Product professional writing about building things responsibly — from startup foundations to enterprise-scale platforms.">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/">Writing</a>
    <a href="/projects">Projects</a>
    <a href="/about" class="nav-active">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
  </div>
</nav>

<main class="page">
  <div class="intro">
    <div class="avatar" aria-hidden="true">FC</div>
    <div class="intro-text">
      <div class="intro-name">Felipe Cabargas</div>
      <div class="intro-role">Product · AI · Governance · Santiago &amp; Copenhagen</div>
      <div class="intro-bio">I'm a product professional who writes about building things responsibly — from startup foundations to enterprise-scale platforms serving millions.</div>
    </div>
  </div>

  <div class="section-title">What I write about</div>
  <div class="topics">
    <span class="topic-pill">AI</span>
    <span class="topic-pill">Product</span>
    <span class="topic-pill">Governance</span>
    <span class="topic-pill">Startups</span>
    <span class="topic-pill">Policy</span>
  </div>

  <div class="bio-section">
    <div class="section-title">A bit more</div>
    <div class="bio-text">
      <p>I've spent my career building and scaling digital products — most recently at the enterprise level, where "launch fast" gives way to "serve reliably at scale." I know what it takes to grow a product from early traction to the kind of infrastructure that handles complex, high-stakes markets: the technical debt you have to pay, the governance you can't skip, and the organizational work that no roadmap captures.</p>
      <p>My background spans Chile and Denmark — two markets with very different risk appetites, regulatory environments, and definitions of done. That cross-market experience shapes how I think about AI adoption, compliance, and the kind of product strategy that holds up when the stakes get real and the user base gets large.</p>
      <p>This site is where I think out loud. Some pieces are long essays working through a thorny problem. Others are short notes — quick takes on something I've observed. The common thread is a belief that the best builders are also clear thinkers. If something sparks a question or you disagree with me, I'd love to hear from you. And if you need more than an opinion — <a href="https://cabargas.consulting" target="_blank" rel="noopener">I consult too</a>.</p>
    </div>
  </div>

  <div class="connect-section">
    <div class="section-title">Find me elsewhere</div>
    <div class="connect-links">
      <a class="connect-btn" href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
      <a class="connect-btn" href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
      <a class="connect-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">cabargas.consulting ↗</a>
    </div>
  </div>

  <div class="consulting-cta">
    <div class="cta-text">
      <strong>Need a strategy, not just an opinion?</strong>
      I work with startups on product, AI readiness, and governance.
    </div>
    <a class="cta-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">Work with me ↗</a>
  </div>
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify — open in browser**

```bash
open about.html
```

Check:
- FC avatar (navy circle, gold initials) left of name/role/bio intro
- Topic pills: AI · Product · Governance · Startups · Policy in warm-grey rounded pills
- Three bio paragraphs render with readable spacing
- LinkedIn / GitHub / cabargas.consulting buttons render as bordered pills
- Dark navy CTA block at bottom
- "About" is bold/active in nav

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: replace about page with thought leadership bio"
```

---

## Task 4: Projects Page

**Files:**
- Create: `projects.html`

- [ ] **Step 1: Create projects.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects — Felipe Cabargas</title>
  <meta name="description" content="Open-source tools and experiments at the intersection of product and AI.">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/">Writing</a>
    <a href="/projects" class="nav-active">Projects</a>
    <a href="/about">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
  </div>
</nav>

<main class="page">
  <div class="page-header">
    <h1 class="page-title">Projects</h1>
    <p class="page-desc">Things I've built — tools, experiments, and open-source work at the intersection of product and AI.</p>
  </div>

  <div class="project-list">

    <div class="project-card">
      <div class="project-header">
        <div class="project-name">Gambit</div>
        <span class="project-status">Active</span>
      </div>
      <p class="project-desc">A collection of PM skills and workflow agents for Claude and Gemini — covering the full product lifecycle from user research to stakeholder comms. Gambit turns AI assistants into opinionated PM collaborators: write feature requests, run sprint reviews, generate OKRs, build roadmaps, and synthesize user research, all through structured, reusable skills.</p>
      <div class="project-tags">
        <span class="project-tag">AI Agents</span>
        <span class="project-tag">Product Management</span>
        <span class="project-tag">Claude</span>
        <span class="project-tag">Gemini</span>
        <span class="project-tag">Open Source</span>
      </div>
      <div class="project-footer">
        <a class="project-link" href="https://github.com/felipecabargas/gambit" target="_blank" rel="noopener">View on GitHub ↗</a>
        <span class="project-meta">github.com/felipecabargas/gambit</span>
      </div>
    </div>

    <div class="project-card">
      <div class="project-header">
        <div class="project-name">Parcel Tracking MCP</div>
        <span class="project-status">Active</span>
      </div>
      <p class="project-desc">An MCP server for worldwide parcel tracking via the 17track API. Works with Claude and any MCP-compatible AI assistant — lets you track shipments directly from your AI chat without leaving the conversation.</p>
      <div class="project-tags">
        <span class="project-tag">MCP</span>
        <span class="project-tag">Claude</span>
        <span class="project-tag">API Integration</span>
        <span class="project-tag">Open Source</span>
      </div>
      <div class="project-footer">
        <a class="project-link" href="https://github.com/felipecabargas/parcel-tracking-mcp" target="_blank" rel="noopener">View on GitHub ↗</a>
        <span class="project-meta">github.com/felipecabargas/parcel-tracking-mcp</span>
      </div>
    </div>

    <div class="project-card placeholder">
      <div class="project-header">
        <div class="project-name">More coming soon</div>
        <span class="project-status wip">WIP</span>
      </div>
      <p class="project-desc">More projects will appear here as I build and open-source them.</p>
    </div>

  </div>
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify — open in browser**

```bash
open projects.html
```

Check:
- "Projects" is bold/active in nav
- Two project cards: Gambit + Parcel Tracking MCP, each with gold "Active" badge
- Hover over a card → navy border + subtle shadow appears
- "View on GitHub ↗" links are underlined with gold
- Placeholder card at bottom has dashed border, grey text
- No consulting CTA block on this page (projects page doesn't need it — the nav link is enough)

- [ ] **Step 3: Commit**

```bash
git add projects.html
git commit -m "feat: add projects page with Gambit and Parcel Tracking MCP"
```

---

## Task 5: Article Templates

**Files:**
- Create: `articles/_template-essay.html`
- Create: `articles/_template-note.html`

These are the templates to copy when writing a new article. The filename becomes the URL slug.

- [ ] **Step 1: Create articles/ directory and essay template**

```bash
mkdir -p articles
```

```html
<!-- articles/_template-essay.html -->
<!-- USAGE: copy this file, rename to your-slug.html, fill in content -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ARTICLE TITLE — Felipe Cabargas</title>
  <meta name="description" content="ARTICLE DESCRIPTION (1-2 sentences for SEO/social)">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/" class="back-link">← All writing</a>
    <a href="/about">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
  </div>
</nav>

<main class="page">
  <article class="article">
    <header class="article-header">
      <div class="article-eyebrow">
        <span class="article-type type-essay">Essay</span>
        <span class="article-date">Month YYYY</span>
        <span class="dot-sep">·</span>
        <span class="article-readtime">X min read</span>
      </div>
      <h1 class="article-title">ARTICLE TITLE</h1>
      <div class="article-topic-tags">
        <!-- Add tags matching your filter topics: AI, Product, Governance, Startups, Policy -->
        <span class="article-topic-tag">AI</span>
      </div>
    </header>

    <div class="article-body">
      <p>Opening paragraph.</p>

      <blockquote>
        A key insight or quote worth pulling out.
      </blockquote>

      <h2>Section heading</h2>
      <p>Body content. Use <strong>bold</strong> for emphasis.</p>

      <p>More paragraphs as needed.</p>
    </div>

    <hr class="article-divider">

    <div class="share-label">Share this essay</div>
    <div class="share-links">
      <!-- Replace YOUR-SLUG and YOUR-TITLE in the URLs below -->
      <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=https://felipecabargas.github.io/articles/YOUR-SLUG" target="_blank" rel="noopener">Share on LinkedIn</a>
      <a class="share-btn" href="https://twitter.com/intent/tweet?url=https://felipecabargas.github.io/articles/YOUR-SLUG&text=YOUR-TITLE" target="_blank" rel="noopener">Share on X</a>
      <a class="share-btn" href="#" onclick="navigator.clipboard.writeText(location.href); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy link',2000); return false;">Copy link</a>
    </div>

    <div class="author-bio">
      <div class="author-avatar" aria-hidden="true">FC</div>
      <div class="author-info">
        <div class="author-name">Felipe Cabargas</div>
        <div class="author-desc">Product professional with 10+ years driving growth, compliance, and AI strategy. Based between Santiago and Copenhagen.</div>
      </div>
    </div>

    <div class="consulting-cta">
      <div class="cta-text">
        <strong>Need a strategy, not just an opinion?</strong>
        I work with startups on product, AI readiness, and governance.
      </div>
      <a class="cta-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">Work with me ↗</a>
    </div>
  </article>
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Create note template**

```html
<!-- articles/_template-note.html -->
<!-- USAGE: copy this file, rename to your-slug.html, fill in content -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NOTE TITLE — Felipe Cabargas</title>
  <meta name="description" content="NOTE DESCRIPTION">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/" class="back-link">← All writing</a>
    <a href="/about">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
  </div>
</nav>

<main class="page">
  <article class="article">
    <header class="article-header">
      <div class="article-eyebrow">
        <span class="article-type type-note">Note</span>
        <span class="article-date">Month YYYY</span>
        <span class="dot-sep">·</span>
        <span class="article-readtime">X min read</span>
      </div>
      <h1 class="article-title">NOTE TITLE</h1>
      <div class="article-topic-tags">
        <span class="article-topic-tag">Product</span>
      </div>
    </header>

    <div class="note-banner">
      This is a <strong>note</strong> — a shorter, quicker take. <a href="/">Essays</a> go deeper.
    </div>

    <div class="article-body">
      <p>Opening thought.</p>
      <p>More content. Notes are typically 200–500 words.</p>
    </div>

    <hr class="article-divider">

    <div class="share-label">Share this note</div>
    <div class="share-links">
      <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=https://felipecabargas.github.io/articles/YOUR-SLUG" target="_blank" rel="noopener">Share on LinkedIn</a>
      <a class="share-btn" href="https://twitter.com/intent/tweet?url=https://felipecabargas.github.io/articles/YOUR-SLUG&text=YOUR-TITLE" target="_blank" rel="noopener">Share on X</a>
      <a class="share-btn" href="#" onclick="navigator.clipboard.writeText(location.href); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy link',2000); return false;">Copy link</a>
    </div>

    <div class="author-bio">
      <div class="author-avatar" aria-hidden="true">FC</div>
      <div class="author-info">
        <div class="author-name">Felipe Cabargas</div>
        <div class="author-desc">Product professional with 10+ years driving growth, compliance, and AI strategy. Based between Santiago and Copenhagen.</div>
      </div>
    </div>

    <div class="consulting-cta">
      <div class="cta-text">
        <strong>Need a strategy, not just an opinion?</strong>
        I work with startups on product, AI readiness, and governance.
      </div>
      <a class="cta-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">Work with me ↗</a>
    </div>
  </article>
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/felipecabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 3: Verify both templates in browser**

```bash
open articles/_template-essay.html
open articles/_template-note.html
```

Essay check:
- Navy "Essay" badge, date, read time in eyebrow row
- Large navy h1 title
- Topic tag pill below title
- Body text: 16px, line-height 1.8, blockquote with gold left border
- Share buttons row (LinkedIn · X · Copy link)
- FC avatar bio card
- Dark navy CTA block

Note check:
- Gold "Note" badge in eyebrow
- Gold-bordered banner: "This is a note — a shorter, quicker take."
- No blockquote or h2 section headings (notes are flat prose)
- Same share + bio + CTA at bottom

- [ ] **Step 4: Commit**

```bash
git add articles/
git commit -m "feat: add essay and note article templates"
```

---

## Adding a New Article (reference)

When you write a new article:

1. Copy `articles/_template-essay.html` or `articles/_template-note.html`
2. Rename: `articles/your-article-slug.html`
3. Fill in title, date, read time, topic tags, and body
4. Update share URLs: replace `YOUR-SLUG` and `YOUR-TITLE`
5. Add a row to the article list in `index.html`:

```html
<div class="article-item" data-topics="ai product">
  <div class="article-left">
    <a class="article-title" href="/articles/your-article-slug">Your Article Title</a>
    <div class="article-excerpt">One sentence that makes someone want to click.</div>
    <div class="article-tags">
      <span class="article-tag">AI</span>
      <span class="article-tag">Product</span>
    </div>
  </div>
  <div class="article-meta">
    <span class="article-type type-essay">Essay</span>  <!-- or type-note -->
    <span class="article-date">May 2026</span>
  </div>
</div>
```

`data-topics` drives the filter tabs — use lowercase, space-separated: `ai`, `product`, `governance`, `startups`, `policy`.
