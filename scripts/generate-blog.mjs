import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const posts = JSON.parse(readFileSync(join(root, "content", "blog-posts.json"), "utf8"));
const blogRoot = join(root, "blog");
const siteUrl = "https://www.expertisegroup.com.br";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const stripTags = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const slugify = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const formatDate = (value) => new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${value}T12:00:00Z`)).replace(" de ", " ").replace(" de ", " ");

const titleWithAccent = (post) => {
  const index = post.title.toLocaleLowerCase("pt-BR").lastIndexOf(post.accent.toLocaleLowerCase("pt-BR"));
  if (index < 0) return escapeHtml(post.title);
  const before = post.title.slice(0, index);
  const accent = post.title.slice(index, index + post.accent.length);
  const after = post.title.slice(index + post.accent.length);
  return `${escapeHtml(before)}<em>${escapeHtml(accent)}</em>${escapeHtml(after)}`;
};

const enhanceBody = (post) => {
  const headings = [];
  let body = post.bodyHtml.replace(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_, contents) => {
    const text = stripTags(contents);
    const id = slugify(text);
    headings.push({ id, text });
    return `<h2 id="${escapeHtml(id)}">${contents}</h2>`;
  });
  body = body.replace(/<img\s/gi, '<img loading="lazy" decoding="async" ');
  body = body.replace(/<iframe\s/gi, `<iframe loading="lazy" title="${escapeHtml(post.title)} — vídeo" `);
  return { body, headings };
};

const header = () => `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="nav nav--light" id="nav">
    <div class="nav-inner">
      <a class="brand" href="/" aria-label="Expertise — página inicial"><img src="/assets/logo.svg" alt="Expertise" class="brand-logo" width="740" height="166"></a>
      <nav class="nav-links" data-site-nav aria-label="Navegação principal">
        <a href="/#quem-somos">Quem somos</a><a href="/#expertises">Expertises</a><a href="/#cases">Cases</a><a href="/blog/">Blog</a>
      </nav>
      <a class="button" href="/#contato">Falar com a gente</a>
      <button class="menu-btn" id="menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu principal" aria-hidden="true" inert>
    <div class="mobile-menu-head"><a class="brand" href="/" aria-label="Expertise — página inicial"><img src="/assets/logo.svg" alt="Expertise" class="brand-logo" width="740" height="166"></a><button class="menu-close" id="menu-close" type="button" aria-label="Fechar menu">✕</button></div>
    <nav class="mobile-nav" data-site-nav aria-label="Navegação mobile"><a href="/">Início</a><a href="/#quem-somos">Quem somos</a><a href="/#expertises">Expertises</a><a href="/#cases">Cases</a><a href="/blog/">Blog</a><a href="/#contato">Contato</a></nav>
    <a class="button" href="mailto:contato@expertisegroup.com.br?subject=Novo%20projeto">Iniciar um projeto</a>
  </div>`;

const footer = () => `<footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand"><a class="brand" href="/" aria-label="Expertise — página inicial"><img src="/assets/logo.svg" alt="Expertise" class="brand-logo brand-logo--dark" width="740" height="166"></a><p>Rua Gomes de Carvalho, 1765, 4º andar<br>Vila Olímpia — São Paulo, SP<br><a href="mailto:contato@expertisegroup.com.br">contato@expertisegroup.com.br</a></p><div class="footer-social"><a href="https://www.instagram.com/expertisegroup/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.linkedin.com/company/expertise-marketing-promocional" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.facebook.com/aexpertisegroup" target="_blank" rel="noopener noreferrer">Facebook</a></div></div>
        <div><h2 class="footer-heading">Agência</h2><ul><li><a href="/#quem-somos">Quem somos</a></li><li><a href="/#expertises">Expertises</a></li><li><a href="/#cases">Cases</a></li><li><a href="/blog/">Blog</a></li></ul></div>
        <div><h2 class="footer-heading">Serviços</h2><ul><li><a href="/#expertises">Todos os serviços</a></li><li><a href="/#expertises">Eventos</a></li><li><a href="/#expertises">Trade</a></li><li><a href="/#expertises">Viagens &amp; Logística</a></li><li><a href="/#expertises">Incentivo</a></li></ul></div>
        <div><h2 class="footer-heading">Contato</h2><ul><li><a href="tel:+551130535555">+55&nbsp;11&nbsp;3053&#8209;5555</a></li><li><a href="mailto:contato@expertisegroup.com.br?subject=Novo%20projeto">Iniciar um projeto</a></li><li><a href="mailto:contato@expertisegroup.com.br?subject=Quero%20fazer%20parte%20da%20Expertise">Faça parte</a></li></ul></div>
      </div>
      <div class="legal"><span>© <span data-current-year>2026</span> Expertise Marketing Promocional Ltda.</span><a class="legal-credit" href="https://doispalitosmkt.com.br/" target="_blank" rel="noopener noreferrer">Desenvolvido por <span class="legal-credit__brand">2P Growth Lab</span></a></div>
      <div class="footer-bigmark"><img src="/assets/logo.svg" alt="" class="footer-bigmark-logo" aria-hidden="true" width="740" height="166"></div>
    </div>
  </footer>`;

const renderCard = (post, index) => {
  const category = slugify(post.category);
  const awardsClass = post.cover.includes("premio-caio") ? " editorial-card__media--awards" : "";
  return `<a class="editorial-card editorial-card--link" id="${escapeHtml(post.slug)}" href="/blog/${escapeHtml(post.slug)}/" data-blog-card data-category="${escapeHtml(category)}" data-reveal${index % 3 ? ` data-delay="${index % 3}"` : ""} aria-label="Ler artigo: ${escapeHtml(post.title)}">
            <div class="editorial-card__media${awardsClass}"><img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt)}" loading="lazy" decoding="async" width="1600" height="900"><span class="editorial-card__tag">${escapeHtml(post.category)}</span></div>
            <div class="editorial-card__content"><div class="editorial-card__meta"><time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time><span aria-hidden="true">·</span><span>${post.readingMinutes} min de leitura</span></div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.excerpt)}</p><span class="editorial-card__link">Ler artigo <span aria-hidden="true">↗</span></span></div>
          </a>`;
};

const categoryOrder = [...new Set(posts.map((post) => post.category))];
const filters = `<div class="blog-filters" role="group" aria-label="Filtrar artigos por tema" data-blog-filters>
          <button type="button" class="is-active" data-blog-filter="all" aria-pressed="true">Todos <span>${String(posts.length).padStart(2, "0")}</span></button>
          ${categoryOrder.map((category) => `<button type="button" data-blog-filter="${escapeHtml(slugify(category))}" aria-pressed="false">${escapeHtml(category)} <span>${String(posts.filter((post) => post.category === category).length).padStart(2, "0")}</span></button>`).join("\n          ")}
        </div><p class="sr-only" aria-live="polite" data-blog-filter-status>${posts.length} artigos exibidos</p>`;
const listing = `${filters}\n        <div class="editorial-grid" data-blog-grid>\n          ${posts.map(renderCard).join("\n          ")}\n        </div>`;

const indexPath = join(blogRoot, "index.html");
let indexHtml = readFileSync(indexPath, "utf8");
indexHtml = indexHtml.replace(/<!-- BLOG_POSTS_START -->[\s\S]*?<!-- BLOG_POSTS_END -->/, `<!-- BLOG_POSTS_START -->\n        ${listing}\n        <!-- BLOG_POSTS_END -->`);
indexHtml = indexHtml.replace(/(<div class="page-hero__index"><strong>)\d+(<\/strong>)/, `$1${String(posts.length).padStart(2, "0")}$2`);
writeFileSync(indexPath, indexHtml);

posts.forEach((post, index) => {
  const canonical = `${siteUrl}/blog/${post.slug}/`;
  const previous = posts[(index + 1) % posts.length];
  const next = posts[(index - 1 + posts.length) % posts.length];
  const { body, headings } = enhanceBody(post);
  const toc = headings.length > 1 ? `<nav class="blog-toc" aria-label="Neste artigo"><span>Neste artigo</span><ol>${headings.map((heading) => `<li><a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a></li>`).join("")}</ol></nav>` : "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: `${siteUrl}${post.cover}`,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Expertise Marketing Promocional" },
    publisher: { "@type": "Organization", name: "Expertise Marketing Promocional", logo: { "@type": "ImageObject", url: `${siteUrl}/assets/logo.svg` } },
  };
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(post.title)} | Expertise</title>
  <meta name="description" content="${escapeHtml(post.excerpt)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta name="theme-color" content="#ffea00">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.excerpt)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${siteUrl}${escapeHtml(post.cover)}">
  <meta property="article:published_time" content="${escapeHtml(post.date)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/x-mark.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/PlusJakartaSans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/site.css?v=20260922-1">
  <link rel="stylesheet" href="/assets/css/pages/internal.css">
  <link rel="stylesheet" href="/assets/css/pages/blog.css?v=20260922-1">
  <script src="/assets/js/site.js?v=20260922-2" defer></script>
  <script src="/assets/js/blog.js?v=20260922-1" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body data-page="blog-article">
  <div class="article-progress" aria-hidden="true"><span data-article-progress></span></div>
  ${header()}
  <main class="page-main" id="conteudo">
    <article class="blog-article">
      <header class="blog-article__hero">
        <div class="container">
          <a class="blog-article__back" href="/blog/">← Todos os artigos</a>
          <div class="blog-article__meta" data-reveal><span>${escapeHtml(post.category)}</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time><span>${post.readingMinutes} min de leitura</span></div>
          <h1 class="page-hero__title blog-article__title" id="article-title" data-reveal data-delay="1">${titleWithAccent(post)}</h1>
          <p class="blog-article__excerpt" data-reveal data-delay="2">${escapeHtml(post.excerpt)}</p>
        </div>
      </header>
      <figure class="blog-article__cover" data-reveal><img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt)}" fetchpriority="high" decoding="async" width="1800" height="1050"></figure>
      <div class="container blog-article__layout">
        <aside class="blog-article__rail">${toc}<a class="blog-article__contact" href="mailto:contato@expertisegroup.com.br?subject=Novo%20projeto"><span>Tem um projeto?</span><strong>Vamos conversar ↗</strong></a></aside>
        <div class="blog-article__body">${body}</div>
      </div>
      <nav class="container blog-article__navigation" aria-label="Navegação entre artigos">
        <a href="/blog/${escapeHtml(previous.slug)}/"><span>Artigo anterior</span><strong>${escapeHtml(previous.title)}</strong></a>
        <a href="/blog/${escapeHtml(next.slug)}/"><span>Próximo artigo</span><strong>${escapeHtml(next.title)}</strong></a>
      </nav>
    </article>
    <section class="site-section cta-band motif-blob" aria-labelledby="cta-title"><div class="container cta-band__layout"><div><p class="section-kicker">Próximo projeto</p><h2 id="cta-title">Vamos criar algo que as pessoas vão <em>lembrar?</em></h2></div><a class="button button--dark" href="mailto:contato@expertisegroup.com.br?subject=Novo%20projeto">Falar com a Expertise ↗</a></div></section>
  </main>
  ${footer()}
</body>
</html>
`;
  const directory = join(blogRoot, post.slug);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.html"), html);
});

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
const sitemapEntries = posts.map((post) => `  <url>\n    <loc>${siteUrl}/blog/${post.slug}/</loc>\n  </url>`).join("\n");
sitemap = sitemap.replace(/<!-- BLOG_POST_URLS_START -->[\s\S]*?<!-- BLOG_POST_URLS_END -->/, `<!-- BLOG_POST_URLS_START -->\n${sitemapEntries}\n  <!-- BLOG_POST_URLS_END -->`);
writeFileSync(sitemapPath, sitemap);

console.log(`Blog generated: ${posts.length} article pages and the archive listing.`);
