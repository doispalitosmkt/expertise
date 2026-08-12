(() => {
  const progress = document.getElementById("progress");
  const gallery = document.querySelector(".projects-gallery");
  const caseColumns = [...document.querySelectorAll("[data-case-parallax]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactLayout = window.matchMedia("(max-width: 64rem)");
  let ticking = false;

  const updateProgress = () => {
    if (!progress) return;
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const value = maximum > 0 ? (window.scrollY / maximum) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };

  const resetParallax = () => {
    caseColumns.forEach((column) => column.style.setProperty("--case-y", "0px"));
  };

  const updateParallax = () => {
    if (!gallery || !caseColumns.length || reduceMotion.matches || compactLayout.matches) {
      resetParallax();
      return;
    }

    const rect = gallery.getBoundingClientRect();
    const range = window.innerHeight + rect.height;
    const progressValue = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range));
    const centered = progressValue * 2 - 1;

    caseColumns.forEach((column) => {
      const speed = Number(column.dataset.speed || 0);
      column.style.setProperty("--case-y", `${(centered * speed).toFixed(2)}px`);
    });
  };

  const update = () => {
    updateProgress();
    updateParallax();
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reduceMotion.addEventListener("change", requestUpdate);
  compactLayout.addEventListener("change", requestUpdate);
})();
