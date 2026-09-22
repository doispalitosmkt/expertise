(() => {
  const cases = Array.isArray(window.EXPERTISE_CASES) ? window.EXPERTISE_CASES : [];
  if (!cases.length) return;

  const script = document.currentScript || document.querySelector('script[src*="/assets/js/case-overlay.js"]');
  const siteBasePath = new URL("../../", script?.src || window.location.href).pathname;
  const sitePath = (path) => `${siteBasePath}${path.replace(/^\/+/, "")}`;
  const caseBySlug = new Map(cases.map((item) => [item.slug, item]));
  const baseTitle = document.title;
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "iframe",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");
  const groupCopy = {
    eventos: {
      number: "01",
      title: "Eventos",
      intro: "Convenções, festivais, esporte e cultura produzidos como plataformas vivas de marca."
    },
    trade: {
      number: "02",
      title: "Trade",
      intro: "Estratégia e execução no ponto de venda, da presença de marca à promoção nacional."
    },
    viagens: {
      number: "03",
      title: "Viagens & logística",
      intro: "Jornadas de incentivo com roteiro, hospitalidade e operação conectados do início ao fim."
    },
    incentivo: {
      number: "04",
      title: "Incentivo",
      intro: "Campanhas que transformam metas em participação, reconhecimento e resultado mensurável."
    }
  };

  let overlay = null;
  let overlaySurface = null;
  let overlayContent = null;
  let closeButton = null;
  let lastFocused = null;
  let activeCase = null;
  let motionWasPaused = false;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const caseUrl = (slug) => sitePath(`cases/?case=${encodeURIComponent(slug)}`);

  const caseFromUrl = (value = window.location.href) => {
    const url = value instanceof URL ? value : new URL(value, window.location.href);
    return caseBySlug.get(url.searchParams.get("case")) || null;
  };

  const createOverlay = () => {
    if (!("HTMLDialogElement" in window)) return null;

    overlay = document.createElement("dialog");
    overlay.className = "case-overlay";
    overlay.id = "case-overlay";
    overlay.setAttribute("aria-labelledby", "case-overlay-title");
    overlay.innerHTML = `
      <div class="case-overlay__surface" data-case-overlay-surface>
        <button class="case-overlay__close" type="button" aria-label="Fechar case" data-case-overlay-close>
          <span>Fechar</span><span class="case-overlay__close-icon" aria-hidden="true"></span>
        </button>
        <div class="case-overlay__status" role="status" aria-live="polite" data-case-overlay-content>Carregando case…</div>
      </div>`;
    document.body.append(overlay);
    overlaySurface = overlay.querySelector("[data-case-overlay-surface]");
    overlayContent = overlay.querySelector("[data-case-overlay-content]");
    closeButton = overlay.querySelector("[data-case-overlay-close]");

    closeButton?.addEventListener("click", requestClose);
    overlay.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestClose();
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) requestClose();
    });
    overlay.addEventListener("keydown", trapFocus);

    return overlay;
  };

  const factMarkup = (facts = []) => {
    if (!facts.length) return "";
    const sizeClass = facts.length < 3 ? ` case-story__facts--${facts.length}` : "";
    return `<section class="case-story__results" aria-label="Números do projeto">
      <p class="case-story__results-label">Em números</p>
      <div class="case-story__facts${sizeClass}">
        ${facts.map((fact) => `<div class="case-story__fact"><strong>${escapeHtml(fact.value)}</strong><span>${escapeHtml(fact.label)}</span></div>`).join("")}
      </div>
    </section>`;
  };

  const safePresentation = (item) => {
    const presentation = item.presentation || {};
    const modes = new Set(["standard", "contained", "pair", "panorama"]);
    const normalizeMedia = (entry, fallbackIndex = 0) => {
      const index = Number.isInteger(entry?.index) && item.images[entry.index] ? entry.index : fallbackIndex;
      const fit = entry?.fit === "contain" ? "contain" : "cover";
      const ratio = /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(entry?.ratio || "") ? entry.ratio : "4 / 3";
      const position = /^-?\d+(?:\.\d+)?%\s+-?\d+(?:\.\d+)?%$/.test(entry?.position || "") ? entry.position : "50% 50%";
      const span = ["wide", "half", "detail"].includes(entry?.span) ? entry.span : "half";
      return { index, fit, ratio, position, span };
    };

    const heroEntries = Array.isArray(presentation.hero) && presentation.hero.length
      ? presentation.hero
      : [{ index: 0, fit: "cover", ratio: "4 / 3", position: "50% 50%" }];
    const usedHeroIndexes = new Set(heroEntries.map((entry) => entry.index));
    const galleryEntries = Array.isArray(presentation.gallery)
      ? presentation.gallery
      : item.images.map((_, index) => ({ index })).filter((entry) => !usedHeroIndexes.has(entry.index));

    return {
      mode: modes.has(presentation.mode) ? presentation.mode : "standard",
      hero: heroEntries.map((entry) => normalizeMedia(entry)),
      gallery: galleryEntries.map((entry) => normalizeMedia(entry))
    };
  };

  const mediaStyle = (media) => [
    `--media-fit:${media.fit}`,
    `--media-ratio:${media.ratio}`,
    `--media-position:${media.position}`
  ].join(";");

  const coverMarkup = (item, presentation) => {
    const pairClass = presentation.hero.length > 1 ? " case-story__cover--pair" : "";
    const hasPlayableVideo = /^[A-Za-z0-9_-]{11}$/.test(item.video || "");
    const heroMedia = presentation.hero.map((media, index) => {
      const alt = presentation.hero.length > 1
        ? `${item.title} — peça ${index + 1}`
        : `Imagem principal do case ${item.title}`;
      return `<div class="case-story__media${media.fit === "contain" ? " case-story__media--contain" : ""}" style="${mediaStyle(media)}">
        <img src="${escapeHtml(sitePath(item.images[media.index]))}" alt="${escapeHtml(alt)}" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ""} width="1800" height="1400">
      </div>`;
    }).join("");

    return `<figure class="case-story__cover${pairClass}" data-case-cover>
      <div class="case-story__cover-grid">${heroMedia}</div>
      ${item.credit ? `<figcaption>${escapeHtml(item.credit)}</figcaption>` : ""}
      ${hasPlayableVideo ? `<button class="case-story__video-button" type="button" data-case-video="${escapeHtml(item.video)}">
        <span class="case-story__video-icon" aria-hidden="true">▶</span><span>Assistir ao filme</span>
      </button>` : ""}
    </figure>`;
  };

  const galleryMarkup = (item) => {
    const presentation = safePresentation(item);
    const gallery = presentation.gallery;
    if (!gallery.length) return "";
    const headingId = `case-story-gallery-${item.slug}`;
    return `<section class="case-story__gallery" aria-labelledby="${escapeHtml(headingId)}">
      <div class="case-story__gallery-head">
        <p class="case-story__section-label"><span>02</span>Registros</p>
        <h3 id="${escapeHtml(headingId)}">A experiência em cena.</h3>
      </div>
      <div class="case-story__gallery-grid">
        ${gallery.map((media, index) => {
          const span = gallery.length === 2 ? "half" : media.span === "half" ? "wide" : media.span;
          return `<figure class="${media.fit === "contain" ? "case-story__media--contain" : ""}" data-span="${span}" style="${mediaStyle(media)}">
          <img src="${escapeHtml(sitePath(item.images[media.index]))}" alt="${escapeHtml(item.title)} — registro ${index + 2}" decoding="async" width="1600" height="1200">
          ${item.credit ? `<figcaption>${escapeHtml(item.credit)}</figcaption>` : ""}
        </figure>`;
        }).join("")}
      </div>
    </section>`;
  };

  const renderCase = (item) => {
    const currentIndex = cases.indexOf(item);
    const nextCase = cases[(currentIndex + 1) % cases.length];
    const presentation = safePresentation(item);
    const nextPresentation = safePresentation(nextCase);
    const nextMedia = nextPresentation.hero[0];
    const meta = [item.nucleusLabel, item.type, item.year].filter(Boolean);
    const titleSizeClass = item.title.length > 42
      ? " case-story__title--xlong"
      : item.title.length > 25 ? " case-story__title--long" : "";
    const mastheadMeta = [
      item.client ? `<div><dt>Cliente</dt><dd>${escapeHtml(item.client)}</dd></div>` : "",
      item.location ? `<div><dt>Local</dt><dd>${escapeHtml(item.location)}</dd></div>` : ""
    ].filter(Boolean).join("");

    overlayContent.className = "";
    overlayContent.innerHTML = `<article class="case-story case-story--${presentation.mode}" data-case-story="${escapeHtml(item.slug)}">
      <header class="case-story__masthead">
        <div class="case-story__masthead-copy">
          <div class="case-story__masthead-top">
            <img class="case-story__masthead-logo" src="${sitePath("assets/logo.svg")}" alt="" aria-hidden="true" width="740" height="166">
            <span class="case-story__counter">Case ${String(currentIndex + 1).padStart(2, "0")} / ${String(cases.length).padStart(2, "0")}</span>
          </div>
          <div class="case-story__masthead-heading">
            <p class="case-story__eyebrow">${meta.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</p>
            <h2 class="case-story__title${titleSizeClass}" id="case-overlay-title">${escapeHtml(item.title)}</h2>
            <p class="case-story__lead">${escapeHtml(item.lead)}</p>
          </div>
          <div class="case-story__masthead-foot">
            ${mastheadMeta ? `<dl class="case-story__masthead-meta">${mastheadMeta}</dl>` : "<span>Projeto Expertise</span>"}
            <span class="case-story__scroll-cue">Ver projeto <span class="case-story__scroll-arrow" aria-hidden="true">↓</span></span>
          </div>
        </div>
        ${coverMarkup(item, presentation)}
      </header>

      <section class="case-story__overview" aria-labelledby="case-story-brief-${escapeHtml(item.slug)}">
        <div class="case-story__overview-inner">
          <p class="case-story__section-label" id="case-story-brief-${escapeHtml(item.slug)}"><span>01</span>O projeto</p>
          <div class="case-story__copy">${item.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
        </div>
        ${factMarkup(item.facts)}
      </section>

      ${galleryMarkup(item)}

      <footer class="case-story__next">
        <a class="case-story__next-link" href="${caseUrl(nextCase.slug)}" data-case-overlay>
          <div class="case-story__next-media" style="${mediaStyle(nextMedia)}">
            <img src="${escapeHtml(sitePath(nextCase.images[nextMedia.index]))}" alt="" loading="lazy" decoding="async" width="1200" height="900">
          </div>
          <div class="case-story__next-copy">
            <span class="case-story__next-label">Próximo case · ${String(((currentIndex + 1) % cases.length) + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(nextCase.title)}</strong>
            <span class="case-story__next-open">Abrir projeto <span aria-hidden="true">↗</span></span>
          </div>
        </a>
      </footer>
    </article>`;

    window.ExpertiseKinetic?.enhance(overlayContent);

    const videoButton = overlayContent.querySelector("[data-case-video]");
    videoButton?.addEventListener("click", () => {
      const videoId = videoButton.dataset.caseVideo;
      const cover = videoButton.closest("[data-case-cover]");
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      iframe.title = `Filme do case ${item.title}`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      cover?.append(iframe);
      cover?.classList.add("is-playing");
    }, { once: true });

    activeCase = item;
    document.title = `${item.title} | Case Expertise`;
    overlaySurface.scrollTop = 0;
  };

  const showCase = (item, { historyMode = "none", source = null } = {}) => {
    if (!item) return;
    if (!overlay && !createOverlay()) {
      window.location.href = caseUrl(item.slug);
      return;
    }

    const wasClosed = !overlay.open;
    if (wasClosed) {
      lastFocused = source instanceof HTMLElement ? source : document.activeElement;
      motionWasPaused = document.body.classList.contains("motion-paused");
      document.body.classList.add("case-overlay-open", "motion-paused");
    }

    renderCase(item);
    if (wasClosed) overlay.showModal();

    if (historyMode === "push") {
      history.pushState({ expertiseCaseOverlay: true, closeWithBack: true, slug: item.slug }, "", caseUrl(item.slug));
    } else if (historyMode === "replace") {
      history.replaceState({
        expertiseCaseOverlay: true,
        closeWithBack: Boolean(history.state?.closeWithBack),
        slug: item.slug
      }, "", caseUrl(item.slug));
    }

    window.requestAnimationFrame(() => closeButton?.focus());
  };

  const hideCase = ({ restoreFocus = true } = {}) => {
    if (!overlay?.open) return;
    overlay.close();
    overlayContent.replaceChildren();
    activeCase = null;
    document.title = baseTitle;
    document.body.classList.remove("case-overlay-open");
    if (!motionWasPaused) document.body.classList.remove("motion-paused");

    if (restoreFocus && lastFocused instanceof HTMLElement && document.contains(lastFocused)) {
      window.requestAnimationFrame(() => lastFocused.focus());
    }
  };

  function requestClose() {
    if (history.state?.closeWithBack) {
      history.back();
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("case");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    hideCase();
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !overlay?.open) return;
    const focusable = [...overlay.querySelectorAll(focusableSelector)].filter((element) => {
      return element instanceof HTMLElement && element.offsetParent !== null;
    });
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const renderCatalog = () => {
    const root = document.querySelector("[data-case-catalog]");
    if (!root) return;

    root.innerHTML = Object.entries(groupCopy).map(([key, group]) => {
      const groupCases = cases.filter((item) => item.nucleus === key);
      return `<section class="case-catalog-group" id="cases-${key}" aria-labelledby="cases-${key}-title">
        <div class="case-catalog-group__head">
          <span class="case-catalog-group__number">${group.number}</span>
          <h3 class="case-catalog-group__title" id="cases-${key}-title">${escapeHtml(group.title)}</h3>
          <p class="case-catalog-group__intro">${escapeHtml(group.intro)}</p>
        </div>
        <div class="case-catalog-grid">
          ${groupCases.map((item) => `<a class="case-catalog-card" href="${caseUrl(item.slug)}" data-case-overlay aria-label="Abrir case ${escapeHtml(item.title)}">
            <div class="case-catalog-card__media"><img src="${escapeHtml(sitePath(item.images[0]))}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" width="1600" height="1200"></div>
            <div class="case-catalog-card__meta"><h4>${escapeHtml(item.title)}</h4><span>${escapeHtml(item.client || item.type)}</span></div>
          </a>`).join("")}
        </div>
      </section>`;
    }).join("");
  };

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[data-case-overlay]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    const item = caseFromUrl(url);
    if (!item) return;
    event.preventDefault();
    const historyMode = overlay?.contains(link) ? "replace" : "push";
    showCase(item, { historyMode, source: link });
  });

  window.addEventListener("popstate", () => {
    const item = caseFromUrl();
    if (item) {
      showCase(item, { historyMode: "none" });
    } else {
      hideCase();
    }
  });

  renderCatalog();

  const initialCase = caseFromUrl();
  if (initialCase) showCase(initialCase, { historyMode: "none" });
})();
