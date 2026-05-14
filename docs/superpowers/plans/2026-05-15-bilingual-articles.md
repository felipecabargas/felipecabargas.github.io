# Bilingual Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Spanish/English bilingual support to article pages using a `_articles/<slug>/en.md` + `es.md` directory structure, single HTML output per article, `?lang=es` query param switching, and browser language auto-detection.

**Architecture:** Each article slug becomes a directory containing `en.md` (required) and optionally `es.md`. The build script generates a single HTML file per article with both language blocks embedded; vanilla JS handles showing the correct block based on `?lang=` param or `navigator.language`. No translation API — Spanish files are written directly by Claude or the author.

**Tech Stack:** Node.js build script (existing), `gray-matter`, `marked`, vanilla JS, static HTML/CSS on GitHub Pages.

---

## File Map

| File | Change |
|---|---|
| `_articles/<slug>/en.md` | New structure — migrate all 5 existing flat `.md` files |
| `scripts/build.js` | Major update: read directories, generate bilingual HTML |
| `style.css` | Add: `.lang-switcher`, `.lang-btn`, `.lang-badge`, `.translation-notice` |

---

### Task 1: Migrate articles to directory structure

**Files:**
- Create: `_articles/efficiency-paradox/en.md`
- Create: `_articles/chile-data-privacy-law-2026/en.md`
- Create: `_articles/product-teams-losing-the-ai-race/en.md`
- Create: `_articles/feature-saas-vs-smart-saas/en.md`
- Create: `_articles/the-hate-on-vibe-coding/en.md`
- Delete: all 5 flat `_articles/*.md` files
- Modify: `scripts/build.js` — update reader + `buildPageHTML` signature

**Context:** The site currently has 5 flat markdown files at `_articles/<slug>.md`. After this task they live at `_articles/<slug>/en.md`. The build output must be byte-for-byte equivalent — no visible changes to the site. The `buildPageHTML` signature changes from `(frontmatter, bodyHTML)` to `(slug, enData, esData)` where `esData` is always `null` after this task.

- [ ] **Step 1: Create directories and move files**

```bash
cd /path/to/repo
for slug in efficiency-paradox chile-data-privacy-law-2026 product-teams-losing-the-ai-race feature-saas-vs-smart-saas the-hate-on-vibe-coding; do
  mkdir -p _articles/$slug
  mv _articles/$slug.md _articles/$slug/en.md
done
```

Verify:
```bash
find _articles -name "*.md"
# Expected:
# _articles/efficiency-paradox/en.md
# _articles/chile-data-privacy-law-2026/en.md
# _articles/product-teams-losing-the-ai-race/en.md
# _articles/feature-saas-vs-smart-saas/en.md
# _articles/the-hate-on-vibe-coding/en.md
```

- [ ] **Step 2: Add `readLang` helper to `scripts/build.js`**

Add this function after the `escapeXML` function (around line 56):

```javascript
function readLang(slugDir, lang) {
  const fp = path.join(slugDir, `${lang}.md`);
  if (!fs.existsSync(fp)) return null;
  const { data: frontmatter, content } = matter(fs.readFileSync(fp, 'utf8'));
  return { frontmatter, bodyHTML: marked(content) };
}
```

- [ ] **Step 3: Update `buildPageHTML` signature in `scripts/build.js`**

The function currently starts:
```javascript
function buildPageHTML(frontmatter, bodyHTML) {
  const { title, date, readtime, tags = [], slug, excerpt, type } = frontmatter;
  const isNote = type === 'note';
  const articleUrl = `${SITE_URL}/articles/${slug}`;
```

Replace the signature and destructuring to accept the new shape (keep the body identical for now — `esData` is ignored until Task 2):

```javascript
function buildPageHTML(slug, enData, esData) {
  const { frontmatter, bodyHTML } = enData;
  const { title, date, readtime, tags = [], excerpt, type } = frontmatter;
  const isNote = type === 'note';
  const articleUrl = `${SITE_URL}/articles/${slug}`;
```

