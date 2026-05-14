const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://cabargas.com';
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

// esData is null when no es.md exists; populated when both language files are present
function buildPageHTML(slug, enData, esData) {
  const { frontmatter: enFm } = enData;
  const { title, excerpt } = enFm;
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
    <a class="consulting-link" href="https://cabargas.consulting" target="_blank" rel="noopener">Consulting ↗</a>${langSwitcher}
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
      var encoded = encodeURIComponent(location.href);
      document.querySelectorAll('.share-linkedin').forEach(function (el) {
        el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded;
      });
      document.querySelectorAll('.share-x').forEach(function (el) {
        el.href = 'https://x.com/intent/tweet?url=' + encoded + '&text=' + encodeURIComponent(el.dataset.title || '');
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

function readLang(slugDir, lang) {
  const fp = path.join(slugDir, `${lang}.md`);
  if (!fs.existsSync(fp)) return null;
  try {
    const { data: frontmatter, content } = matter(fs.readFileSync(fp, 'utf8'));
    return { frontmatter, bodyHTML: marked(content) };
  } catch (err) {
    console.error(`Error parsing ${fp}: ${err.message}`);
    return null;
  }
}

function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateFeed(articles) {
  const feedPath = path.join(__dirname, '..', 'feed.xml');
  const lastBuild = new Date().toUTCString();
  const items = articles.map(({ frontmatter }) => {
    const { title, excerpt, slug, date } = frontmatter;
    const url = `${SITE_URL}/articles/${slug}`;
    const pubDate = new Date(date).toUTCString();
    return `    <item>
      <title>${escapeXML(title)}</title>
      <link>${url}</link>
      <description>${escapeXML(excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Felipe Cabargas — Views Are My Own</title>
    <link>${SITE_URL}</link>
    <description>Thinking out loud on product, AI, and what it means to build responsibly.</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(feedPath, xml);
  console.log('Generated feed.xml');
}

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
        <span class="article-date">${escapeAttr(date)}</span>
      </div>
    </div>`;
}

function updateIndex(articles) {
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const items = articles.map(a => buildArticleItem(a.frontmatter, a.hasEs)).join('\n\n');
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

  const slugs = fs.readdirSync(ARTICLES_SRC, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  if (slugs.length === 0) {
    console.log('No article directories in _articles/ — nothing to build.');
    return;
  }

  const articles = [];

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

    const es = readLang(slugDir, 'es');
    const pageHTML = buildPageHTML(slug, en, es);
    const outFile = path.join(ARTICLES_OUT, `${slug}.html`);
    fs.writeFileSync(outFile, pageHTML);
    console.log(`Built: articles/${slug}.html`);

    articles.push({ frontmatter: en.frontmatter, hasEs: !!es });
  }

  // Fix 3: sort by sortDate (ISO YYYY-MM) with graceful fallback
  articles.sort((a, b) => {
    const da = a.frontmatter.sortDate || '';
    const db = b.frontmatter.sortDate || '';
    return db.localeCompare(da);
  });

  updateIndex(articles);
  console.log('Updated index.html article list.');
  generateFeed(articles);
}

main();
