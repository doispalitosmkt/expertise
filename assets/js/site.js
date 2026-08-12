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
  document.querySelectorAll("[data-site-nav] a[href]").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/index\.html$/, "");
    if (linkPath === currentPath || (currentPath === "/" && linkPath === "/")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const reveals = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