- [ ] **Step 4: Update `main()` in `scripts/build.js` to read directories**

Replace the block that starts `const files = fs.readdirSync(ARTICLES_SRC)...` and the for loop with:

```javascript
  const slugs = fs.readdirSync(ARTICLES_SRC, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  if (slugs.length === 0) {
    console.log('No article directories in _articles/ — nothing to build.');
    return;
  }

  for (const slug of slugs) {
    const slugDir = path.join(ARTICLES_SRC, slug);
    const en = readLang(slugDir, 'en');

    if (!en) {
      console.error(`Skipping ${slug}: missing en.md`);
      continue;
    }

    en.frontmatter.slug = slug;
    en.frontmatter.topics = en.frontmatter.topics || [];
    en.frontmatter.tags = en.frontmatter.tags || [];

    const required = ['title', 'date', 'type', 'excerpt'];
    const missing = required.filter(k => !en.frontmatter[k]);
    if (missing.length > 0) {
      console.error(`Skipping ${slug}: missing required frontmatter fields: ${missing.join(', ')}`);
      continue;
    }

    if (!en.frontmatter.sortDate) {
      console.warn(`Warning: ${slug} has no sortDate — article may sort incorrectly.`);
    }

    const pageHTML = buildPageHTML(slug, en, null);
    const outFile = path.join(ARTICLES_OUT, `${slug}.html`);
    fs.writeFileSync(outFile, pageHTML);
    console.log(`Built: articles/${slug}.html`);

    articles.push({ frontmatter: en.frontmatter, hasEs: false });
  }
```

Also update the `articles.sort` call — it uses `a.frontmatter.sortDate` which is unchanged — and `updateIndex` which uses `a.frontmatter` — also unchanged. No edits needed there.

- [ ] **Step 5: Run build and verify output is identical**

```bash
npm run build
```

Expected output:
```
Built: articles/chile-data-privacy-law-2026.html
Built: articles/efficiency-paradox.html
Built: articles/feature-saas-vs-smart-saas.html
Built: articles/product-teams-losing-the-ai-race.html
Built: articles/the-hate-on-vibe-coding.html
Updated index.html article list.
Generated feed.xml
```

Open `articles/efficiency-paradox.html` and verify it renders correctly — title, body, share buttons, footer all present.

- [ ] **Step 6: Commit**

```bash
git add _articles/ scripts/build.js articles/ index.html feed.xml
git commit -m "refactor: migrate articles to directory structure (_articles/<slug>/en.md)"
```

---

### Task 2: Bilingual HTML generation, language switching, and CSS

**Files:**
- Modify: `scripts/build.js` — add `buildArticleContent()`, rewrite `buildPageHTML()` for bilingual, update `buildArticleItem()` for ES badge
- Modify: `style.css` — add `.lang-switcher`, `.lang-btn`, `.lang-badge`, `.translation-notice`

**Context:** After Task 1, `buildPageHTML(slug, enData, null)` produces single-language HTML. This task makes it produce bilingual HTML when `esData` is provided, with a language switcher in the nav, language detection JS, and a translation notice. When `esData` is null the output is identical to before (switcher hidden, no ES block). The homepage gets an `ES` badge on articles that have a Spanish version. A new `originalLang` frontmatter field (optional, defaults to `'en'`) controls which version is labeled as AI-translated.

- [ ] **Step 1: Add `buildArticleContent()` to `scripts/build.js`**

Add this function just before `buildPageHTML`. It generates the inner content for one language block (article header, body, share buttons, author bio, CTA):

