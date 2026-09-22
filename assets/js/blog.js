(() => {
  const filterRoot = document.querySelector("[data-blog-filters]");
  const cards = [...document.querySelectorAll("[data-blog-card]")];
  const status = document.querySelector("[data-blog-filter-status]");

  if (filterRoot && cards.length) {
    const buttons = [...filterRoot.querySelectorAll("[data-blog-filter]")];
    const applyFilter = (value) => {
      let visible = 0;
      cards.forEach((card) => {
        const show = value === "all" || card.dataset.category === value;
        card.hidden = !show;
        if (show) visible += 1;
      });
      buttons.forEach((button) => {
        const selected = button.dataset.blogFilter === value;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      if (status) status.textContent = `${visible} ${visible === 1 ? "artigo exibido" : "artigos exibidos"}`;
    };

    buttons.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.blogFilter || "all")));
  }

  const progress = document.querySelector("[data-article-progress]");
  const article = document.querySelector(".blog-article__body");
  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    if (!progress || !article) return;
    const start = article.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
    const end = start + article.offsetHeight - window.innerHeight * 0.45;
    const value = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0;
    progress.style.width = `${value * 100}%`;
  };
  const requestProgress = () => {
    if (!frame) frame = window.requestAnimationFrame(updateProgress);
  };

  if (progress && article) {
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);
    window.addEventListener("load", requestProgress, { once: true });
    requestProgress();
  }

  const tocLinks = [...document.querySelectorAll(".blog-toc a[href^='#']")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const linksById = new Map(tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.removeAttribute("aria-current"));
      linksById.get(visible.target.id)?.setAttribute("aria-current", "location");
    }, { rootMargin: "-18% 0px -68%", threshold: 0 });
    linksById.forEach((_, id) => {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    });
  }
})();
