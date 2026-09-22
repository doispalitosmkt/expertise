(() => {
  const body = document.body;
  const header = document.getElementById("nav");
  const menuButton = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  const menuClose = document.getElementById("menu-close");
  const headerStartsLight = header?.classList.contains("nav--light") || false;
  let lastFocused = null;

  const setHeaderState = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 32;
    header.classList.toggle("scrolled", isScrolled);
    header.classList.toggle("nav--light", headerStartsLight && !isScrolled);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const setMenuState = (isOpen) => {
    if (!menu || !menuButton) return;
    menu.classList.toggle("open", isOpen);
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
    menu.toggleAttribute("inert", !isOpen);
    body.classList.toggle("menu-open", isOpen);

    if (isOpen) {
      lastFocused = document.activeElement;
      window.setTimeout(() => {
        if (menu.classList.contains("open")) menuClose?.focus();
      }, 50);
    } else if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  menuButton?.addEventListener("click", () => setMenuState(true));
  menuClose?.addEventListener("click", () => setMenuState(false));
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (!menu?.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setMenuState(false);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...menu.querySelectorAll(focusableSelector)].filter((element) => {
      return element instanceof HTMLElement && !element.hasAttribute("inert");
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
  });

  if (menu) {
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");
  }

  const currentPath = window.location.pathname.replace(/index\.html$/, "");
  const siteScript = document.querySelector('script[src*="/assets/js/site.js"]');
  const siteRootPath = siteScript ? new URL("../../", siteScript.src).pathname : "/";
  document.querySelectorAll("[data-site-nav] a[href]").forEach((link) => {
    const linkUrl = new URL(link.href, window.location.origin);
    const linkPath = linkUrl.pathname.replace(/index\.html$/, "");
    if (linkUrl.hash && linkPath === currentPath) return;
    const isCurrent = linkPath === currentPath || (linkPath !== siteRootPath && currentPath.startsWith(linkPath));
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const kineticSelector = [
    ".page-hero__title",
    ".section-title",
    ".editorial-title",
    ".clients-title",
    ".service-chapter__header h2",
    ".integration-copy h2",
    ".form-intro h2",
    ".cta-band h2",
    ".case-hero__title",
    ".case-story__title",
    ".case-story__gallery-head h3",
    ".case-catalog-view__title"
  ].join(",");
  const kineticTitles = new Set();
  const kineticTimers = new WeakMap();
  let kineticObserver = null;

  const clearKineticTimer = (title) => {
    const timer = kineticTimers.get(title);
    if (timer) window.clearTimeout(timer);
    kineticTimers.delete(title);
  };

  const kineticCanMove = (title) => {
    if (reduceMotion.matches || document.hidden) return false;
    return title.closest(".case-overlay") || !body.classList.contains("motion-paused");
  };

  const scheduleKineticPulse = (title, delay = 4200) => {
    clearKineticTimer(title);
    if (!title.classList.contains("kinetic-visible") || !title.classList.contains("kinetic-settled") || !kineticCanMove(title)) return;
    const timer = window.setTimeout(() => {
      if (!kineticCanMove(title) || !title.classList.contains("kinetic-visible")) return;
      title.classList.remove("kinetic-pulse");
      void title.offsetWidth;
      title.classList.add("kinetic-pulse");
      const cleanup = window.setTimeout(() => {
        title.classList.remove("kinetic-pulse");
        scheduleKineticPulse(title, 5200 + Math.round(Math.random() * 1800));
      }, 1150);
      kineticTimers.set(title, cleanup);
    }, delay);
    kineticTimers.set(title, timer);
  };

  const settleKineticTitle = (title) => {
    title.classList.add("kinetic-in", "kinetic-settled");
    scheduleKineticPulse(title);
  };

  const enterKineticTitle = (title) => {
    if (title.classList.contains("kinetic-in")) return;
    title.classList.add("kinetic-in");
    if (!kineticCanMove(title)) {
      settleKineticTitle(title);
      return;
    }
    const duration = Number(title.dataset.kineticDuration) || 1200;
    window.setTimeout(() => settleKineticTitle(title), duration);
  };

  const prepareKineticTitle = (title) => {
    if (!(title instanceof HTMLElement) || title.dataset.kineticReady === "true") return;
    const accessibleText = title.textContent.replace(/\s+/g, " ").trim();
    if (!accessibleText) return;

    const variant = title.dataset.kineticVariant || (
      title.matches(".page-hero__title, .case-hero__title, .case-story__title")
        ? "hero"
        : title.matches(".cta-band h2, .cta .section-title, .clients-title") ? "impact" : "wave"
    );
    const textNodes = [];
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let characterIndex = 0;
    let wordIndex = 0;
    const step = variant === "hero" ? 18 : variant === "impact" ? 20 : 23;
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "kinetic-word";
        word.dataset.kineticWord = part;
        word.style.setProperty("--kinetic-word-index", String(wordIndex));
        Array.from(part).forEach((character) => {
          const letter = document.createElement("span");
          letter.className = "kinetic-char";
          letter.textContent = character;
          letter.style.setProperty("--kinetic-delay", `${characterIndex * step}ms`);
          letter.style.setProperty("--kinetic-pulse-delay", `${(characterIndex % 12) * 34}ms`);
          letter.style.setProperty("--kinetic-x", characterIndex % 2 ? ".36em" : "-.36em");
          word.append(letter);
          characterIndex += 1;
        });
        fragment.append(word);
        wordIndex += 1;
      });
      node.replaceWith(fragment);
    });

    const accentWord = title.querySelector("em .kinetic-word:last-child") || title.querySelector(".kinetic-word:last-child");
    accentWord?.setAttribute("data-kinetic-accent", "");
    title.classList.add("kinetic-title");
    title.dataset.kineticVariant = variant;
    title.dataset.kineticReady = "true";
    title.dataset.kineticDuration = String(Math.min(1850, 880 + characterIndex * step));
    if (!title.hasAttribute("aria-label")) title.setAttribute("aria-label", accessibleText);
    kineticTitles.add(title);

    title.addEventListener("pointerenter", () => {
      if (!title.classList.contains("kinetic-settled") || !kineticCanMove(title)) return;
      scheduleKineticPulse(title, 40);
    });

    if (kineticObserver) kineticObserver.observe(title);
    else settleKineticTitle(title);
  };

  const enhanceKineticType = (root = document) => {
    const titles = [];
    if (root instanceof Element && root.matches(kineticSelector)) titles.push(root);
    root.querySelectorAll?.(kineticSelector).forEach((title) => titles.push(title));
    titles.forEach(prepareKineticTitle);
  };

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    kineticObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const title = entry.target;
        title.classList.toggle("kinetic-visible", entry.isIntersecting);
        if (entry.isIntersecting) {
          enterKineticTitle(title);
          if (title.classList.contains("kinetic-settled")) scheduleKineticPulse(title);
        } else {
          clearKineticTimer(title);
          title.classList.remove("kinetic-pulse");
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8%" });
  }

  window.ExpertiseKinetic = { enhance: enhanceKineticType };
  enhanceKineticType();
  body.classList.add("kinetic-motion-ready");

  const syncKineticMotion = () => {
    kineticTitles.forEach((title) => {
      if (reduceMotion.matches) settleKineticTitle(title);
      if (kineticCanMove(title)) scheduleKineticPulse(title, 900);
      else {
        if (title.classList.contains("kinetic-in") && !title.classList.contains("kinetic-settled")) settleKineticTitle(title);
        clearKineticTimer(title);
        title.classList.remove("kinetic-pulse");
      }
    });
  };
  reduceMotion.addEventListener("change", syncKineticMotion);
  document.addEventListener("visibilitychange", syncKineticMotion);
  document.addEventListener("expertise:motionchange", syncKineticMotion);
  new MutationObserver(syncKineticMotion).observe(body, { attributes: true, attributeFilter: ["class"] });

  const reveals = document.querySelectorAll("[data-reveal]");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px" });

    reveals.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll("[data-video-id]").forEach((player) => {
    const button = player.querySelector("button");
    if (!button) return;

    button.addEventListener("click", () => {
      const videoId = player.dataset.videoId;
      if (!videoId) return;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      iframe.title = player.dataset.videoTitle || "Vídeo da Expertise";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      player.classList.add("is-playing");
      player.replaceChildren(iframe);
    }, { once: true });
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