```javascript
function buildArticleContent(slug, frontmatter, bodyHTML, lang, originalLang) {
  const { title, date, readtime, tags = [], excerpt, type } = frontmatter;
  const isNote = type === 'note';
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const typeClass = isNote ? 'type-note' : 'type-essay';
  const typeLabel = isNote ? (lang === 'es' ? 'Nota' : 'Note') : (lang === 'es' ? 'Ensayo' : 'Essay');
  const shareLabel = isNote
    ? (lang === 'es' ? 'Compartir esta nota' : 'Share this note')
    : (lang === 'es' ? 'Compartir este ensayo' : 'Share this essay');
  const tagPills = tags.map(t => `<span class="article-topic-tag">${escapeAttr(t)}</span>`).join('\n        ');
  const noteBanner = isNote ? `
    <div class="note-banner">
      ${lang === 'es'
        ? 'Esta es una <strong>nota</strong> — una reflexión breve. Los <a href="/">ensayos</a> son más extensos.'
        : 'This is a <strong>note</strong> — a shorter, quicker take. <a href="/">Essays</a> go deeper.'
      }
    </div>` : '';

  const isTranslation = lang !== originalLang;
  const translationNotice = isTranslation ? `
    <div class="translation-notice">
      ${lang === 'es'
        ? 'Escrito originalmente en inglés. Traducción al español por IA.'
        : 'Originally written in Spanish. English translation by AI.'
      }
    </div>` : '';

  return `
  <article class="article">
    <header class="article-header">
      <div class="article-eyebrow">
        <span class="article-type ${typeClass}">${typeLabel}</span>
        <span class="article-date">${escapeAttr(date)}</span>
        <span class="dot-sep">·</span>
        <span class="article-readtime">${escapeAttr(readtime)}</span>
      </div>
      <h1 class="article-title">${escapeAttr(title)}</h1>
      <div class="article-topic-tags">
        ${tagPills}
      </div>
    </header>
${translationNotice}
${noteBanner}
    <div class="article-body">
      ${bodyHTML}
    </div>

    <hr class="article-divider">

    <div class="share-label">${shareLabel}</div>
    <div class="share-links">
      <a class="share-btn share-linkedin" data-title="${escapeAttr(title)}" target="_blank" rel="noopener">Share on LinkedIn</a>
      <a class="share-btn share-x" data-title="${escapeAttr(title)}" target="_blank" rel="noopener">Share on X</a>
      <a class="share-btn" href="#" onclick="navigator.clipboard.writeText(location.href); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy link',2000); return false;">Copy link</a>
    </div>

    <div class="author-bio">
      <div class="author-avatar" aria-hidden="true">FC</div>
      <div class="author-info">
        <div class="author-name">Felipe Cabargas</div>
        <div class="author-desc">${lang === 'es'
          ? 'Profesional de producto con +10 años impulsando crecimiento, cumplimiento normativo y estrategia de IA. Entre Santiago y Copenhague.'
          : 'Product professional with 10+ years driving growth, compliance, and AI strategy. Based between Santiago and Copenhagen.'
        }</div>
      </div>
    </div>

    <div class="consulting-cta">
      <div class="cta-text">
        <strong>${lang === 'es' ? '¿Necesitas estrategia, no solo opiniones?' : 'Need a strategy, not just an opinion?'}</strong>
        ${lang === 'es'
          ? 'Trabajo con startups en producto, preparación para IA y gobernanza.'
          : 'I work with startups on product, AI readiness, and governance.'
        }
      </div>
      <a class="cta-btn" href="https://cabargas.consulting" target="_blank" rel="noopener">${lang === 'es' ? 'Trabaja conmigo ↗' : 'Work with me ↗'}</a>
    </div>
  </article>`;
}
```

- [ ] **Step 2: Rewrite `buildPageHTML()` in `scripts/build.js`**

Replace the entire `buildPageHTML` function with:

