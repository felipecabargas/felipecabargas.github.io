const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://felipecabargas.github.io';
const ARTICLES_SRC = path.join(__dirname, '..', '_articles');
const ARTICLES_OUT = path.join(__dirname, '..', 'articles');
const INDEX_HTML = path.join(__dirname, '..', 'index.html');

function buildEssayHTML(frontmatter, bodyHTML) {
  const { title, date, readtime, topics = [], tags = [], slug, excerpt } = frontmatter;
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const tagPills = tags.map(t => `<span class="article-topic-tag">${t}</span>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Felipe Cabargas</title>
  <meta name="description" content="${excerpt}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${excerpt}">
  <meta property="og:url" content="${articleUrl}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${excerpt}">
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
        <span class="article-date">${date}</span>
        <span class="dot-sep">·</span>
        <span class="article-readtime">${readtime}</span>
      </div>
      <h1 class="article-title">${title}</h1>
      <div class="article-topic-tags">
        ${tagPills}
      </div>
    </header>

    <div class="article-body">
      ${bodyHTML}
    </div>

    <hr class="article-divider">

    <div class="share-label">Share this essay</div>
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

function buildNoteHTML(frontmatter, bodyHTML) {
  const { title, date, readtime, topics = [], tags = [], slug, excerpt } = frontmatter;
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const tagPills = tags.map(t => `<span class="article-topic-tag">${t}</span>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Felipe Cabargas</title>
  <meta name="description" content="${excerpt}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${excerpt}">
  <meta property="og:url" content="${articleUrl}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${excerpt}">
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
        <span class="article-date">${date}</span>
        <span class="dot-sep">·</span>
        <span class="article-readtime">${readtime}</span>
      </div>
      <h1 class="article-title">${title}</h1>
      <div class="article-topic-tags">
        ${tagPills}
      </div>
    </header>

    <div class="note-banner">
      This is a <strong>note</strong> — a shorter, quicker take. <a href="/">Essays</a> go deeper.
    </div>

    <div class="article-body">
      ${bodyHTML}
    </div>

    <hr class="article-divider">

    <div class="share-label">Share this note</div>
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
  const tagPills = tags.map(t => `          <span class="article-tag">${t}</span>`).join('\n');

  return `    <div class="article-item" data-topics="${topicsAttr}">
      <div class="article-left">
        <a class="article-title" href="/articles/${slug}">${title}</a>
        <div class="article-excerpt">${frontmatter.excerpt}</div>
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

    const bodyHTML = marked(content);
    const pageHTML = frontmatter.type === 'note'
      ? buildNoteHTML(frontmatter, bodyHTML)
      : buildEssayHTML(frontmatter, bodyHTML);

    const outFile = path.join(ARTICLES_OUT, `${frontmatter.slug}.html`);
    fs.writeFileSync(outFile, pageHTML);
    console.log(`Built: articles/${frontmatter.slug}.html`);

    articles.push({ frontmatter });
  }

  // Sort newest first by date string (relies on consistent "Month YYYY" format)
  // For robust sorting, frontmatter can include a sortDate: "2026-05" field
  articles.sort((a, b) => {
    const da = a.frontmatter.sortDate || a.frontmatter.date;
    const db = b.frontmatter.sortDate || b.frontmatter.date;
    return db.localeCompare(da);
  });

  updateIndex(articles);
  console.log('Updated index.html article list.');
}

main();
