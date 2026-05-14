const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://felipecabargas.github.io';
const ARTICLES_SRC = path.join(__dirname, '..', '_articles');
const ARTICLES_OUT = path.join(__dirname, '..', 'articles');
const INDEX_HTML = path.join(__dirname, '..', 'index.html');

// Fix 1: escapeAttr helper for safe HTML attribute / title injection
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Fix 5: single buildPageHTML replacing the two near-identical builders
function buildPageHTML(frontmatter, bodyHTML) {
  const { title, date, readtime, tags = [], slug, excerpt, type } = frontmatter;
  const isNote = type === 'note';
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const tagPills = tags.map(t => `<span class="article-topic-tag">${escapeAttr(t)}</span>`).join('\n        ');
  const typeClass = isNote ? 'type-note' : 'type-essay';
  const typeLabel = isNote ? 'Note' : 'Essay';
  const shareLabel = isNote ? 'Share this note' : 'Share this essay';
  const noteBanner = isNote ? `
    <div class="note-banner">
      This is a <strong>note</strong> — a shorter, quicker take. <a href="/">Essays</a> go deeper.
    </div>` : '';

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
${noteBanner}
    <div class="article-body">
      ${bodyHTML}
    </div>

    <hr class="article-divider">

    <div class="share-label">${shareLabel}</div>
    <div class="share-links">
      <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}" target="_blank" rel="noopener">Share on LinkedIn</a>
      <a class="share-btn" href="https://x.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">Share on X</a>
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
</html>`;
}

function buildArticleItem(frontmatter) {
  const { title, type, topics = [], tags = [], slug } = frontmatter;
  const date = frontmatter.date;
  const typeClass = type === 'note' ? 'type-note' : 'type-essay';
  const typeLabel = type === 'note' ? 'Note' : 'Essay';
  const topicsAttr = topics.join(' ');
  const tagPills = tags.map(t => `          <span class="article-tag">${escapeAttr(t)}</span>`).join('\n');

  return `    <div class="article-item" data-topics="${escapeAttr(topicsAttr)}">
      <div class="article-left">
        <a class="article-title" href="/articles/${slug}">${escapeAttr(title)}</a>
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

function updateIndex(articles) {
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const items = articles.map(a => buildArticleItem(a.frontmatter)).join('\n\n');
  const replacement = `<!-- ARTICLES START -->\n${items}\n\n    <!-- ARTICLES END -->`;
  html = html.replace(/<!-- ARTICLES START -->[\s\S]*?<!-- ARTICLES END -->/, replacement);
  fs.writeFileSync(INDEX_HTML, html);
}

function main() {
  if (!fs.existsSync(ARTICLES_SRC)) {
    console.log('No _articles/ directory found — nothing to build.');
    return;
  }

  // Fix 2: ensure articles/ output directory exists
  fs.mkdirSync(ARTICLES_OUT, { recursive: true });

  const files = fs.readdirSync(ARTICLES_SRC).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No markdown files in _articles/ — nothing to build.');
    return;
  }

  const articles = [];

  for (const file of files) {
    const src = path.join(ARTICLES_SRC, file);
    const raw = fs.readFileSync(src, 'utf8');
    const { data: frontmatter, content } = matter(raw);

    frontmatter.slug = frontmatter.slug || path.basename(file, '.md');
    frontmatter.topics = frontmatter.topics || [];
    frontmatter.tags = frontmatter.tags || [];

    // Fix 4: required frontmatter validation
    const required = ['title', 'date', 'type', 'excerpt'];
    const missing = required.filter(k => !frontmatter[k]);
    if (missing.length > 0) {
      console.error(`Skipping ${file}: missing required frontmatter fields: ${missing.join(', ')}`);
      continue;
    }

    // Fix 3: warn when sortDate is missing
    if (!frontmatter.sortDate) {
      console.warn(`Warning: ${file} has no sortDate — article may sort incorrectly. Add sortDate: "YYYY-MM" to frontmatter.`);
    }

    const bodyHTML = marked(content);
    // Fix 5: use unified buildPageHTML
    const pageHTML = buildPageHTML(frontmatter, bodyHTML);

    const outFile = path.join(ARTICLES_OUT, `${frontmatter.slug}.html`);
    fs.writeFileSync(outFile, pageHTML);
    console.log(`Built: articles/${frontmatter.slug}.html`);

    articles.push({ frontmatter });
  }

  // Fix 3: sort by sortDate (ISO YYYY-MM) with graceful fallback
  articles.sort((a, b) => {
    const da = a.frontmatter.sortDate || '';
    const db = b.frontmatter.sortDate || '';
    return db.localeCompare(da);
  });

  updateIndex(articles);
  console.log('Updated index.html article list.');
}

main();