```javascript
function buildPageHTML(slug, enData, esData) {
  const { frontmatter: enFm } = enData;
  const { title, excerpt, type } = enFm;
  const originalLang = enFm.originalLang || 'en';
  const hasEs = !!esData;
  const articleUrl = `${SITE_URL}/articles/${slug}`;

  const langSwitcher = hasEs ? `
  <div class="lang-switcher">
    <button class="lang-btn" data-lang="en">English</button>
    <span class="lang-sep">·</span>
    <button class="lang-btn" data-lang="es">Español</button>
  </div>` : '';

  const enContent = buildArticleContent(slug, enFm, enData.bodyHTML, 'en', originalLang);
  const esContent = hasEs ? buildArticleContent(slug, esData.frontmatter, esData.bodyHTML, 'es', originalLang) : '';

  const hreflangEs = hasEs ? `\n  <link rel="alternate" hreflang="es" href="${articleUrl}?lang=es">` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(title)} — Felipe Cabargas</title>
  <meta name="description" content="${escapeAttr(excerpt)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(excerpt)}">
  <meta property="og:url" content="${articleUrl}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(excerpt)}">
  <link rel="alternate" hreflang="en" href="${articleUrl}">${hreflangEs}
  <link rel="alternate" type="application/rss+xml" title="Felipe Cabargas" href="/feed.xml">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="site-name" href="/">Felipe Cabargas</a>
  <div class="nav-links">
    <a href="/" class="back-link">← All writing</a>
    <a href="/about">About</a>
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>
    ${langSwitcher}
  </div>
</nav>

<main class="page">
  <div class="lang-content" data-lang="en">${enContent}
  </div>${hasEs ? `
  <div class="lang-content" data-lang="es" hidden>${esContent}
  </div>` : ''}
</main>

<footer class="site-footer">
  <span>© 2026 Felipe Cabargas</span>
  <div class="social-links">
    <a href="https://linkedin.com/in/cabargas" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://github.com/felipecabargas" target="_blank" rel="noopener">GitHub</a>
    <a href="/feed.xml">RSS</a>
  </div>
</footer>

<script>
  (function () {
    var hasEs = ${hasEs ? 'true' : 'false'};
    function detect() {
      var param = new URLSearchParams(location.search).get('lang');
      if (param === 'en' || param === 'es') return hasEs ? param : 'en';
      if (hasEs && (navigator.language || '').toLowerCase().startsWith('es')) return 'es';
      return 'en';
    }
    function apply(lang) {
      document.querySelectorAll('.lang-content').forEach(function (el) {
        el.hidden = el.dataset.lang !== lang;
      });
      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      var url = new URL(location.href);
      lang === 'en' ? url.searchParams.delete('lang') : url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
      // Update share links to current URL
      var encoded = encodeURIComponent(location.href);
      document.querySelectorAll('.share-linkedin').forEach(function (el) {
        el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded;
      });
      document.querySelectorAll('.share-x').forEach(function (el) {
        el.href = 'https://x.com/intent/tweet?url=' + encoded + '&text=' + encodeURIComponent(el.dataset.title);
      });
    }
    apply(detect());
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { apply(btn.dataset.lang); });
    });
  })();
</script>

</body>
</html>`;
}
```

- [ ] **Step 3: Update `buildArticleItem()` to accept and show ES badge**

Replace the current `buildArticleItem(frontmatter)` signature and return value:

```javascript
function buildArticleItem(frontmatter, hasEs) {
  const { title, type, topics = [], tags = [], slug } = frontmatter;
  const date = frontmatter.date;
  const typeClass = type === 'note' ? 'type-note' : 'type-essay';
  const typeLabel = type === 'note' ? 'Note' : 'Essay';
  const topicsAttr = topics.join(' ');
  const tagPills = tags.map(t => `          <span class="article-tag">${escapeAttr(t)}</span>`).join('\n');
  const esBadge = hasEs ? ' <span class="lang-badge">ES</span>' : '';

  return `    <div class="article-item" data-topics="${escapeAttr(topicsAttr)}">
      <div class="article-left">
        <a class="article-title" href="/articles/${slug}">${escapeAttr(title)}</a>${esBadge}
        <div class="article-excerpt">${escapeAttr(frontmatter.excerpt)}</div>
        <div class="article-tags">
${tagPills}
        </div>
      </div>
      <div class="article-meta">
        <span class="article-type ${typeClass}">${typeLabel}</span>
        <span class="article-date">${date}</span>
      </div>
    </div>`;
}
```

- [ ] **Step 4: Update `updateIndex()` and `articles.push()` to pass `hasEs`**

In `updateIndex`, update the map call:

```javascript
function updateIndex(articles) {
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const items = articles.map(a => buildArticleItem(a.frontmatter, a.hasEs)).join('\n\n');
  const replacement = `<!-- ARTICLES START -->\n${items}\n\n    <!-- ARTICLES END -->`;
  html = html.replace(/<!-- ARTICLES START -->[\s\S]*?<!-- ARTICLES END -->/, replacement);
  fs.writeFileSync(INDEX_HTML, html);
}
```

In `main()`, update the `articles.push` call to also pass `hasEs` and read `esData`:

```javascript
    const es = readLang(slugDir, 'es');
    // (add this line right after reading `en` and before building pageHTML)

    const pageHTML = buildPageHTML(slug, en, es);
    // ...
    articles.push({ frontmatter: en.frontmatter, hasEs: !!es });
