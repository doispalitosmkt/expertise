(() => {
  const body = document.body;
  const progress = document.getElementById("progress");
  const intro = document.querySelector(".home-intro");
  const heroWords = document.querySelector("[data-hero-words]");
  const words = (heroWords?.dataset.heroWords || "").split("|").map((word) => word.trim()).filter(Boolean);
  const motionToggle = document.querySelector("[data-motion-toggle]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const counters = new Map();
  let frameRequest = 0;
  let wordTimer = 0;
  let introTimer = 0;
  let pageActive = true;
  let pausedByUser = false;
  let wordsVisible = !!heroWords && heroWords.getBoundingClientRect().bottom > 0 && heroWords.getBoundingClientRect().top < window.innerHeight;
  let wordIndex = 0;
  let wordLayer = heroWords?.querySelector(".hero-word-layer");
  let wordTransition = null;
  const supportsWordMotion = !!wordLayer && words.length > 1 && "IntersectionObserver" in window && typeof wordLayer.animate === "function";

  const endIntro = () => {
    clearTimeout(introTimer);
    body.classList.remove("intro-active");
    syncWords();
  };

  const finishCounters = () => {
    counters.forEach((counter, element) => { element.textContent = counter.finalText; });
    counters.clear();
  };

  const update = (timestamp) => {
    frameRequest = 0;
    if (progress) {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const value = maximum > 0 ? window.scrollY / maximum : 0;
      progress.style.width = `${Math.min(1, Math.max(0, value)) * 100}%`;
    }
    counters.forEach((counter, element) => {
      const elapsed = Math.min(1, (timestamp - counter.start) / 950);
      if (elapsed >= 1) {
        element.textContent = counter.finalText;
        counters.delete(element);
      } else {
        const eased = 1 - (1 - elapsed) ** 3;
        element.textContent = `${Math.max(1, Math.round(counter.target * eased))}${counter.suffix}`;
      }
    });
    if (counters.size) frameRequest = window.requestAnimationFrame(update);
  };

  const requestUpdate = () => {
    if (!frameRequest) frameRequest = window.requestAnimationFrame(update);
  };

  const populateWord = (layer, word) => {
    const letters = document.createDocumentFragment();
    Array.from(word).forEach((letter) => {
      const span = document.createElement("span");
      span.className = "hero-word-letter";
      span.textContent = letter;
      letters.append(span);
    });
    layer.replaceChildren(letters);
    layer.setAttribute("aria-hidden", "true");
  };

  const settleWord = () => {
    if (!wordTransition) return;
    const transition = wordTransition;
    wordTransition = null;
    wordLayer.remove();
    wordLayer = transition.incoming;
    wordIndex = transition.index;
    transition.animations.forEach((animation) => animation.cancel());
  };

  const wordsCanMove = () => supportsWordMotion && pageActive && wordsVisible && !document.hidden && !pausedByUser && !reducedMotion.matches && !body.classList.contains("intro-active");

  const swapWord = () => {
    wordTimer = 0;
    if (!wordsCanMove() || wordTransition) return;
    const incoming = document.createElement("span");
    incoming.className = "hero-word-layer";
    const index = (wordIndex + 1) % words.length;
    populateWord(incoming, words[index]);
    heroWords.append(incoming);
    const animateLetters = (layer, entering) => [...layer.children].map((letter, position) => letter.animate([
      { transform: entering ? "translateY(110%)" : "translateY(0)", opacity: entering ? 0 : 1 },
      { transform: entering ? "translateY(0)" : "translateY(-110%)", opacity: entering ? 1 : 0 },
    ], {
      duration: 300,
      delay: position * 22,
      easing: "cubic-bezier(.22,.61,.36,1)",
      fill: "both",
    }));
    const transition = {
      incoming,
      index,
      animations: [...animateLetters(wordLayer, false), ...animateLetters(incoming, true)],
    };
    wordTransition = transition;
    Promise.all(transition.animations.map((animation) => animation.finished)).then(() => {
      if (wordTransition !== transition) return;
      settleWord();
      syncWords();
    }).catch(() => {
      // Cancellation follows a synchronous settle when motion is paused or hidden.
    });
  };

  const syncWords = () => {
    clearTimeout(wordTimer);
    wordTimer = 0;
    if (!supportsWordMotion) return;
    if (!wordsCanMove()) {
      settleWord();
      if (reducedMotion.matches && wordIndex !== 0) {
        wordIndex = 0;
        populateWord(wordLayer, words[0]);
      }
      return;
    }
    if (!wordTransition) wordTimer = window.setTimeout(swapWord, 3600);
  };

  if (supportsWordMotion) populateWord(wordLayer, words[0]);

  const syncMotion = () => {
    const paused = pausedByUser || reducedMotion.matches;
    body.classList.toggle("motion-paused", paused);
    body.classList.toggle("home-motion-ready", "IntersectionObserver" in window && !reducedMotion.matches);
    if (motionToggle) {
      motionToggle.hidden = false;
      motionToggle.textContent = paused ? "Retomar movimento" : "Pausar movimento";
      motionToggle.setAttribute("aria-pressed", String(paused));
      motionToggle.disabled = reducedMotion.matches;
      if (reducedMotion.matches) motionToggle.title = "Movimento reduzido nas preferências do sistema.";
      else motionToggle.removeAttribute("title");
    }
    if (paused) {
      endIntro();
      finishCounters();
    }
    syncWords();
  };

  let wordObserver;
  let counterObserver;
  if ("IntersectionObserver" in window) {
    if (supportsWordMotion) {
      wordObserver = new IntersectionObserver(([entry]) => {
        wordsVisible = entry.isIntersecting;
        syncWords();
      });
      wordObserver.observe(heroWords);
    }
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target: element, isIntersecting }) => {
        if (!isIntersecting) return;
        counterObserver.unobserve(element);
        const target = Number(element.dataset.count);
        if (reducedMotion.matches || pausedByUser || !Number.isFinite(target) || target <= 0) return;
        const finalText = element.textContent.trim();
        element.setAttribute("aria-label", finalText);
        counters.set(element, {
          target,
          finalText,
          suffix: element.dataset.suffix || "",
          start: performance.now(),
        });
        requestUpdate();
      });
    }, { threshold: 0.3 });
    document.querySelectorAll("[data-count]").forEach((element) => counterObserver.observe(element));
  }

  const listen = (target, event, callback, options = {}) => {
    target.addEventListener(event, callback, { ...options, signal: listeners.signal });
  };
  listen(window, "scroll", requestUpdate, { passive: true });
  listen(window, "resize", requestUpdate);
  listen(window, "load", requestUpdate);
  listen(reducedMotion, "change", syncMotion);
  if (motionToggle) listen(motionToggle, "click", () => {
    pausedByUser = !pausedByUser;
    syncMotion();
  });
  listen(document, "visibilitychange", () => {
    if (document.hidden) {
      endIntro();
      finishCounters();
    }
    syncWords();
    requestUpdate();
  });
  listen(window, "pagehide", (event) => {
    pageActive = false;
    endIntro();
    finishCounters();
    window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    if (!event.persisted) {
      listeners.abort();
      wordObserver?.disconnect();
      counterObserver?.disconnect();
    }
  });
  listen(window, "pageshow", () => {
    pageActive = true;
    syncWords();
    requestUpdate();
  });

  if (intro && !reducedMotion.matches && !location.hash && window.scrollY < 1 && !document.hidden) {
    try {
      const sessionKey = "expertise-home-intro-seen";
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        body.classList.add("intro-active");
        introTimer = window.setTimeout(endIntro, 1100);
      }
    } catch {
      // The page remains immediately available when session storage is restricted.
    }
  }
  syncMotion();
  requestUpdate();
})();