```

- [ ] **Step 5: Add CSS to `style.css`**

Add after the `.article-excerpt` rule (around line 155):

```css
.lang-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; background: #f0ede8; color: #888; padding: 2px 5px; border-radius: 3px; vertical-align: middle; margin-left: 6px; }

.lang-switcher { display: flex; align-items: center; gap: 6px; margin-left: 12px; }
.lang-sep { color: #ccc; font-size: 12px; }
.lang-btn { background: none; border: none; cursor: pointer; font-size: 12px; color: #888; padding: 0; font-family: inherit; }
.lang-btn.active { color: #001d39; font-weight: 600; }
.lang-btn:hover { color: #001d39; }

.translation-notice { font-size: 12px; color: #888; background: #fafaf8; border: 1px solid #e8e8e0; border-radius: 4px; padding: 8px 12px; margin-bottom: 24px; }
```

- [ ] **Step 6: Run build and verify**

```bash
npm run build
```

Expected output (same 5 articles, identical to before since no `es.md` files exist yet):
```
Built: articles/chile-data-privacy-law-2026.html
Built: articles/efficiency-paradox.html
Built: articles/feature-saas-vs-smart-saas.html
Built: articles/product-teams-losing-the-ai-race.html
Built: articles/the-hate-on-vibe-coding.html
Updated index.html article list.
Generated feed.xml
```

Open `articles/efficiency-paradox.html` in a browser. Verify:
- No language switcher visible (no `es.md` exists yet)
- Article renders correctly
- Share on LinkedIn / Share on X links work (JS-rendered)
- Copy link works

Then create a test `_articles/efficiency-paradox/es.md` with minimal frontmatter:

```markdown
---
title: "La Paradoja de la Eficiencia: Burnout en la Era Agéntica"
date: "14 de mayo de 2026"
sortDate: "2026-05-14"
type: essay
topics: [ai, governance, startups]
tags: [IA, Gobernanza, Startups]
excerpt: "Los agentes de IA prometen productividad infinita — pero la supervisión constante puede estar creando un nuevo tipo de burnout."
readtime: "3 min de lectura"
slug: efficiency-paradox
---

Contenido de prueba en español.
```

Run `npm run build` again. Open `articles/efficiency-paradox.html`. Verify:
- Language switcher shows `English · Español`
- Clicking Español shows Spanish content, URL updates to `?lang=es`
- Clicking English switches back, removes `?lang` from URL
- ES badge appears next to this article on homepage

Delete the test file: `rm _articles/efficiency-paradox/es.md` and run `npm run build` to restore.

- [ ] **Step 7: Commit**

```bash
git add scripts/build.js style.css articles/ index.html feed.xml
git commit -m "feat: bilingual article support with ?lang=es switching and browser language detection"
```
