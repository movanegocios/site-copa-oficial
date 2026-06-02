// ============================================================
//  SCRIPT.JS — Jogos do Brasil
//  Lógica principal da página
//  Depende de: config.js carregado antes
//  Atualizado com:
//  - carrossel corrigido
//  - cards com imagem, vídeo local, vídeo externo e YouTube
//  - cardápio externo
//  - card de reserva abrindo modal
//  - card do bolão abrindo modal com 2 combos participantes
//  - reserva com desconto automático
//  - bolão promocional sem aposta em dinheiro
//  - integração n8n / Apps Script preparada
// ============================================================

(function () {
  "use strict";

  // ==========================================================
  //  UTILITÁRIOS
  // ==========================================================

  function safeConfig(path, fallback) {
    try {
      return path.split(".").reduce((obj, key) => obj && obj[key], CONFIG) ?? fallback;
    } catch (e) {
      return fallback;
    }
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
  }

  function onlyNumbers(value) {
    return String(value ?? "").replace(/\D/g, "");
  }

  function showElement(el) {
    if (el) el.classList.remove("hidden");
  }

  function hideElement(el) {
    if (el) el.classList.add("hidden");
  }

  function setText(id, value) {
    const el = getEl(id);
    if (el && value !== undefined && value !== null) {
      el.textContent = value;
    }
  }

  function setHref(id, url) {
    const el = getEl(id);
    if (el && url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    }
  }

  function scrollToHash(hash) {
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function buildWhatsAppUrl(customMessage) {
    const numero = onlyNumbers(safeConfig("whatsapp.numero", ""));
    const mensagem = customMessage || safeConfig("whatsapp.mensagem", "");

    if (!numero) return "#";

    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  }

  function openWhatsApp(customMessage) {
    const url = buildWhatsAppUrl(customMessage);
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener");
    }
  }

  function isSectionEnabled(key, fallback) {
    const secoes = safeConfig("secoes", {});
    if (typeof secoes[key] === "boolean") return secoes[key];
    return fallback !== false;
  }

  function toggleSectionByConfig() {
    document.querySelectorAll("[data-section]").forEach((section) => {
      const key = section.getAttribute("data-section");
      if (!key) return;

      if (isSectionEnabled(key, true)) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });
  }

  function makeGameLabel(jogo) {
    if (!jogo) return "";
    if (typeof jogo === "string") return jogo;

    return `${jogo.partida || "Jogo do Brasil"}${jogo.data ? ` • ${jogo.data}` : ""}${jogo.hora ? ` • ${jogo.hora}` : ""}`;
  }

  function populateSelectWithGames(selectId, jogos) {
    const select = getEl(selectId);
    if (!select) return;

    const lista = Array.isArray(jogos) && jogos.length ? jogos : safeConfig("jogos", []);
    const first = select.querySelector("option")
      ? select.querySelector("option").outerHTML
      : `<option value="">Selecione</option>`;

    let html = first;

    lista.forEach((jogo) => {
      const label = makeGameLabel(jogo);
      html += `<option value="${escapeAttr(label)}">${escapeHTML(label)}</option>`;
    });

    select.innerHTML = html;
  }

  function trackEvent(eventName, payload) {
    const dados = payload || {};

    integracoes.n8n(eventName, dados);

    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...dados });
    }

    if (window.fbq) {
      window.fbq("trackCustom", eventName, dados);
    }
  }

  // ==========================================================
  //  MÍDIA UNIVERSAL PARA TODOS OS CARDS
  //  Aceita:
  //  media: { type: "image"|"local"|"external"|"youtube", src: "", poster: "" }
  //  ou campos diretos:
  //  imagem, image, videoType, type, youtube, external, local, video, src
  // ==========================================================

  function normalizeMedia(item) {
    const media = item?.media || {};

    const type =
      media.type ||
      item?.mediaType ||
      item?.videoType ||
      item?.type ||
      (item?.youtube ? "youtube" : "") ||
      (item?.external ? "external" : "") ||
      (item?.local ? "local" : "") ||
      (item?.video ? "local" : "") ||
      (item?.src ? "local" : "") ||
      (item?.imagem || item?.image ? "image" : "");

    const src =
      media.src ||
      item?.src ||
      item?.youtube ||
      item?.external ||
      item?.local ||
      item?.video ||
      item?.imagem ||
      item?.image ||
      "";

    const poster =
      media.poster ||
      item?.poster ||
      "";

    return {
      type,
      src,
      poster,
    };
  }

  function renderMedia(item, options = {}) {
    const media = normalizeMedia(item);
    const title = item?.titulo || item?.title || options.title || "Mídia da campanha";
    const placeholder = options.placeholder || "🇧🇷";
    const className = options.className || "card-media";

    if (!media.src) {
      return `
        <div class="${className}">
          <div class="media-placeholder">${placeholder}</div>
        </div>`;
    }

    if (media.type === "youtube") {
      return `
        <div class="${className}">
          <iframe
            src="https://www.youtube.com/embed/${escapeAttr(media.src)}?rel=0&modestbranding=1&playsinline=1"
            title="${escapeAttr(title)}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>`;
    }

    if (media.type === "external" || media.type === "local" || media.type === "video") {
      return `
        <div class="${className}">
          <video
            src="${escapeAttr(media.src)}"
            ${media.poster ? `poster="${escapeAttr(media.poster)}"` : ""}
            muted
            loop
            playsinline
            preload="metadata">
          </video>
        </div>`;
    }

    return `
      <div class="${className}">
        <img src="${escapeAttr(media.src)}" alt="${escapeAttr(title)}" loading="lazy" />
      </div>`;
  }

  function playVideosOnHover() {
    document.addEventListener("mouseenter", (e) => {
      const card = e.target.closest(".offer-card, .torcer-card, .single-feature-card, .bar-benefit-card, .bar-actions-card, .bolao-combo-card, .promo-card");
      if (!card) return;

      const video = card.querySelector("video");
      if (video) video.play().catch(() => {});
    }, true);

    document.addEventListener("mouseleave", (e) => {
      const card = e.target.closest(".offer-card, .torcer-card, .single-feature-card, .bar-benefit-card, .bar-actions-card, .bolao-combo-card, .promo-card");
      if (!card) return;

      const video = card.querySelector("video");
      if (video) video.pause();
    }, true);
  }

  // ==========================================================
  //  INTEGRAÇÕES
  // ==========================================================

  const integracoes = {
    n8n: function (evento, dados) {
      const url = safeConfig("integracoes.n8n.webhookUrl", "");
      if (!url) return;

      const payload = {
        evento,
        campanha: safeConfig("campanha.nome", "Jogos do Brasil"),
        tipoCampanha: safeConfig("tipoCampanha", "hibrida"),
        timestamp: new Date().toISOString(),
        origem: window.location.href,
        ...dados,
      };

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },

    appsScript: function (dados) {
      const url = safeConfig("integracoes.googleAppsScript.url", "");
      if (!url) return Promise.resolve(null);

      const payload = {
        campanha: safeConfig("campanha.nome", "Jogos do Brasil"),
        tipoCampanha: safeConfig("tipoCampanha", "hibrida"),
        data: new Date().toISOString(),
        origem: window.location.href,
        ...dados,
      };

      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .catch(() => null);
    },
  };

  window.Integracoes = integracoes;

  function initTrackingIntegrations() {
    const pixelId = safeConfig("integracoes.facebookPixelId", "");
    const gtmId = safeConfig("integracoes.gtmId", "");

    if (gtmId && !window.__jogosBrasilGtmLoaded) {
      window.__jogosBrasilGtmLoaded = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(gtmScript);
    }

    if (pixelId && !window.__jogosBrasilPixelLoaded) {
      window.__jogosBrasilPixelLoaded = true;

      window.fbq = window.fbq || function () {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };

      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = window.fbq.queue || [];

      const pixelScript = document.createElement("script");
      pixelScript.async = true;
      pixelScript.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(pixelScript);

      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  }


  // ==========================================================
  //  MODAIS
  // ==========================================================

  function openModal(id) {
    const modal = getEl(id);
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal(id) {
    const modal = getEl(id);
    if (!modal) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function initModals() {
    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("[data-close-modal]");
      if (!closeBtn) return;

      const id = closeBtn.getAttribute("data-close-modal");
      closeModal(id);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      document.querySelectorAll(".campaign-modal:not(.hidden)").forEach((modal) => {
        closeModal(modal.id);
      });

      const roulette = getEl("roulette-modal");
      if (roulette && !roulette.classList.contains("hidden")) {
        closeRouletteModal();
      }
    });
  }

  // ==========================================================
  //  HEADER
  // ==========================================================

  function initHeader() {
    const logoEl = getEl("header-logo");
    if (!logoEl) return;

    const campanha = safeConfig("campanha", {});
    const nome = campanha.nome || "Jogos do Brasil";
    const subtitulo = campanha.subtitulo || "";
    const logoPath = campanha.logoPath || "";
    const logoUrl = campanha.logoUrl || "";

    if (logoPath || logoUrl) {
      logoEl.innerHTML = `<img src="${escapeAttr(logoPath || logoUrl)}" alt="${escapeAttr(nome)}" />`;
    } else {
      const words = nome.trim().split(" ");
      const last = words.length > 1 ? words.pop() : "";
      const rest = words.join(" ") || nome;

      logoEl.innerHTML = `
        <div>
          <span class="header-logo-text">${escapeHTML(rest)} ${last ? `<span>${escapeHTML(last)}</span>` : ""}</span>
          ${subtitulo ? `<span class="header-logo-sub">${escapeHTML(subtitulo)}</span>` : ""}
        </div>`;
    }

    const btn = getEl("header-whatsapp-btn");
    if (btn) {
      btn.href = buildWhatsAppUrl();
      btn.addEventListener("click", () => {
        trackEvent("clique_whatsapp", { local: "header" });
      });
    }
  }

  // ==========================================================
  //  CARROSSEL/TICKER CORRIGIDO
  // ==========================================================

  function initTicker() {
    const ticker = getEl("jogos-ticker");
    if (!ticker) return;

    if (ticker._tickerRaf) {
      cancelAnimationFrame(ticker._tickerRaf);
      ticker._tickerRaf = null;
    }

    const jogos = safeConfig("jogos", []);

    if (!Array.isArray(jogos) || !jogos.length) {
      ticker.innerHTML = "";
      ticker.style.transform = "";
      return;
    }

    const itemHTML = jogos.map((j) => {
      const partida = j.partida || "Jogo do Brasil";
      const data = j.data || "";
      const hora = j.hora || "";
      const label = `${partida}${data ? ` em ${data}` : ""}${hora ? ` às ${hora}` : ""}`;

      return `
        <span class="jogo-item" aria-label="${escapeAttr(label)}">
          ${escapeHTML(partida)}
          <span class="jogo-separador">|</span>
          <span class="jogo-data">${escapeHTML(data)}${data && hora ? " • " : ""}${escapeHTML(hora)}</span>
        </span>`;
    }).join("");

    /*
      Solução robusta: o movimento é feito por requestAnimationFrame,
      medindo a largura real da primeira trilha. Assim o carrossel não
      depende apenas de CSS animation e não trava quando a tela muda.
    */
    ticker.innerHTML = `
      <div class="jogos-ticker-group" aria-hidden="false">${itemHTML}</div>
      <div class="jogos-ticker-group" aria-hidden="true">${itemHTML}</div>
      <div class="jogos-ticker-group" aria-hidden="true">${itemHTML}</div>
    `;

    const carouselConfig = safeConfig("carousel", {});
    const configuredSpeed = Number(carouselConfig.speedSeconds || 24);
    const minSpeed = Number(carouselConfig.minSpeedSeconds || 8);
    const maxSpeed = Number(carouselConfig.maxSpeedSeconds || 90);
    const safeSpeed = Math.min(Math.max(configuredSpeed, minSpeed), maxSpeed);

    ticker.style.setProperty("--ticker-speed", `${safeSpeed}s`);
    ticker.style.animation = "none";
    ticker.style.transform = "translate3d(0,0,0)";

    let offset = 0;
    let lastTime = performance.now();
    let paused = false;

    function getLoopWidth() {
      const group = ticker.querySelector(".jogos-ticker-group");
      return group ? group.getBoundingClientRect().width : 0;
    }

    function animate(now) {
      const loopWidth = getLoopWidth();
      const delta = now - lastTime;
      lastTime = now;

      if (!paused && loopWidth > 0) {
        const pixelsPerMs = loopWidth / (safeSpeed * 1000);
        offset = (offset + delta * pixelsPerMs) % loopWidth;
        ticker.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      ticker._tickerRaf = requestAnimationFrame(animate);
    }

    ticker.addEventListener("mouseenter", () => { paused = true; });
    ticker.addEventListener("mouseleave", () => { paused = false; lastTime = performance.now(); });
    ticker.addEventListener("touchstart", () => { paused = true; }, { passive: true });
    ticker.addEventListener("touchend", () => { paused = false; lastTime = performance.now(); }, { passive: true });

    window.addEventListener("resize", () => {
      offset = 0;
      lastTime = performance.now();
      ticker.style.transform = "translate3d(0,0,0)";
    }, { passive: true });

    ticker._tickerRaf = requestAnimationFrame(animate);
  }

  // ==========================================================
  //  INTRO
  // ==========================================================

  function initIntro() {
    const intro = safeConfig("intro", {});
    if (intro.enabled !== true) return;

    const screen = getEl("intro-screen");
    if (!screen) return;

    const videoWrap = screen.querySelector(".intro-video-wrap");
    const skipBtn = getEl("intro-skip");
    const progressBar = getEl("intro-progress-bar");

    screen.classList.remove("hidden");
    screen.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const videoType = intro.videoType || "youtube";
    const youtube = intro.youtube || "";
    const external = intro.external || "";
    const local = intro.local || "";
    const duration = Number(intro.durationMs || 8000);

    if (videoWrap) {
      if (videoType === "youtube" && youtube) {
        videoWrap.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${escapeAttr(youtube)}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${escapeAttr(youtube)}"
            allow="autoplay; fullscreen" allowfullscreen title="Introdução da campanha"></iframe>`;
      } else if (videoType === "external" && external) {
        videoWrap.innerHTML = `<video src="${escapeAttr(external)}" autoplay muted playsinline></video>`;
      } else if (local) {
        videoWrap.innerHTML = `<video src="${escapeAttr(local)}" autoplay muted playsinline></video>`;
      } else {
        videoWrap.innerHTML = `<div class="media-placeholder">🇧🇷</div>`;
      }
    }

    if (skipBtn) skipBtn.textContent = intro.skipText || "Pular introdução →";

    if (progressBar) {
      progressBar.style.width = "0%";
      progressBar.style.transition = `width ${duration}ms linear`;
      setTimeout(() => {
        progressBar.style.width = "100%";
      }, 50);
    }

    const timer = setTimeout(closeIntro, duration);

    function closeIntro() {
      clearTimeout(timer);
      screen.classList.add("fade-out");
      screen.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      setTimeout(() => {
        screen.classList.add("hidden");
      }, 720);
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        trackEvent("intro_pulada", { local: "intro" });
        closeIntro();
      });
    }
  }

  // ==========================================================
  //  HERO VIDEO
  // ==========================================================

  function initHeroVideo() {
    const container = getEl("hero-video-container");
    const fallback = getEl("hero-fallback");
    if (!container || !fallback) return;

    const video = safeConfig("video", {});
    const type = video.type || "youtube";
    const youtube = video.youtube || "";
    const external = video.external || "";
    const local = video.local || "";
    const poster = video.poster || "";

    function showFallback() {
      container.classList.add("hidden");
      fallback.classList.remove("hidden");
    }

    try {
      if (type === "youtube" && youtube) {
        container.innerHTML = `
          <div class="yt-wrap">
            <iframe
              src="https://www.youtube.com/embed/${escapeAttr(youtube)}?autoplay=1&mute=1&loop=1&playlist=${escapeAttr(youtube)}&controls=0&rel=0&showinfo=0&modestbranding=1"
              allow="autoplay; fullscreen"
              allowfullscreen
              title="Vídeo de campanha">
            </iframe>
          </div>`;
      } else if (type === "external" && external) {
        container.innerHTML = `
          <video
            src="${escapeAttr(external)}"
            autoplay muted loop playsinline
            ${poster ? `poster="${escapeAttr(poster)}"` : ""}
            style="width:100%;height:100%;object-fit:cover">
          </video>`;

        const vid = container.querySelector("video");
        if (vid) vid.addEventListener("error", showFallback);
      } else if (type === "local" && local) {
        container.innerHTML = `
          <video
            src="${escapeAttr(local)}"
            autoplay muted loop playsinline
            ${poster ? `poster="${escapeAttr(poster)}"` : ""}
            style="width:100%;height:100%;object-fit:cover">
          </video>`;

        const vid = container.querySelector("video");
        if (vid) vid.addEventListener("error", showFallback);
      } else {
        showFallback();
      }
    } catch (e) {
      showFallback();
    }
  }

  // ==========================================================
  //  HERO CONTENT + CARDÁPIO
  // ==========================================================

  function initHeroContent() {
    const campanha = safeConfig("campanha", {});
    const slogan = campanha.slogan || "Prepare sua torcida para os Jogos do Brasil";
    const descricao = campanha.descricao || "Combos, delivery, retirada com desconto e promoções especiais para cada jogo.";
    const logoPath = campanha.logoPath || "";
    const logoUrl = campanha.logoUrl || "";

    setText("hero-title", slogan);
    setText("hero-sub", descricao);

    const logoWrap = getEl("campaign-logo-wrap");
    if (logoWrap) {
      if (logoPath || logoUrl) {
        logoWrap.innerHTML = `<img src="${escapeAttr(logoPath || logoUrl)}" alt="Logo da campanha" />`;
      } else {
        logoWrap.innerHTML = `<span class="flag-emoji">🇧🇷</span>`;
      }
    }

    const btnsEl = getEl("hero-btns");
    const primario = safeConfig("botoes.primario", {
      texto: "Pedir no WhatsApp",
      acao: "whatsapp",
    });

    const secundario = safeConfig("botoes.secundario", {
      texto: "Ver campanha",
      acao: "scroll",
      scroll: "#campanha",
    });

    if (btnsEl) {
      btnsEl.innerHTML = `
        <a href="${escapeAttr(resolveActionHref(primario))}"
           class="btn-primary"
           id="hero-btn-primary"
           ${primario.acao === "whatsapp" || primario.acao === "link" ? 'target="_blank" rel="noopener"' : ""}>
          ${primario.acao === "whatsapp" ? "💬 " : ""}${escapeHTML(primario.texto)}
        </a>

        <a href="${escapeAttr(resolveActionHref(secundario))}"
           class="btn-secondary"
           id="hero-btn-secondary"
           ${secundario.acao === "link" ? 'target="_blank" rel="noopener"' : ""}>
          ${escapeHTML(secundario.texto)}
        </a>`;

      bindAction(getEl("hero-btn-primary"), primario, "hero_primario");
      bindAction(getEl("hero-btn-secondary"), secundario, "hero_secundario");
    }

    initCardapioButton();
  }

  function initCardapioButton() {
    const cardapio = safeConfig("cardapio", {});
    const heroAction = getEl("hero-menu-action");
    const heroBtn = getEl("hero-menu-btn");
    const finalBtn = getEl("final-cardapio-btn");

    const enabled = cardapio.enabled !== false;
    const url = cardapio.url || "";
    const texto = cardapio.texto || "🍽️ Ver cardápio";

    if (!enabled || !url) {
      hideElement(heroAction);
      hideElement(finalBtn);
      return;
    }

    if (heroBtn) {
      heroBtn.textContent = texto;
      heroBtn.href = url;
      heroBtn.target = "_blank";
      heroBtn.rel = "noopener";

      heroBtn.addEventListener("click", () => {
        trackEvent("clique_cardapio", { local: "hero", url });
      });
    }

    if (finalBtn) {
      finalBtn.textContent = texto;
      finalBtn.href = url;
      finalBtn.target = "_blank";
      finalBtn.rel = "noopener";

      finalBtn.addEventListener("click", () => {
        trackEvent("clique_cardapio", { local: "cta_final", url });
      });
    }
  }

  function resolveActionHref(item) {
    if (!item) return "#";
    if (item.acao === "whatsapp") return buildWhatsAppUrl(item.mensagemWhatsApp || item.mensagem);
    if (item.acao === "link") return item.link || "#";
    if (item.acao === "scroll") return item.scroll || "#";
    return "#";
  }

  function bindAction(el, item, local) {
    if (!el || !item) return;

    el.addEventListener("click", (e) => {
      trackEvent(item.acao === "whatsapp" ? "clique_whatsapp" : "clique_cta", {
        local,
        texto: item.texto || item.botao || item.titulo || "",
        acao: item.acao || "",
      });

      if (item.acao === "scroll") {
        e.preventDefault();
        scrollToHash(item.scroll || "#campanha");
      }

      if (item.acao === "whatsapp") {
        // href já abre, não precisa preventDefault
      }
    });
  }

  // ==========================================================
  //  CARDS ANIMADOS DO HERO
  // ==========================================================

  function initCards() {
    const stage = getEl("cards-stage");
    if (!stage) return;

    const cards = safeConfig("cards", []);
    if (!Array.isArray(cards) || cards.length < 2) return;

    let currentIndex = 0;

    const slotA = createHeroCard(cards[0], "left");
    const slotB = createHeroCard(cards[1], "right");

    stage.appendChild(slotA);
    stage.appendChild(slotB);

    positionCards([slotA, slotB]);

    function positionCards(pair) {
      const stageH = stage.clientHeight;
      const cardH = pair[0].clientHeight || 220;
      const maxTop = Math.max(0, stageH - cardH);

      pair[0].style.top = Math.floor(Math.random() * maxTop * 0.4) + "px";
      pair[1].style.top = Math.floor(maxTop * 0.35 + Math.random() * maxTop * 0.4) + "px";
    }

    setInterval(() => {
      currentIndex = (currentIndex + 2) % cards.length;
      const nextA = cards[currentIndex % cards.length];
      const nextB = cards[(currentIndex + 1) % cards.length];

      slotA.className = "promo-card card-exit-left";
      slotB.className = "promo-card card-exit-right";

      setTimeout(() => {
        updateHeroCard(slotA, nextA);
        updateHeroCard(slotB, nextB);

        slotA.className = "promo-card card-enter-left";
        slotB.className = "promo-card card-enter-right";

        positionCards([slotA, slotB]);
      }, 460);
    }, Number(safeConfig("cardsRotationMs", 3500)) || 3500);
  }

  function createHeroCard(data, side) {
    const el = document.createElement("div");
    el.className = `promo-card card-enter-${side}`;
    el.innerHTML = heroCardHTML(data);
    return el;
  }

  function updateHeroCard(el, data) {
    el.innerHTML = heroCardHTML(data);
  }

  function heroCardHTML(d) {
    return `
      ${renderMedia(d, { className: "promo-card-media", placeholder: "🇧🇷" })}
      <div class="promo-card-body">
        ${d.selo ? `<span class="promo-card-selo">${escapeHTML(d.selo)}</span>` : ""}
        <div class="promo-card-title">${escapeHTML(d.titulo || "")}</div>
        <div class="promo-card-text">${escapeHTML(d.texto || d.descricao || "")}</div>
      </div>`;
  }

  // ==========================================================
  //  FORMAS DE TORCER — TODOS OS CARDS COM MÍDIA
  // ==========================================================

  function initFormasTorcer() {
    const grid = getEl("formas-torcer-grid");
    if (!grid) return;

    const formas = safeConfig("formasTorcer", []);
    if (!Array.isArray(formas) || !formas.length) {
      hideElement(document.querySelector('[data-section="mostrarComoTorcer"]'));
      return;
    }

    grid.innerHTML = formas.map((item, index) => {
      const btnClass = index === 0 ? "btn-primary" : "btn-secondary";

      return `
        <article class="torcer-card">
          ${renderMedia(item, { className: "torcer-media", placeholder: item.icone || "🇧🇷" })}

          <div class="torcer-content">
            <div class="torcer-icon">${escapeHTML(item.icone || "🇧🇷")}</div>
            <h3>${escapeHTML(item.titulo || "")}</h3>
            <p>${escapeHTML(item.texto || "")}</p>

            <button class="${btnClass}" type="button" data-action="forma-torcer" data-index="${index}">
              ${escapeHTML(item.botao || "Chamar no WhatsApp")}
            </button>
          </div>
        </article>`;
    }).join("");

    grid.querySelectorAll('[data-action="forma-torcer"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-index"));
        const item = formas[index];

        trackEvent("clique_forma_torcer", {
          titulo: item?.titulo,
          acao: item?.acao || "whatsapp",
        });

        if (item?.tipoEspecial === "bolao" || item?.modal === "bolao") {
          openBolaoModal();
          return;
        }

        if (item?.tipoEspecial === "reserva" || item?.modal === "reserva") {
          openReservationModal();
          return;
        }

        handleConfiguredAction(item, "forma_torcer");
      });
    });
  }

  function handleConfiguredAction(item, local) {
    const acao = item?.acao || "whatsapp";

    if (acao === "whatsapp") {
      openWhatsApp(item?.mensagemWhatsApp || item?.mensagem || safeConfig("whatsapp.mensagem", ""));
      return;
    }

    if (acao === "scroll") {
      scrollToHash(item?.scroll || "#campanha");
      return;
    }

    if (acao === "link" && item?.link) {
      window.open(item.link, "_blank", "noopener");
      return;
    }

    trackEvent("clique_cta", {
      local,
      acao,
      titulo: item?.titulo || "",
    });
  }

  // ==========================================================
  //  COMBOS E PROMOÇÕES — TODOS COM MÍDIA
  // ==========================================================

  function initCombos() {
    const grid = getEl("combos-grid");
    if (!grid) return;

    const combos = safeConfig("combos", []);
    if (!Array.isArray(combos) || !combos.length) {
      hideElement(document.querySelector('[data-section="mostrarCombos"]'));
      return;
    }

    grid.innerHTML = combos.map((combo, index) => offerCardHTML(combo, index, "combo")).join("");

    grid.querySelectorAll('[data-action="combo"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-index"));
        const combo = combos[index];

        trackEvent("clique_combo", {
          titulo: combo?.titulo,
          precoPromocional: combo?.precoPromocional,
        });

        openWhatsApp(combo?.mensagemWhatsApp || `Olá! Quero pedir o ${combo?.titulo || "combo da campanha"}.`);
      });
    });
  }

  function initPromocoes() {
    const grid = getEl("promocoes-grid");
    if (!grid) return;

    const promocoes = safeConfig("promocoes", []);
    if (!Array.isArray(promocoes) || !promocoes.length) {
      hideElement(document.querySelector('[data-section="mostrarPromocoes"]'));
      return;
    }

    grid.innerHTML = promocoes.map((promocao, index) => offerCardHTML(promocao, index, "promocao")).join("");

    grid.querySelectorAll('[data-action="promocao"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-index"));
        const promocao = promocoes[index];

        trackEvent("clique_promocao", {
          titulo: promocao?.titulo,
          precoPromocional: promocao?.precoPromocional,
        });

        handleConfiguredAction(promocao, "promocao");
      });
    });
  }

  function offerCardHTML(item, index, type) {
    const titulo = item.titulo || item.title || "";
    const descricao = item.descricao || item.texto || item.description || "";
    const selo = item.selo || "";
    const precoOriginal = item.precoOriginal || "";
    const precoPromocional = item.precoPromocional || "";
    const botao = item.botao || "Pedir no WhatsApp";

    return `
      <article class="offer-card">
        <div class="offer-media">
          ${selo ? `<span class="offer-selo">${escapeHTML(selo)}</span>` : ""}
          ${renderMedia(item, { className: "offer-media", placeholder: type === "combo" ? "🍕" : "🔥" }).replace('<div class="offer-media">', '').replace('</div>', '')}
        </div>

        <div class="offer-body">
          <h3>${escapeHTML(titulo)}</h3>
          <p>${escapeHTML(descricao)}</p>

          ${
            precoOriginal || precoPromocional
              ? `<div class="offer-prices">
                  ${precoOriginal ? `<span class="price-old">${escapeHTML(precoOriginal)}</span>` : ""}
                  ${precoPromocional ? `<span class="price-new">${escapeHTML(precoPromocional)}</span>` : ""}
                </div>`
              : ""
          }

          <button class="btn-primary" type="button" data-action="${type}" data-index="${index}">
            ${escapeHTML(botao)}
          </button>
        </div>
      </article>`;
  }

  // ==========================================================
  //  RETIRADA
  // ==========================================================

  function initRetirada() {
    const retirada = safeConfig("retirada", {});
    const section = document.querySelector('[data-section="mostrarRetirada"]');

    if (retirada.enabled === false) {
      hideElement(section);
      return;
    }

    setText("retirada-title", retirada.titulo || "Retire e Ganhe");
    setText(
      "retirada-text",
      retirada.texto || "Peça pelo WhatsApp, retire no balcão e ganhe desconto especial."
    );

    const benefitsEl = getEl("retirada-benefits");
    const beneficios = retirada.beneficios || [];

    if (benefitsEl && Array.isArray(beneficios)) {
      benefitsEl.innerHTML = beneficios.map((b) => `
        <article class="benefit-card">
          <div class="benefit-icon">${escapeHTML(b.icone || "✅")}</div>
          <h3>${escapeHTML(b.titulo || "")}</h3>
          <p>${escapeHTML(b.texto || "")}</p>
        </article>
      `).join("");
    }

    const btn = getEl("retirada-btn");
    if (btn) {
      const msg = retirada.mensagemWhatsApp || "Olá! Quero fazer meu pedido para retirada com desconto na campanha dos Jogos do Brasil.";
      btn.href = buildWhatsAppUrl(msg);
      btn.addEventListener("click", () => {
        trackEvent("clique_retirada", { local: "retire_e_ganhe" });
      });
    }

    const cardapioBtn = getEl("retirada-cardapio-btn");
    if (cardapioBtn) {
      const cardapio = safeConfig("cardapio", {});
      const cardapioEnabled = cardapio.enabled !== false;
      const cardapioUrl = cardapio.url || "";
      const cardapioTexto = retirada.cardapioTexto || cardapio.texto || "🍽️ Ver cardápio";

      if (!cardapioEnabled || !cardapioUrl) {
        hideElement(cardapioBtn);
      } else {
        cardapioBtn.textContent = cardapioTexto;
        cardapioBtn.href = cardapioUrl;
        cardapioBtn.target = "_blank";
        cardapioBtn.rel = "noopener";

        cardapioBtn.addEventListener("click", () => {
          trackEvent("clique_cardapio", {
            local: "retire_e_ganhe",
            url: cardapioUrl,
          });
        });
      }
    }
  }

  // ==========================================================
  //  BAR — TODOS OS CARDS COM MÍDIA
  // ==========================================================

  function initBar() {
    const bar = safeConfig("bar", {});
    const section = document.querySelector('[data-section="mostrarBar"]');

    if (bar.enabled === false) {
      hideElement(section);
      return;
    }

    setText("bar-title", bar.titulo || "Vai assistir no bar?");
    setText(
      "bar-subtitle",
      bar.descricao || "Reserve sua mesa, chame a galera e aproveite promoções especiais durante os jogos do Brasil."
    );

    const beneficios = Array.isArray(bar.beneficios) ? bar.beneficios : [];
    const benefitsEl = getEl("bar-benefits");

    if (benefitsEl) {
      benefitsEl.innerHTML = beneficios.map((b) => `
        <article class="bar-benefit-card">
          ${renderMedia(b, { className: "bar-benefit-media", placeholder: b.icone || "🍻" })}

          <div class="bar-benefit-body">
            <div class="benefit-icon">${escapeHTML(b.icone || "⭐")}</div>
            <h3>${escapeHTML(b.titulo || "")}</h3>
            <p>${escapeHTML(b.texto || "")}</p>
          </div>
        </article>
      `).join("");
    }

    const mainCard = getEl("bar-main-card");
    const cardData = bar.cardPrincipal || {
      titulo: "Garanta seu lugar antes da bola rolar",
      texto: "Ideal para bares, restaurantes e espaços com telão que querem transformar jogo em reserva, consumo e recorrência.",
      icone: "🏟️",
      botaoReserva: "Reservar mesa",
      botaoWhatsApp: "Chamar no WhatsApp",
      mensagemWhatsApp: bar.mensagemWhatsApp || "Olá! Quero assistir aos Jogos do Brasil no bar.",
    };

    if (mainCard) {
      mainCard.innerHTML = `
        ${renderMedia(cardData, { className: "bar-main-media", placeholder: cardData.icone || "🏟️" })}

        <div class="bar-main-body">
          <span class="bar-card-icon">${escapeHTML(cardData.icone || "🏟️")}</span>
          <h3>${escapeHTML(cardData.titulo || "")}</h3>
          <p>${escapeHTML(cardData.texto || "")}</p>

          <div class="bar-actions">
            <button id="bar-reserva-btn" class="btn-primary" type="button">
              ${escapeHTML(cardData.botaoReserva || "Reservar mesa")}
            </button>

            <a id="bar-whatsapp-btn" class="btn-secondary" href="${escapeAttr(buildWhatsAppUrl(cardData.mensagemWhatsApp))}" target="_blank" rel="noopener">
              ${escapeHTML(cardData.botaoWhatsApp || "Chamar no WhatsApp")}
            </a>
          </div>
        </div>
      `;

      const reservaBtn = getEl("bar-reserva-btn");
      if (reservaBtn) {
        reservaBtn.addEventListener("click", () => {
          trackEvent("clique_reservar_mesa", { local: "bar_card" });
          openReservationModal();
        });
      }

      const waBtn = getEl("bar-whatsapp-btn");
      if (waBtn) {
        waBtn.addEventListener("click", () => {
          trackEvent("clique_whatsapp", { local: "bar_card" });
        });
      }
    }
  }

  // ==========================================================
  //  CARD DE RESERVA + MODAL
  // ==========================================================

  function initReservationCard() {
    const wrap = getEl("reservation-card-wrap");
    if (!wrap) return;

    const reservas = safeConfig("reservas", {});
    if (reservas.enabled === false) {
      hideElement(document.querySelector('[data-section="mostrarReservas"]'));
      return;
    }

    setText("reserva-title", reservas.titulo || "Reserve sua mesa com desconto");
    setText(
      "reserva-subtitle",
      reservas.descricao || "Clique no card, informe dia, horário e quantidade de pessoas. O desconto será calculado automaticamente."
    );

    const card = reservas.card || {
      titulo: "Reserva com desconto automático",
      texto: "Informe o dia do jogo, horário e quantidade de pessoas. O sistema calcula o desconto antes de abrir o WhatsApp.",
      selo: "Reserva inteligente",
      icone: "📅",
      botao: "Reservar mesa",
      metas: ["Desconto por grupo", "WhatsApp automático", "Pronto para planilha"],
    };

    wrap.innerHTML = `
      <article class="single-feature-card" id="reservation-open-card" tabindex="0" role="button" aria-label="Abrir reserva de mesa">
        ${renderMedia(card, { className: "feature-card-media", placeholder: card.icone || "📅" })}

        <div class="feature-card-body">
          ${card.selo ? `<span class="feature-card-badge">${escapeHTML(card.selo)}</span>` : ""}
          <h3>${escapeHTML(card.titulo || "")}</h3>
          <p>${escapeHTML(card.texto || "")}</p>

          ${
            Array.isArray(card.metas)
              ? `<div class="feature-card-meta">
                  ${card.metas.map((m) => `<span>${escapeHTML(m)}</span>`).join("")}
                </div>`
              : ""
          }

          <button class="btn-primary" type="button">
            ${escapeHTML(card.botao || "Reservar mesa")}
          </button>
        </div>
      </article>
    `;

    const openCard = getEl("reservation-open-card");
    if (openCard) {
      openCard.addEventListener("click", openReservationModal);
      openCard.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openReservationModal();
        }
      });
    }
  }

  function openReservationModal() {
    openModal("reservation-modal");
    trackEvent("modal_reserva_aberto", { local: "card_reserva" });
  }

  function initReservations() {
    const form = getEl("reservation-form");
    if (!form) return;

    const discounts = safeConfig("reservationDiscounts", []);
    const pessoasInput = getEl("reserva-pessoas");
    const resultEl = getEl("reservation-discount-result");

    populateSelectWithGames("reserva-jogo", safeConfig("jogos", []));

    function findDiscount(qtd) {
      if (!Array.isArray(discounts)) return null;

      return discounts.find((rule) => {
        const min = Number(rule.minPeople || 0);
        const max = Number(rule.maxPeople || 999);
        return qtd >= min && qtd <= max;
      });
    }

    function updateDiscountMessage() {
      const qtd = Number(pessoasInput?.value || 0);

      if (!resultEl) return null;

      if (!qtd || qtd <= 0) {
        resultEl.textContent = "Informe a quantidade de pessoas para calcular o desconto.";
        return null;
      }

      const rule = findDiscount(qtd);

      if (!rule) {
        resultEl.textContent = "Reserva sem desconto configurado para essa quantidade de pessoas.";
        return null;
      }

      const discount = Number(rule.discount || 0);
      const label = rule.label || `${discount}% de desconto`;

      if (discount > 0) {
        resultEl.textContent = `Você ganhou ${discount}% de desconto para sua reserva. ${label}`;
      } else {
        resultEl.textContent = label || "Sem desconto para essa quantidade de pessoas.";
      }

      return rule;
    }

    if (pessoasInput) {
      pessoasInput.addEventListener("input", updateDiscountMessage);
      pessoasInput.addEventListener("change", updateDiscountMessage);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const nome = String(data.get("nome") || "");
      const whatsapp = String(data.get("whatsapp") || "");
      const jogo = String(data.get("jogo") || "");
      const horario = String(data.get("horario") || "");
      const pessoas = Number(data.get("pessoas") || 0);
      const observacao = String(data.get("observacao") || "");
      const desconto = updateDiscountMessage();

      const payload = {
        tipo: "reserva",
        nome,
        whatsapp,
        jogo,
        horario,
        pessoas,
        observacao,
        desconto: desconto
          ? {
              label: desconto.label,
              discount: desconto.discount,
              minPeople: desconto.minPeople,
              maxPeople: desconto.maxPeople,
            }
          : null,
      };

      integracoes.n8n("envio_reserva", payload);
      integracoes.appsScript(payload);

      trackEvent("envio_reserva", payload);

      const descontoTexto = desconto
        ? `${desconto.discount || 0}% — ${desconto.label || "Desconto configurado"}`
        : "Sem desconto calculado";

      const message =
        `Olá! Quero fazer uma reserva para os Jogos do Brasil.\n\n` +
        `Nome: ${nome}\n` +
        `WhatsApp: ${whatsapp}\n` +
        `Jogo/Data: ${jogo}\n` +
        `Horário: ${horario}\n` +
        `Quantidade de pessoas: ${pessoas}\n` +
        `Desconto calculado: ${descontoTexto}\n` +
        `${observacao ? `Observação: ${observacao}\n` : ""}`;

      openWhatsApp(message);
    });
  }

  // ==========================================================
  //  CARD DO BOLÃO + MODAL COM 2 COMBOS
  // ==========================================================

  let selectedBolaoCombo = null;

  function initBolaoCard() {
    const wrap = getEl("bolao-card-wrap");
    if (!wrap) return;

    const bolao = safeConfig("bolao", {});
    if (bolao.enabled === false) {
      hideElement(document.querySelector('[data-section="mostrarBolao"]'));
      return;
    }

    setText("bolao-title", bolao.titulo || "Bolão do Hexa");
    setText(
      "bolao-subtitle",
      bolao.descricao || "Clique no card, escolha um combo participante e envie seu palpite."
    );

    const card = bolao.card || {
      titulo: "Bolão do Hexa",
      texto: "Peça um dos combos participantes, envie seu palpite e concorra a prêmios especiais.",
      selo: "Participação promocional",
      icone: "🏆",
      botao: "Participar do bolão",
      metas: ["Sem aposta em dinheiro", "Válido com pedido", "Prêmio especial"],
    };

    wrap.innerHTML = `
      <article class="single-feature-card" id="bolao-open-card" tabindex="0" role="button" aria-label="Abrir bolão promocional">
        ${renderMedia(card, { className: "feature-card-media", placeholder: card.icone || "🏆" })}

        <div class="feature-card-body">
          ${card.selo ? `<span class="feature-card-badge">${escapeHTML(card.selo)}</span>` : ""}
          <h3>${escapeHTML(card.titulo || "")}</h3>
          <p>${escapeHTML(card.texto || "")}</p>

          ${
            Array.isArray(card.metas)
              ? `<div class="feature-card-meta">
                  ${card.metas.map((m) => `<span>${escapeHTML(m)}</span>`).join("")}
                </div>`
              : ""
          }

          <button class="btn-primary" type="button">
            ${escapeHTML(card.botao || "Participar do bolão")}
          </button>
        </div>
      </article>
    `;

    const openCard = getEl("bolao-open-card");
    if (openCard) {
      openCard.addEventListener("click", openBolaoModal);
      openCard.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBolaoModal();
        }
      });
    }
  }

  function openBolaoModal() {
    selectedBolaoCombo = null;
    showElement(getEl("bolao-combo-step"));
    hideElement(getEl("bolao-form-step"));
    renderBolaoCombos();
    openModal("bolao-modal");

    trackEvent("modal_bolao_aberto", { local: "card_bolao" });
  }

  function renderBolaoCombos() {
    const grid = getEl("bolao-combo-grid");
    if (!grid) return;

    const bolao = safeConfig("bolao", {});
    const combosParticipantes = Array.isArray(bolao.combosParticipantes) && bolao.combosParticipantes.length
      ? bolao.combosParticipantes.slice(0, 2)
      : safeConfig("combos", []).slice(0, 2);

    grid.innerHTML = combosParticipantes.map((combo, index) => `
      <article class="bolao-combo-card" tabindex="0" role="button" data-action="select-bolao-combo" data-index="${index}">
        ${renderMedia(combo, { className: "bolao-combo-media", placeholder: "🍕" })}

        <div class="bolao-combo-body">
          <h3>${escapeHTML(combo.titulo || combo.title || "")}</h3>
          <p>${escapeHTML(combo.descricao || combo.texto || "")}</p>

          ${
            combo.precoOriginal || combo.precoPromocional
              ? `<div class="bolao-combo-price">
                  ${combo.precoOriginal ? `<span class="price-old">${escapeHTML(combo.precoOriginal)}</span>` : ""}
                  ${combo.precoPromocional ? `<span class="price-new">${escapeHTML(combo.precoPromocional)}</span>` : ""}
                </div>`
              : ""
          }

          <button class="btn-primary" type="button">
            Escolhi este combo
          </button>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll('[data-action="select-bolao-combo"]').forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.getAttribute("data-index"));
        selectBolaoCombo(combosParticipantes[index]);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const index = Number(card.getAttribute("data-index"));
          selectBolaoCombo(combosParticipantes[index]);
        }
      });
    });
  }

  function selectBolaoCombo(combo) {
    selectedBolaoCombo = combo;

    hideElement(getEl("bolao-combo-step"));
    showElement(getEl("bolao-form-step"));

    const box = getEl("selected-bolao-combo");
    if (box) {
      box.innerHTML = `
        Combo selecionado: <strong>${escapeHTML(combo?.titulo || combo?.title || "Combo participante")}</strong>
        ${combo?.precoPromocional ? ` • ${escapeHTML(combo.precoPromocional)}` : ""}
      `;
    }

    trackEvent("bolao_combo_selecionado", {
      combo: combo?.titulo || combo?.title || "",
    });
  }

  function initBolao() {
    const bolao = safeConfig("bolao", {});
    const form = getEl("bolao-form");

    setText("bolao-premio", bolao.premioPrincipal || "Combo grátis");

    const rulesEl = getEl("bolao-rules");
    const regras = Array.isArray(bolao.regras)
      ? bolao.regras
      : [
          "Participação válida para pedidos ou reservas feitos antes do jogo.",
          "Acertou o placar exato: concorre ao prêmio principal.",
          "Acertou o vencedor: pode ganhar cupom ou benefício menor.",
          "A promoção pode variar conforme a loja.",
          "Essa ação é promocional e não envolve aposta em dinheiro.",
        ];

    if (rulesEl) {
      rulesEl.innerHTML = regras.map((r) => `<li>${escapeHTML(r)}</li>`).join("");
    }

    populateSelectWithGames("bolao-jogo", bolao.jogos || safeConfig("jogos", []));

    const changeComboBtn = getEl("bolao-change-combo");
    if (changeComboBtn) {
      changeComboBtn.addEventListener("click", () => {
        selectedBolaoCombo = null;
        showElement(getEl("bolao-combo-step"));
        hideElement(getEl("bolao-form-step"));
      });
    }

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!selectedBolaoCombo) {
        alert("Escolha um combo participante antes de enviar seu palpite.");
        showElement(getEl("bolao-combo-step"));
        hideElement(getEl("bolao-form-step"));
        return;
      }

      const data = new FormData(form);

      const payload = {
        tipo: "bolao",
        nome: String(data.get("nome") || ""),
        whatsapp: String(data.get("whatsapp") || ""),
        jogo: String(data.get("jogo") || ""),
        palpite: String(data.get("palpite") || ""),
        pedidoRealizado: String(data.get("pedidoRealizado") || ""),
        observacao: String(data.get("observacao") || ""),
        comboSelecionado: selectedBolaoCombo?.titulo || selectedBolaoCombo?.title || "",
        premioPrincipal: bolao.premioPrincipal || "",
      };

      const success = getEl("bolao-success");
      if (success) {
        success.textContent = "Palpite preparado com sucesso! Vamos abrir o WhatsApp para confirmar sua participação.";
        success.classList.remove("hidden");
      }

      integracoes.n8n("envio_bolao", payload);
      integracoes.appsScript(payload);

      trackEvent("envio_bolao", payload);

      const abrirWhatsApp = typeof bolao.abrirWhatsApp === "boolean" ? bolao.abrirWhatsApp : true;

      if (abrirWhatsApp) {
        const msg =
          `Olá! Quero participar do Bolão do Hexa.\n\n` +
          `Nome: ${payload.nome}\n` +
          `WhatsApp: ${payload.whatsapp}\n` +
          `Combo participante: ${payload.comboSelecionado}\n` +
          `Jogo: ${payload.jogo}\n` +
          `Palpite: ${payload.palpite}\n` +
          `Pedido realizado: ${payload.pedidoRealizado}\n` +
          `${payload.observacao ? `Observação: ${payload.observacao}\n` : ""}`;

        openWhatsApp(msg);
      }
    });
  }

  // ==========================================================
  //  BOLÃO DA MESA — PRESENCIAL COM GARÇOM
  //  Segundo fluxo de bolão, separado do bolão online.
  //  Envia tipoBolao: "presencial_mesa" para n8n / Apps Script / WhatsApp.
  // ==========================================================

  function initBolaoMesaCard() {
    const section = document.querySelector('[data-section="mostrarBolaoMesa"]');
    const wrap = getEl("bolao-mesa-card-wrap");
    const panel = getEl("bolao-mesa-panel");
    const config = safeConfig("bolaoMesa", {});

    if (!section || !wrap) return;

    if (config.enabled === false) {
      hideElement(section);
      return;
    }

    setText("bolao-mesa-kicker", config.kicker || "🍺 Bolão presencial");
    setText("bolao-mesa-title", config.titulo || "Bolão da Mesa");
    setText(
      "bolao-mesa-subtitle",
      config.descricao || "Está no bar? Peça o combo participante com o garçom, registre seu palpite e concorra a um prêmio especial da casa."
    );

    const card = config.card || {
      titulo: "Participe com o garçom",
      texto: "Peça um combo participante, registre seu palpite na mesa e acompanhe a torcida com mais emoção.",
      selo: "Presencial no bar",
      icone: "🍺",
      botao: "Registrar palpite da mesa",
      metas: ["Mesa identificada", "Garçom responsável", "Registro na planilha"],
    };

    wrap.innerHTML = `
      <article class="single-feature-card" id="bolao-mesa-open-card" tabindex="0" role="button" aria-label="Abrir bolão da mesa">
        ${renderMedia(card, { className: "feature-card-media", placeholder: card.icone || "🍺" })}

        <div class="feature-card-body">
          ${card.selo ? `<span class="feature-card-badge">${escapeHTML(card.selo)}</span>` : ""}
          <h3>${escapeHTML(card.titulo || "")}</h3>
          <p>${escapeHTML(card.texto || "")}</p>

          ${
            Array.isArray(card.metas)
              ? `<div class="feature-card-meta">
                  ${card.metas.map((m) => `<span>${escapeHTML(m)}</span>`).join("")}
                </div>`
              : ""
          }

          <button class="btn-primary" type="button">
            ${escapeHTML(card.botao || "Registrar palpite da mesa")}
          </button>
        </div>
      </article>
    `;

    const painel = config.painel || {};
    if (panel) {
      const passos = Array.isArray(painel.passos) && painel.passos.length
        ? painel.passos
        : [
            { titulo: "1. Cliente pede o combo", texto: "O garçom oferece o combo participante para a mesa." },
            { titulo: "2. Palpite é registrado", texto: "Mesa, garçom, WhatsApp e placar ficam organizados." },
            { titulo: "3. Resultado é conferido", texto: "Depois do jogo, a equipe confere os vencedores na planilha." },
          ];

      panel.innerHTML = `
        <div class="bolao-mesa-panel-content">
          <span class="bolao-mesa-selo">${escapeHTML(painel.selo || "Organização presencial")}</span>
          <h3>${escapeHTML(painel.titulo || "Um bolão para quem está vivendo o jogo dentro do bar")}</h3>
          <p>${escapeHTML(painel.texto || "O garçom registra a mesa, o combo consumido, o palpite e o WhatsApp do cliente para organizar tudo na planilha.")}</p>

          <div class="bolao-mesa-steps">
            ${passos.map((p, index) => `
              <div class="bolao-mesa-step">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>${escapeHTML(p.titulo || "Etapa")}</strong>
                  <small>${escapeHTML(p.texto || "")}</small>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="bolao-mesa-combo-box">
            <span>Combo participante sugerido</span>
            <strong>${escapeHTML(painel.comboTitulo || "Combo Balde da Torcida")}</strong>
            <small>${escapeHTML(painel.comboDescricao || "Balde de cerveja + porção para compartilhar durante o jogo.")}</small>
          </div>

          <button class="btn-primary" type="button" id="bolao-mesa-panel-btn">
            ${escapeHTML(painel.botao || card.botao || "Registrar palpite agora")}
          </button>
        </div>
      `;
    }

    const openCard = getEl("bolao-mesa-open-card");
    if (openCard) {
      openCard.addEventListener("click", openBolaoMesaModal);
      openCard.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBolaoMesaModal();
        }
      });
    }

    const panelBtn = getEl("bolao-mesa-panel-btn");
    if (panelBtn) {
      panelBtn.addEventListener("click", openBolaoMesaModal);
    }
  }

  function openBolaoMesaModal() {
    openModal("bolao-mesa-modal");
    trackEvent("modal_bolao_mesa_aberto", { local: "bolao_da_mesa" });
  }

  function populateBolaoMesaCombos() {
    const select = getEl("bolao-mesa-combo");
    if (!select) return;

    const config = safeConfig("bolaoMesa", {});
    const combos = Array.isArray(config.combosParticipantes) && config.combosParticipantes.length
      ? config.combosParticipantes
      : [
          { titulo: "Combo Balde da Torcida", descricao: "Balde de cerveja + porção da casa", valor: "Consulte" },
          { titulo: "Combo Mesa Campeã", descricao: "Combo participante do bolão presencial", valor: "Consulte" },
        ];

    let html = `<option value="">Selecione o combo</option>`;
    combos.forEach((combo) => {
      const titulo = combo.titulo || combo.title || "Combo participante";
      const valor = combo.valor || combo.precoPromocional || "";
      const label = `${titulo}${valor ? ` • ${valor}` : ""}`;
      html += `<option value="${escapeAttr(label)}">${escapeHTML(label)}</option>`;
    });

    select.innerHTML = html;
  }

  function normalizeBolaoMesaKeyPart(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  function parseBolaoMesaGameDateTime(gameLabel, config) {
    const label = String(gameLabel || "");
    const ano = Number(config.anoBase || safeConfig("anoBase", 2026) || new Date().getFullYear());
    const dateMatch = label.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    const timeMatch = label.match(/(\d{1,2})\s*h(?:\s*(\d{1,2}))?/i);

    if (!dateMatch || !timeMatch) return null;

    const day = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    let year = dateMatch[3] ? Number(dateMatch[3]) : ano;
    if (year < 100) year += 2000;

    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2] || 0);

    if (!day || !month || Number.isNaN(hour)) return null;
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  function getBolaoMesaStorageKey(payload) {
    const base = safeConfig("bolaoMesa.storageKey", "movaBolaoMesaControleV1");
    const mesa = normalizeBolaoMesaKeyPart(payload.numeroMesa);
    const comanda = normalizeBolaoMesaKeyPart(payload.numeroComanda);
    const jogo = normalizeBolaoMesaKeyPart(payload.jogo);
    return `${base}:${jogo}:${mesa}:${comanda}`;
  }

  function getBolaoMesaLocalRecord(payload) {
    try {
      const raw = localStorage.getItem(getBolaoMesaStorageKey(payload));
      if (!raw) return { count: 0, registros: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return { count: 0, registros: [] };
      return {
        count: Number(parsed.count || 0),
        registros: Array.isArray(parsed.registros) ? parsed.registros : [],
      };
    } catch (e) {
      return { count: 0, registros: [] };
    }
  }

  function saveBolaoMesaLocalRecord(payload, record) {
    try {
      localStorage.setItem(getBolaoMesaStorageKey(payload), JSON.stringify(record));
    } catch (e) {}
  }

  function buildBolaoMesaStatusMessage(config) {
    const maxPalpites = Number(config.maxPalpitesPorMesa || 2);
    const minutos = Number(config.bloquearMinutosAntes || 10);
    return `Regra: até ${maxPalpites} palpites por mesa/comanda. O envio encerra ${minutos} minutos antes do jogo. O palpite entra como pendente até conferência da comanda.`;
  }

  function initBolaoMesa() {
    const form = getEl("bolao-mesa-form");
    const config = safeConfig("bolaoMesa", {});

    setText("bolao-mesa-premio", config.premioPrincipal || "Combo especial da casa");
    setText(
      "bolao-mesa-modal-description",
      config.modalDescricao || "Comprou um combo participante? Preencha seus dados, informe mesa e comanda, envie seu palpite e aguarde validação do estabelecimento."
    );

    populateSelectWithGames("bolao-mesa-jogo", config.jogos || safeConfig("jogos", []));
    populateBolaoMesaCombos();

    const rulesEl = getEl("bolao-mesa-rules");
    const regras = Array.isArray(config.regras) && config.regras.length
      ? config.regras
      : [
          "Cada mesa pode registrar no máximo 2 palpites por jogo.",
          "O palpite só pode ser enviado até 10 minutos antes do início do jogo.",
          "O cliente preenche o palpite pelo celular após comprar um combo participante.",
          "O combo precisa estar marcado na comanda da mesa.",
          "O registro entra como pendente de validação e o estabelecimento confere pela comanda.",
          "Essa ação é promocional e não envolve aposta em dinheiro.",
        ];

    if (rulesEl) {
      rulesEl.innerHTML = regras.map((r) => `<li>${escapeHTML(r)}</li>`).join("");
    }

    const limitEl = getEl("bolao-mesa-limit-result");
    if (limitEl) limitEl.textContent = buildBolaoMesaStatusMessage(config);

    if (!form) return;

    const mesaInput = getEl("bolao-mesa-numero");
    const comandaInput = getEl("bolao-mesa-comanda");
    const jogoInput = getEl("bolao-mesa-jogo");
    const qtdInput = getEl("bolao-mesa-qtd-combos");

    function updateMesaLimitPreview() {
      if (!limitEl) return;

      const maxPalpites = Number(config.maxPalpitesPorMesa || 2);
      const minutos = Number(config.bloquearMinutosAntes || 10);
      const qtdCombos = Math.max(1, Math.min(maxPalpites, Number(qtdInput?.value || 1)));
      const fakePayload = {
        numeroMesa: mesaInput?.value || "",
        numeroComanda: comandaInput?.value || "",
        jogo: jogoInput?.value || "",
      };

      let message = `Esta mesa pode usar até ${maxPalpites} palpites por jogo. Combos informados agora: ${qtdCombos}. Envie 1 palpite por vez.`;

      if (fakePayload.numeroMesa && fakePayload.numeroComanda && fakePayload.jogo) {
        const record = getBolaoMesaLocalRecord(fakePayload);
        const remaining = Math.max(0, maxPalpites - record.count);
        message += ` Neste aparelho, já foram enviados ${record.count}/${maxPalpites} palpites para essa mesa/comanda. Restam ${remaining}.`;
      }

      const gameDate = parseBolaoMesaGameDateTime(fakePayload.jogo, config);
      if (gameDate) {
        const closeAt = new Date(gameDate.getTime() - minutos * 60 * 1000);
        message += ` Corte do palpite: ${closeAt.toLocaleDateString("pt-BR")} às ${closeAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`;
      } else {
        message += ` O envio encerra ${minutos} minutos antes do jogo.`;
      }

      limitEl.textContent = message;
    }

    [mesaInput, comandaInput, jogoInput, qtdInput].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", updateMesaLimitPreview);
      el.addEventListener("change", updateMesaLimitPreview);
    });

    updateMesaLimitPreview();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const maxPalpites = Number(config.maxPalpitesPorMesa || 2);
      const minutosBloqueio = Number(config.bloquearMinutosAntes || 10);
      const quantidadeCombos = Math.max(1, Math.min(maxPalpites, Number(data.get("quantidadeCombos") || 1)));

      const payload = {
        tipo: "bolao",
        tipoBolao: "presencial_mesa",
        origem: "cliente_qrcode_mesa",
        status: config.statusInicial || "pendente_validacao",
        validacao: config.validacao || "manual_por_comanda",
        regra: config.regraOperacional || "max_2_palpites_por_mesa_validacao_por_comanda",
        nome: String(data.get("nome") || ""),
        whatsapp: String(data.get("whatsapp") || ""),
        numeroMesa: String(data.get("numeroMesa") || ""),
        numeroComanda: String(data.get("numeroComanda") || ""),
        garcom: String(data.get("garcom") || ""),
        jogo: String(data.get("jogo") || ""),
        comboSelecionado: String(data.get("comboSelecionado") || ""),
        quantidadeCombos,
        palpitesLiberados: Math.min(quantidadeCombos, maxPalpites),
        maxPalpitesPorMesa: maxPalpites,
        palpite: String(data.get("palpite") || ""),
        comboMarcadoNaComanda: String(data.get("comboMarcadoNaComanda") || ""),
        confirmacaoComanda: String(data.get("confirmacaoComanda") || ""),
        observacao: String(data.get("observacao") || ""),
        premioPrincipal: config.premioPrincipal || "",
        limiteEnvioMinutosAntes: minutosBloqueio,
      };

      const gameDate = parseBolaoMesaGameDateTime(payload.jogo, config);
      if (gameDate) {
        const closeAt = new Date(gameDate.getTime() - minutosBloqueio * 60 * 1000);
        payload.jogoInicioEstimado = gameDate.toISOString();
        payload.palpiteFechaEm = closeAt.toISOString();

        if (Date.now() >= closeAt.getTime()) {
          if (limitEl) {
            limitEl.textContent = `Palpites encerrados para este jogo. O envio só é válido até ${minutosBloqueio} minutos antes da bola rolar.`;
          }

          trackEvent("bolao_mesa_bloqueado_horario", payload);
          alert(`Palpites encerrados para este jogo. O envio só é válido até ${minutosBloqueio} minutos antes da bola rolar.`);
          return;
        }
      }

      if (payload.comboMarcadoNaComanda !== "Sim" || payload.confirmacaoComanda !== "Sim") {
        alert("Para enviar, confirme que o combo participante está marcado na comanda. O palpite ficará pendente de validação.");
        return;
      }

      const record = getBolaoMesaLocalRecord(payload);
      if (record.count >= maxPalpites) {
        if (limitEl) {
          limitEl.textContent = `Limite atingido: esta mesa/comanda já registrou ${record.count}/${maxPalpites} palpites neste aparelho para este jogo.`;
        }

        trackEvent("bolao_mesa_limite_atingido", payload);
        alert(`Limite atingido: máximo de ${maxPalpites} palpites por mesa/comanda.`);
        return;
      }

      payload.palpiteNumero = record.count + 1;
      payload.palpitesRestantesNesteAparelho = Math.max(0, maxPalpites - payload.palpiteNumero);

      const newRecord = {
        count: payload.palpiteNumero,
        maxPalpites,
        updatedAt: new Date().toISOString(),
        registros: [
          ...record.registros,
          {
            palpite: payload.palpite,
            nome: payload.nome,
            whatsapp: payload.whatsapp,
            jogo: payload.jogo,
            enviadoEm: new Date().toISOString(),
          },
        ],
      };
      saveBolaoMesaLocalRecord(payload, newRecord);

      const success = getEl("bolao-mesa-success");
      if (success) {
        success.textContent = `Palpite enviado como pendente de validação. Registro ${payload.palpiteNumero}/${maxPalpites} para esta mesa/comanda neste aparelho.`;
        success.classList.remove("hidden");
      }

      if (limitEl) {
        limitEl.textContent = `Palpite ${payload.palpiteNumero}/${maxPalpites} enviado. O estabelecimento ainda vai validar se o combo consta na comanda.`;
      }

      integracoes.n8n("envio_bolao_presencial", payload);
      integracoes.appsScript(payload);

      trackEvent("envio_bolao_presencial", payload);

      const abrirWhatsApp = typeof config.abrirWhatsApp === "boolean" ? config.abrirWhatsApp : true;

      if (abrirWhatsApp) {
        const msg =
          `[BOLÃO DA MESA — PENDENTE DE VALIDAÇÃO]\n\n` +
          `Nome: ${payload.nome}\n` +
          `WhatsApp: ${payload.whatsapp}\n` +
          `Mesa: ${payload.numeroMesa}\n` +
          `Comanda: ${payload.numeroComanda}\n` +
          `${payload.garcom ? `Garçom que avisou: ${payload.garcom}\n` : ""}` +
          `Combo comprado: ${payload.comboSelecionado}\n` +
          `Quantidade de combos na mesa: ${payload.quantidadeCombos}\n` +
          `Palpite número: ${payload.palpiteNumero}/${payload.maxPalpitesPorMesa}\n` +
          `Jogo: ${payload.jogo}\n` +
          `Palpite: ${payload.palpite}\n\n` +
          `Status: ${payload.status}\n` +
          `Validação: conferir se o combo está marcado na comanda.\n` +
          `Regra: máximo de ${payload.maxPalpitesPorMesa} palpites por mesa e envio até ${payload.limiteEnvioMinutosAntes} minutos antes do jogo.\n` +
          `${payload.observacao ? `Observação: ${payload.observacao}\n` : ""}`;

        openWhatsApp(msg);
      }
    });
  }

  // ==========================================================
  //  REELS
  // ==========================================================

  function initReels() {
    const grid = getEl("reels-grid");
    if (!grid) return;

    if (grid._reelsRaf) {
      cancelAnimationFrame(grid._reelsRaf);
      grid._reelsRaf = null;
    }

    const reels = safeConfig("reels", []);
    if (!Array.isArray(reels) || !reels.length) {
      hideElement(document.querySelector('[data-section="mostrarReels"]'));
      return;
    }

    const reelsConfig = safeConfig("reelsConfig", {});
    const configuredSpeed = Number(reelsConfig.speedSeconds || 34);
    const speed = Math.min(Math.max(configuredSpeed, 12), 90);
    const renderList = [...reels, ...reels, ...reels];

    grid.classList.add("reels-carousel");
    grid.style.setProperty("--reels-speed", `${speed}s`);
    grid.innerHTML = `
      <div class="reels-track" id="reels-track">
        ${renderList.map((reel, index) => reelCardHTML(reel, index % reels.length)).join("")}
      </div>`;

    const track = getEl("reels-track");
    if (!track) return;

    grid.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(() => {});
    });

    function closeOpenProductCards() {
      grid.querySelectorAll(".reel-card.is-product-open").forEach((card) => {
        card.classList.remove("is-product-open");
        const productCard = card.querySelector(".reel-product-card");
        if (productCard) productCard.setAttribute("aria-hidden", "true");
      });
      grid.classList.remove("is-reel-paused");
    }

    grid.querySelectorAll('[data-action="like-reel"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("active");
        const index = Number(btn.getAttribute("data-index"));
        const reel = reels[index];

        trackEvent("curtida_reel", {
          titulo: reel?.title || reel?.titulo,
          curtido: btn.classList.contains("active"),
        });
      });
    });

    grid.querySelectorAll('[data-action="share-reel"]').forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const index = Number(btn.getAttribute("data-index"));
        const reel = reels[index];
        const title = reel?.title || reel?.titulo || "Campanha Jogos do Brasil";
        const text = reel?.description || reel?.descricao || "Veja essa campanha especial dos Jogos do Brasil.";
        const url = window.location.href;

        trackEvent("compartilhamento_reel", { titulo: title });

        try {
          if (navigator.share) {
            await navigator.share({ title, text, url });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            btn.textContent = "Copiado!";
            setTimeout(() => {
              btn.textContent = "↗️";
            }, 1600);
          }
        } catch (e) {}
      });
    });

    grid.querySelectorAll('[data-action="cta-reel"], [data-action="product-reel-cta"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = Number(btn.getAttribute("data-index"));
        const reel = reels[index];
        const produto = reel?.produto || {};

        trackEvent("clique_reel", {
          titulo: reel?.title || reel?.titulo,
          cta: reel?.ctaText || produto?.botao,
        });

        openWhatsApp(
          produto?.mensagemWhatsApp ||
          reel?.whatsappMessage ||
          "Olá! Vi o reel da campanha e quero saber mais."
        );
      });
    });

    grid.querySelectorAll(".reel-card").forEach((card) => {
      card.addEventListener("click", () => {
        const wasOpen = card.classList.contains("is-product-open");
        closeOpenProductCards();

        if (!wasOpen) {
          card.classList.add("is-product-open");
          grid.classList.add("is-reel-paused");
          const productCard = card.querySelector(".reel-product-card");
          if (productCard) productCard.setAttribute("aria-hidden", "false");

          trackEvent("reel_produto_aberto", {
            titulo: card.getAttribute("data-title") || "",
          });
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("#reels-grid")) return;
      closeOpenProductCards();
    });

    /*
      Carrossel real dos reels: usa RAF e largura medida da primeira cópia.
      Isso mantém os reels passando em desktop e mobile sem depender de CSS.
    */
    let offset = 0;
    let lastTime = performance.now();

    function getLoopWidth() {
      const cards = Array.from(track.querySelectorAll(".reel-card"));
      const originalCards = cards.slice(0, reels.length);
      if (!originalCards.length) return 0;

      const first = originalCards[0].getBoundingClientRect();
      const last = originalCards[originalCards.length - 1].getBoundingClientRect();
      const trackLeft = track.getBoundingClientRect().left;
      return (last.right - trackLeft) - (first.left - trackLeft) + 18;
    }

    function animate(now) {
      const loopWidth = getLoopWidth();
      const delta = now - lastTime;
      lastTime = now;

      if (!grid.classList.contains("is-reel-paused") && loopWidth > 0) {
        const pixelsPerMs = loopWidth / (speed * 1000);
        offset = (offset + delta * pixelsPerMs) % loopWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      grid._reelsRaf = requestAnimationFrame(animate);
    }

    grid.addEventListener("mouseenter", () => grid.classList.add("is-reel-paused"));
    grid.addEventListener("mouseleave", () => {
      if (!grid.querySelector(".reel-card.is-product-open")) {
        grid.classList.remove("is-reel-paused");
        lastTime = performance.now();
      }
    });

    window.addEventListener("resize", () => {
      offset = 0;
      lastTime = performance.now();
      track.style.transform = "translate3d(0,0,0)";
    }, { passive: true });

    grid._reelsRaf = requestAnimationFrame(animate);
  }

  function reelCardHTML(reel, index) {
    const title = reel.title || reel.titulo || "";
    const description = reel.description || reel.descricao || "";
    const ctaText = reel.ctaText || "Pedir agora";
    const produto = reel.produto || {};
    const productName = produto.nome || reel.produtoNome || title || "Oferta especial";
    const productDescription = produto.descricao || reel.produtoDescricao || description || "Oferta especial para os Jogos do Brasil.";
    const productPrice = produto.valor || reel.valor || reel.preco || "Consulte";
    const productImage = produto.imagem || reel.produtoImagem || "";
    const productCta = produto.botao || ctaText || "Pedir no WhatsApp";

    let media = "";
    const normalized = normalizeMedia(reel);

    if (normalized.type === "youtube" && normalized.src) {
      media = `
        <iframe
          src="https://www.youtube.com/embed/${escapeAttr(normalized.src)}?rel=0&modestbranding=1"
          title="${escapeAttr(title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    } else if ((normalized.type === "local" || normalized.type === "external" || normalized.type === "video") && normalized.src) {
      media = `<video src="${escapeAttr(normalized.src)}" muted loop playsinline preload="metadata"></video>`;
    } else if (normalized.src) {
      media = `<img src="${escapeAttr(normalized.src)}" alt="${escapeAttr(title)}" loading="lazy" />`;
    } else {
      media = `<div class="reel-placeholder">🎬</div>`;
    }

    return `
      <article class="reel-card" data-title="${escapeAttr(title)}" tabindex="0" role="button" aria-label="Abrir oferta do reel ${escapeAttr(title)}">
        <div class="reel-phone">
          ${media}
          <div class="reel-overlay-info">
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(description)}</p>
          </div>
        </div>

        <div class="reel-product-card" aria-hidden="true">
          <div class="reel-product-img">
            ${productImage ? `<img src="${escapeAttr(productImage)}" alt="${escapeAttr(productName)}" loading="lazy" />` : "🇧🇷"}
          </div>
          <div class="reel-product-info">
            <h4>${escapeHTML(productName)}</h4>
            <p>${escapeHTML(productDescription)}</p>
            <span class="reel-product-price">${escapeHTML(productPrice)}</span>
          </div>
          <button class="reel-product-cta" type="button" data-action="product-reel-cta" data-index="${index}">
            ${escapeHTML(productCta)}
          </button>
        </div>

        <div class="reel-actions">
          <button class="reel-action" type="button" data-action="like-reel" data-index="${index}" aria-label="Curtir reel">
            ❤️
          </button>

          <button class="reel-action" type="button" data-action="share-reel" data-index="${index}" aria-label="Compartilhar reel">
            ↗️
          </button>

          <button class="reel-action" type="button" data-action="cta-reel" data-index="${index}" aria-label="${escapeAttr(ctaText)}">
            💬
          </button>

          <button class="reel-cta" type="button" data-action="cta-reel" data-index="${index}">
            ${escapeHTML(ctaText)}
          </button>
        </div>
      </article>`;
  }


  // ==========================================================
  //  DÚVIDAS E QUEBRA DE OBJEÇÕES
  // ==========================================================

  function initDuvidasObjecoes() {
    const section = document.querySelector('[data-section="mostrarDuvidasObjecoes"]');
    const config = safeConfig("duvidasObjecoes", {});

    if (!section) return;

    if (config.enabled === false) {
      hideElement(section);
      return;
    }

    setText("objecoes-kicker", config.kicker || "💡 Dúvidas comuns");
    setText("objecoes-title", config.titulo || "Antes de pensar ‘isso não é para mim’...");
    setText(
      "objecoes-subtitle",
      config.descricao || "Veja como a campanha foi pensada para facilitar a venda e a operação."
    );

    const destaque = config.destaque || {};
    const destaqueEl = getEl("objecoes-highlight-card");

    if (destaqueEl) {
      destaqueEl.innerHTML = `
        <div class="objecoes-highlight-icon">${escapeHTML(destaque.icone || "🇧🇷")}</div>
        <h3>${escapeHTML(destaque.titulo || "Seu negócio precisa estar pronto antes da bola rolar")}</h3>
        <p>${escapeHTML(destaque.texto || "Uma campanha organizada ajuda o cliente a entender a oferta, pedir, reservar e chamar no WhatsApp com mais facilidade.")}</p>
        <button class="btn-primary" type="button" id="objecoes-highlight-btn">
          ${escapeHTML(destaque.botao || "Quero entender a campanha")}
        </button>
      `;

      const btn = getEl("objecoes-highlight-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          trackEvent("clique_objecoes", { local: "duvidas_objecoes" });
          openWhatsApp(
            destaque.mensagemWhatsApp ||
            "Olá! Quero entender como a campanha dos Jogos do Brasil pode funcionar no meu negócio."
          );
        });
      }
    }

    const grid = getEl("objecoes-grid");
    const itens = Array.isArray(config.itens) ? config.itens : [];

    if (grid) {
      grid.innerHTML = itens.map((item, index) => `
        <article class="objecao-card" style="--objecao-delay:${index * 0.08}s">
          <span class="objecao-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHTML(item.pergunta || "Dúvida")}</h3>
          <p>${escapeHTML(item.resposta || "Resposta da campanha.")}</p>
        </article>
      `).join("");
    }
  }

  // ==========================================================
  //  POTENCIALIZE SUA CAMPANHA
  // ==========================================================

  function initPotencializacao() {
    const section = document.querySelector('[data-section="mostrarPotencializacao"]');
    const config = safeConfig("potencializacao", {});

    if (!section) return;

    if (config.enabled === false) {
      hideElement(section);
      return;
    }

    setText("potencializacao-kicker", config.kicker || "⚽ Inteligência comercial");
    setText("potencializacao-title", config.titulo || "Muito além de um site bonito");
    setText(
      "potencializacao-subtitle",
      config.descricao || "Transforme atenção em pedidos, reservas e clientes organizados."
    );

    const mediaCard = getEl("potencializacao-media-card");
    if (mediaCard) {
      mediaCard.innerHTML = `
        <div class="potencializacao-football" aria-hidden="true">⚽</div>
        ${renderMedia(config, { className: "potencializacao-media", placeholder: "🇧🇷" })}
      `;

      const video = mediaCard.querySelector("video");
      if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play().catch(() => {});
      }
    }

    const benefitsEl = getEl("potencializacao-benefits");
    const beneficios = Array.isArray(config.beneficios) ? config.beneficios : [];

    if (benefitsEl) {
      benefitsEl.innerHTML = beneficios.map((item, index) => `
        <article class="potencializacao-benefit-card" style="--potencializacao-delay:${index * 0.08}s">
          <div class="potencializacao-benefit-icon">${escapeHTML(item.icone || "✅")}</div>
          <h3>${escapeHTML(item.titulo || "")}</h3>
          <p>${escapeHTML(item.texto || "")}</p>
        </article>
      `).join("");
    }

    const bonus = config.bonus || {};
    const bonusEl = getEl("potencializacao-bonus-card");

    if (bonusEl) {
      if (bonus.enabled === false) {
        hideElement(bonusEl);
      } else {
        const horas = Number(bonus.horas || 30);

        bonusEl.innerHTML = `
          <div class="potencializacao-bonus-glow" aria-hidden="true"></div>

          <div class="potencializacao-bonus-content">
            <span class="potencializacao-bonus-selo">${escapeHTML(bonus.selo || "Bônus por tempo limitado")}</span>
            <h3>${escapeHTML(bonus.titulo || "Primeira campanha de impulsionamento sem custo")}</h3>
            <p>${escapeHTML(bonus.texto || "")}</p>

            <div class="potencializacao-countdown">
              <span>Prazo especial</span>
              <strong>${horas} horas</strong>
            </div>

            ${bonus.destaque ? `<small>${escapeHTML(bonus.destaque)}</small>` : ""}

            <button class="btn-primary" type="button" id="potencializacao-bonus-btn">
              ${escapeHTML(bonus.botao || "Quero ativar minha campanha")}
            </button>
          </div>
        `;

        const btn = getEl("potencializacao-bonus-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            trackEvent("clique_bonus_impulsionamento", {
              local: "potencializacao",
              horas,
            });

            openWhatsApp(
              bonus.mensagemWhatsApp ||
              "Olá! Quero ativar minha campanha e aproveitar o bônus de impulsionamento sem custo."
            );
          });
        }
      }
    }
  }


  // ==========================================================
  //  CTA FINAL
  // ==========================================================

  function initFinalCTA() {
    const finalCTA = safeConfig("finalCTA", {});

    setText("final-cta-title", finalCTA.titulo || "A bola vai rolar. Seu pedido também precisa rolar.");
    setText(
      "final-cta-text",
      finalCTA.texto || "Prepare sua loja para transformar os jogos do Brasil em pedidos, reservas, retirada no balcão, bolão e clientes chamando no WhatsApp."
    );

    const waBtn = getEl("final-whatsapp-btn");
    if (waBtn) {
      const msg = finalCTA.mensagemWhatsApp || "Olá! Quero fazer um pedido na campanha dos Jogos do Brasil.";
      waBtn.href = buildWhatsAppUrl(msg);

      waBtn.addEventListener("click", () => {
        trackEvent("clique_whatsapp", { local: "cta_final" });
      });
    }
  }

  // ==========================================================
  //  ROLETA
  // ==========================================================

  function normalizeRoulettePrize(prize, index) {
    if (typeof prize === "string") {
      const discountMatch = prize.match(/(\d+)\s*%/);
      const desconto = discountMatch ? `${discountMatch[1]}%` : "";

      return {
        nome: prize,
        label: prize,
        desconto,
        codigo: desconto ? `BRASIL${discountMatch[1]}` : `COPA${index + 1}`,
        mensagem: "Use seu benefício especial antes da bola rolar.",
        cta: "Usar prêmio no WhatsApp",
      };
    }

    const rawDiscount = prize?.desconto ?? prize?.discount ?? "";
    const desconto = rawDiscount === null || rawDiscount === undefined
      ? ""
      : String(rawDiscount).replace(/\s*%?\s*$/, rawDiscount === "" ? "" : "%");

    return {
      nome: prize?.nome || prize?.name || prize?.titulo || prize?.label || `Prêmio ${index + 1}`,
      label: prize?.label || prize?.nome || prize?.name || prize?.titulo || `Prêmio ${index + 1}`,
      desconto,
      codigo: prize?.codigo || prize?.code || "",
      mensagem: prize?.mensagem || prize?.message || "Use seu benefício especial antes da bola rolar.",
      cta: prize?.cta || prize?.botao || "Usar desconto no WhatsApp",
    };
  }

  function roulettePrizeText(prize) {
    if (prize.desconto) return `${prize.desconto} OFF`;
    return prize.label || prize.nome || "Prêmio";
  }

  function rouletteResultHTML(prize) {
    return `
      <div class="roulette-result-card">
        <small>🎉 Prêmio liberado</small>
        <strong>${escapeHTML(prize.nome || "Prêmio especial")}</strong>
        ${prize.desconto ? `<em>${escapeHTML(prize.desconto)} de desconto</em>` : ""}
        ${prize.codigo ? `<span class="roulette-coupon">CÓDIGO: ${escapeHTML(prize.codigo)}</span>` : ""}
        <p>${escapeHTML(prize.mensagem || "Use seu benefício no WhatsApp agora.")}</p>
      </div>`;
  }

  function buildRouletteMessage(prize, rouletteConfig) {
    if (rouletteConfig.mensagemWhatsApp) return rouletteConfig.mensagemWhatsApp;

    return (
      `Olá! Girei a roleta da campanha dos Jogos do Brasil e ganhei:\n\n` +
      `Promoção: ${prize.nome || "Prêmio especial"}\n` +
      `${prize.desconto ? `Desconto: ${prize.desconto}\n` : ""}` +
      `${prize.codigo ? `Código: ${prize.codigo}\n` : ""}` +
      `\nQuero usar meu benefício agora. 🇧🇷⚽`
    );
  }

  function getRouletteDeviceId() {
    const key = "jogosBrasilDeviceIdV1";

    try {
      let id = localStorage.getItem(key);
      if (id) return id;

      const random =
        window.crypto && window.crypto.getRandomValues
          ? Array.from(window.crypto.getRandomValues(new Uint32Array(4))).map((n) => n.toString(16)).join("")
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      id = `device-${random}`;
      localStorage.setItem(key, id);
      return id;
    } catch (e) {
      return `device-session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  }

  function getRouletteStorageKey() {
    return safeConfig("roulette.limiteGiro.storageKey", "jogosBrasilRouletteSpinV1");
  }

  function getRouletteSpinRecord() {
    try {
      const raw = localStorage.getItem(getRouletteStorageKey());
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveRouletteSpinRecord(record) {
    try {
      localStorage.setItem(getRouletteStorageKey(), JSON.stringify(record));
    } catch (e) {}
  }

  function rouletteLimitEnabled() {
    const value = safeConfig("roulette.limiteGiro.enabled", true);
    return value !== false;
  }

  async function callRouletteServer(action, extraPayload) {
    const limite = safeConfig("roulette.limiteGiro", {});
    const serverUrl = limite.serverUrl || limite.endpoint || "";

    if (!serverUrl) return null;

    const payload = {
      action,
      deviceId: getRouletteDeviceId(),
      campanha: safeConfig("campanha.nome", "Jogos do Brasil"),
      origem: window.location.href,
      timestamp: new Date().toISOString(),
      ...extraPayload,
    };

    const response = await fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json().catch(() => null);
  }

  function showRouletteAlreadyUsed(record, spinBtn, resultEl, whatsappBtn, roulette) {
    const prize = normalizeRoulettePrize(record?.prize || record?.premio || record || {}, 0);

    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.setAttribute("aria-disabled", "true");
      spinBtn.textContent = roulette?.limiteGiro?.textoBloqueado || "Giro já utilizado";
    }

    if (resultEl) {
      resultEl.innerHTML = `
        <div class="roulette-result-card roulette-result-locked">
          <small>🔒 Giro já usado</small>
          <strong>${escapeHTML(prize.nome || "Prêmio já liberado")}</strong>
          ${prize.desconto ? `<em>${escapeHTML(prize.desconto)} de desconto</em>` : ""}
          ${prize.codigo ? `<span class="roulette-coupon">CÓDIGO: ${escapeHTML(prize.codigo)}</span>` : ""}
          <p>${escapeHTML(roulette?.limiteGiro?.mensagemBloqueado || "Você já girou a roleta neste aparelho. Use o benefício liberado no WhatsApp.")}</p>
        </div>`;
    }

    if (whatsappBtn) {
      whatsappBtn.href = buildWhatsAppUrl(buildRouletteMessage(prize, roulette || {}));
      whatsappBtn.textContent = prize.cta || "Usar prêmio no WhatsApp";
      whatsappBtn.classList.remove("hidden");
    }
  }

  function initRoulette() {
    const roulette = safeConfig("roulette", {});
    if (roulette.enabled !== true) return;

    const modal = getEl("roulette-modal");
    const wheel = getEl("roulette-wheel");
    const closeBtn = getEl("roulette-close");
    const spinBtn = getEl("roulette-spin");
    const resultEl = getEl("roulette-result");
    const whatsappBtn = getEl("roulette-whatsapp");

    if (!modal || !wheel || !spinBtn || !resultEl) return;

    const rawPrizes = Array.isArray(roulette.prizes) && roulette.prizes.length
      ? roulette.prizes
      : [
          { nome: "Desconto da Torcida", desconto: "10%", codigo: "BRASIL10", mensagem: "Use seu desconto antes da bola rolar.", cta: "Usar desconto no WhatsApp" },
          { nome: "Gol Premiado", desconto: "15%", codigo: "GOL15", mensagem: "Oferta especial para comemorar como gol do Brasil.", cta: "Pedir agora" },
          { nome: "Combo Especial", desconto: "", codigo: "COMBOCOPA", mensagem: "Você desbloqueou um combo especial da campanha.", cta: "Pedir combo" },
          { nome: "Brinde Exclusivo", desconto: "", codigo: "BRINDE", mensagem: "Você ganhou um brinde especial na campanha.", cta: "Resgatar brinde" },
          { nome: "Retirada Premiada", desconto: "7%", codigo: "RETIRA7", mensagem: "Peça no WhatsApp e retire com benefício.", cta: "Usar benefício" },
          { nome: "Oferta Relâmpago", desconto: "20%", codigo: "HEXA20", mensagem: "Oferta especial por tempo limitado.", cta: "Aproveitar agora" },
        ];

    const prizes = rawPrizes.map(normalizeRoulettePrize);
    const delaySeconds = Number(roulette.delaySeconds || 40);
    const spinDuration = Math.min(Math.max(Number(roulette.spinDurationMs || 5600), 2800), 9500);

    const cooldownExibicao = roulette.cooldownExibicao || {};
    const cooldownExibicaoEnabled = cooldownExibicao.enabled !== false;
    const cooldownExibicaoHours = Number(cooldownExibicao.hours || 48);
    const cooldownExibicaoMs = cooldownExibicaoHours * 60 * 60 * 1000;
    const cooldownExibicaoKey = cooldownExibicao.storageKey || "jogosBrasilRoletaExibidaV1";

    renderRoulettePrizes(prizes);

    const existingRecord = rouletteLimitEnabled() ? getRouletteSpinRecord() : null;
    if (existingRecord) {
      showRouletteAlreadyUsed(existingRecord, spinBtn, resultEl, whatsappBtn, roulette);
    }

    if (canShowRouletteByCooldown()) {
      setTimeout(() => {
        openRouletteModal();
        saveRouletteShownNow();
      }, Math.max(1, delaySeconds) * 1000);
    }

    function canShowRouletteByCooldown() {
      if (!cooldownExibicaoEnabled) return true;

      try {
        const raw = localStorage.getItem(cooldownExibicaoKey);
        if (!raw) return true;

        const record = JSON.parse(raw);
        const lastShownAt = Number(record?.shownAt || 0);

        if (!lastShownAt) return true;

        return Date.now() - lastShownAt >= cooldownExibicaoMs;
      } catch (e) {
        return true;
      }
    }

    function saveRouletteShownNow() {
      if (!cooldownExibicaoEnabled) return;

      try {
        localStorage.setItem(cooldownExibicaoKey, JSON.stringify({
          shownAt: Date.now(),
          nextShowAt: Date.now() + cooldownExibicaoMs,
          cooldownHours: cooldownExibicaoHours,
        }));
      } catch (e) {}
    }

    function renderRoulettePrizes(items) {
      const slice = 360 / items.length;
      const colors = ["#003399", "#FFD700", "#009C3B", "#0057FF", "#F4C400", "#071428", "#00B344", "#123A7A"];
      const gradient = items.map((_, index) => {
        const start = index * slice;
        const end = (index + 1) * slice;
        return `${colors[index % colors.length]} ${start}deg ${end}deg`;
      }).join(", ");

      wheel.style.background = `conic-gradient(from -90deg, ${gradient})`;
      wheel.innerHTML = items.map((prize, index) => {
        const rotate = (slice * index) + (slice / 2) - 90;
        return `
          <span class="roulette-prize" style="transform: rotate(${rotate}deg) translate(44px, -50%);">
            <span>${escapeHTML(roulettePrizeText(prize))}</span>
          </span>`;
      }).join("");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeRouletteModal);
    modal.querySelectorAll("[data-close-roulette]").forEach((el) => {
      el.addEventListener("click", closeRouletteModal);
    });

    let spinning = false;
    let currentRotation = 0;
    let activeAnimation = null;
    let lastPrize = existingRecord ? normalizeRoulettePrize(existingRecord.prize || existingRecord.premio || existingRecord, 0) : null;

    spinBtn.addEventListener("click", async () => {
      if (spinning) return;

      if (rouletteLimitEnabled()) {
        const localRecord = getRouletteSpinRecord();
        if (localRecord) {
          showRouletteAlreadyUsed(localRecord, spinBtn, resultEl, whatsappBtn, roulette);
          return;
        }
      }

      spinning = true;
      spinBtn.disabled = true;
      spinBtn.setAttribute("aria-busy", "true");
      spinBtn.textContent = "Validando...";
      hideElement(whatsappBtn);

      let serverReservation = null;
      if (rouletteLimitEnabled()) {
        try {
          serverReservation = await callRouletteServer("reserve", {});
          if (serverReservation && serverReservation.allowed === false) {
            const record = serverReservation.record || serverReservation;
            showRouletteAlreadyUsed(record, spinBtn, resultEl, whatsappBtn, roulette);
            spinning = false;
            return;
          }
        } catch (e) {
          const requiresServer = safeConfig("roulette.limiteGiro.requireServer", false) === true;
          if (requiresServer) {
            resultEl.innerHTML = `
              <div class="roulette-result-card roulette-result-locked">
                <small>⚠️ Validação indisponível</small>
                <strong>Não foi possível liberar o giro</strong>
                <p>Tente novamente em instantes. O sistema está protegendo a promoção contra giros duplicados.</p>
              </div>`;
            spinBtn.disabled = false;
            spinBtn.removeAttribute("aria-busy");
            spinBtn.textContent = "Tentar novamente";
            spinning = false;
            return;
          }
        }
      }

      spinBtn.textContent = "Girando...";
      resultEl.innerHTML = `
        <div class="roulette-result-card is-loading">
          <small>Boa sorte</small>
          <strong>Girando...</strong>
          <p>Seu prêmio está sendo revelado.</p>
        </div>`;

      const selectedIndex = Number.isInteger(serverReservation?.prizeIndex)
        ? Math.max(0, Math.min(prizes.length - 1, serverReservation.prizeIndex))
        : Math.floor(Math.random() * prizes.length);

      const prize = prizes[selectedIndex];
      lastPrize = prize;

      const slice = 360 / prizes.length;
      const selectedMiddle = selectedIndex * slice + slice / 2;
      const targetAtPointer = 360 - selectedMiddle;
      const currentNormalized = ((currentRotation % 360) + 360) % 360;
      const correction = ((targetAtPointer - currentNormalized) + 360) % 360;
      const extraSpins = 360 * Math.max(6, Number(roulette.extraSpins || 8));
      const finalRotation = currentRotation + extraSpins + correction;

      if (activeAnimation) activeAnimation.cancel();

      wheel.classList.remove("roulette-finished");
      wheel.classList.add("is-spinning");
      wheel.style.transform = `rotate(${currentRotation}deg)`;

      if (typeof wheel.animate === "function") {
        activeAnimation = wheel.animate(
          [
            { transform: `rotate(${currentRotation}deg)` },
            { transform: `rotate(${finalRotation}deg)` },
          ],
          {
            duration: spinDuration,
            easing: "cubic-bezier(0.08, 0.82, 0.12, 1)",
            fill: "forwards",
          }
        );

        activeAnimation.onfinish = finishSpin;
        activeAnimation.oncancel = () => {};
      } else {
        wheel.style.transition = "none";
        wheel.offsetHeight;
        wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.08, 0.82, 0.12, 1)`;
        requestAnimationFrame(() => {
          wheel.style.transform = `rotate(${finalRotation}deg)`;
        });
        setTimeout(finishSpin, spinDuration + 80);
      }

      trackEvent("giro_roleta", { premiosDisponiveis: prizes.length });

      async function finishSpin() {
        currentRotation = finalRotation;
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        wheel.classList.remove("is-spinning");
        wheel.classList.add("roulette-finished");

        const record = {
          used: true,
          deviceId: getRouletteDeviceId(),
          prize,
          prizeIndex: selectedIndex,
          usedAt: new Date().toISOString(),
          reservationId: serverReservation?.reservationId || serverReservation?.id || "",
        };

        if (rouletteLimitEnabled()) {
          saveRouletteSpinRecord(record);
          try {
            await callRouletteServer("complete", record);
          } catch (e) {}
        }

        spinning = false;
        spinBtn.disabled = true;
        spinBtn.removeAttribute("aria-busy");
        spinBtn.setAttribute("aria-disabled", "true");
        spinBtn.textContent = roulette?.limiteGiro?.textoBloqueado || "Giro já utilizado";

        resultEl.innerHTML = rouletteResultHTML(prize);

        const message = buildRouletteMessage(prize, roulette);
        if (whatsappBtn) {
          whatsappBtn.textContent = prize.cta || "Usar desconto no WhatsApp";
          whatsappBtn.href = buildWhatsAppUrl(message);
          whatsappBtn.classList.remove("hidden");
        }

        trackEvent("resultado_roleta", {
          premio: prize.nome || prize.label,
          desconto: prize.desconto,
          codigo: prize.codigo,
        });
      }
    });

    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => {
        trackEvent("clique_whatsapp", {
          local: "roleta",
          resultado: lastPrize?.nome || resultEl.textContent,
          codigo: lastPrize?.codigo || "",
        });
      });
    }
  }

  function openRouletteModal() {
    const modal = getEl("roulette-modal");
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    trackEvent("roleta_exibida", { local: "modal_roleta" });
  }

  function closeRouletteModal() {
    const modal = getEl("roulette-modal");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ==========================================================
  //  WHATSAPP FAB
  // ==========================================================

  function initWhatsAppFab() {
    const fab = getEl("whatsapp-fab");
    const tooltip = getEl("fab-tooltip");
    if (!fab) return;

    fab.href = buildWhatsAppUrl();

    if (tooltip) {
      tooltip.textContent = safeConfig("whatsapp.tooltip", "Estamos online aqui! 👋");
    }

    fab.addEventListener("click", () => {
      trackEvent("clique_whatsapp", { local: "fab" });
    });
  }

  // ==========================================================
  //  ÍCONES OFICIAIS DAS REDES SOCIAIS
  // ==========================================================

  function socialIconSVG(name) {
    const icons = {
      instagram: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm4.25 3.25A4.75 4.75 0 1 1 7.25 12 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Zm5-2.75a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17 6.5Z"/>
        </svg>`,
      tiktok: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M16.6 2c.2 1.7 1.15 3.24 2.58 4.2A7.09 7.09 0 0 0 22 7.35v3.18a9.67 9.67 0 0 1-5.28-1.58v6.38A6.67 6.67 0 1 1 10.05 8.7c.46 0 .9.05 1.33.14v3.28a3.42 3.42 0 1 0 2.03 3.12V2h3.19Z"/>
        </svg>`,
      youtube: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.57 12 3.57 12 3.57s-7.5 0-9.38.51A3 3 0 0 0 .5 6.2 31.24 31.24 0 0 0 0 12a31.24 31.24 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12A31.24 31.24 0 0 0 24 12a31.24 31.24 0 0 0-.5-5.8ZM9.75 15.57V8.43L16 12l-6.25 3.57Z"/>
        </svg>`,
      whatsapp: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2a9.86 9.86 0 0 0-8.43 15L2.2 22l5.1-1.34A9.9 9.9 0 1 0 12 2Zm0 18.1a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.02.8.8-2.95-.2-.31A8.1 8.1 0 1 1 12 20.1Zm4.45-6.07c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.63 6.63 0 0 1-1.94-1.2 7.28 7.28 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46a.89.89 0 0 0-.64.3 2.69 2.69 0 0 0-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.19 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
        </svg>`
    };

    return icons[name] || "";
  }

  function renderFooterDemo() {
    const holder = getEl("footer-campaign-logo");
    if (!holder) return;

    /*
      Aceita os dois nomes para evitar erro em configurações antigas:
      - rodape.imagemAnimada
      - rodape.imagemDemonstrativa
      Também aceita imagem local, imagem externa, vídeo local e vídeo externo.
    */
    const imagemAnimada = safeConfig("rodape.imagemAnimada", null);
    const imagemDemonstrativa = safeConfig("rodape.imagemDemonstrativa", null);
    const demo = imagemAnimada || imagemDemonstrativa || {};
    const enabled = demo.enabled !== false;

    if (!enabled) {
      holder.innerHTML = `<div class="brazil-emblem">🇧🇷</div>`;
      return;
    }

    const media = demo.media || demo;
    const type = media.type || demo.type || "image";
    const src = media.src || demo.src || "";
    const poster = media.poster || demo.poster || "";
    const alt = demo.alt || media.alt || "Imagem demonstrativa da campanha Jogos do Brasil";

    if (!src) {
      holder.innerHTML = `
        <div class="footer-demo-media" aria-label="Campanha Jogos do Brasil">
          <div class="footer-demo-placeholder">🇧🇷</div>
        </div>`;
      return;
    }

    const fallbackHTML = `<div class="footer-demo-placeholder footer-demo-fallback" style="display:none;">🇧🇷</div>`;

    if (type === "video" || type === "local" || type === "external") {
      holder.innerHTML = `
        <div class="footer-demo-media">
          <video
            src="${escapeAttr(src)}"
            ${poster ? `poster="${escapeAttr(poster)}"` : ""}
            muted
            loop
            playsinline
            autoplay
            preload="metadata"
            onerror="this.style.display='none'; const next=this.nextElementSibling; if(next) next.style.display='grid';">
          </video>
          ${fallbackHTML}
        </div>`;
      return;
    }

    holder.innerHTML = `
      <div class="footer-demo-media">
        <img
          src="${escapeAttr(src)}"
          alt="${escapeAttr(alt)}"
          loading="lazy"
          onerror="this.style.display='none'; const next=this.nextElementSibling; if(next) next.style.display='grid';" />
        ${fallbackHTML}
      </div>`;
  }

  function initFooter() {
    const campanha = safeConfig("campanha", {});
    const redes = safeConfig("redes", {});
    const rodape = safeConfig("rodape", {});

    const nome = campanha.nome || "Jogos do Brasil";
    const logoPath = campanha.logoPath || "";
    const logoUrl = campanha.logoUrl || "";

    const instagram = redes.instagram || "";
    const tiktok = redes.tiktok || "";
    const youtube = redes.youtube || "";
    const waUrl = buildWhatsAppUrl();

    const footerLogoEl = getEl("footer-logo");

    if (footerLogoEl) {
      if (logoPath || logoUrl) {
        footerLogoEl.innerHTML = `<img src="${escapeAttr(logoPath || logoUrl)}" alt="${escapeAttr(nome)}" />`;
      } else {
        const words = nome.trim().split(" ");
        const last = words.length > 1 ? words.pop() : "";
        const rest = words.join(" ") || nome;

        footerLogoEl.innerHTML = `<div class="footer-logo-text">${escapeHTML(rest)} ${last ? `<span>${escapeHTML(last)}</span>` : ""}</div>`;
      }
    }

    setText(
      "footer-desc",
      rodape.textoInstitucional || "Sua plataforma oficial de promoções para os jogos da Seleção Brasileira."
    );

    const socialEl = getEl("footer-social");
    if (socialEl) {
      socialEl.innerHTML = `
        <a href="${escapeAttr(instagram || "#")}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">${socialIconSVG("instagram")}</a>
        <a href="${escapeAttr(tiktok || "#")}" class="social-link" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok">${socialIconSVG("tiktok")}</a>
        <a href="${escapeAttr(youtube || "#")}" class="social-link" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">${socialIconSVG("youtube")}</a>
        <a href="${escapeAttr(waUrl)}" class="social-link" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">${socialIconSVG("whatsapp")}</a>`;
    }

    renderFooterDemo();

    setHref("footer-wa-link", waUrl);
    setHref("footer-ig-link", instagram);
    setHref("footer-tt-link", tiktok);
    setHref("footer-yt-link", youtube);

    setText("footer-copyright", rodape.textoCopyright || "© Jogos do Brasil. Todos os direitos reservados.");
  }

  // ==========================================================
  //  LOCALIZAÇÃO / GOOGLE MAPS REAL
  // ==========================================================

  function buildGoogleMapsEmbedUrl(localizacao) {
    const embed = localizacao.googleMapsEmbedUrl || "";
    if (embed) return embed;

    const endereco = localizacao.endereco || localizacao.nome || safeConfig("campanha.nome", "Estabelecimento");
    return `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
  }

  function initLocalizacao() {
    const section = getEl("como-chegar");
    const localizacao = safeConfig("localizacao", {});

    if (!section) return;

    if (localizacao.enabled === false) {
      hideElement(section);
      return;
    }

    const nome = localizacao.nome || safeConfig("campanha.nome", "Nome do Estabelecimento");
    const endereco = localizacao.endereco || "Rua Exemplo, 123 — Bairro / Cidade";
    const referencia = localizacao.referencia || "Próximo ao ponto de referência principal";
    const horario = localizacao.horario || "Funcionamento especial nos dias de jogo";
    const mapsUrl = localizacao.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    const embedUrl = buildGoogleMapsEmbedUrl(localizacao);

    setText("localizacao-kicker", localizacao.kicker || "📍 Como chegar");
    setText("localizacao-title", localizacao.titulo || "Venha torcer com a gente");
    setText(
      "localizacao-description",
      localizacao.descricao || "Confira nosso endereço no Google Maps, escolha a melhor rota e venha retirar seu pedido ou assistir aos Jogos do Brasil com conforto."
    );
    setText("localizacao-endereco", endereco);
    setText("localizacao-referencia", `${referencia} • ${horario}`);
    setText("localizacao-map-nome", nome);
    setText("localizacao-map-subtitle", localizacao.mapSubtitle || "Mapa oficial com pin do Google Maps");
    setText("localizacao-horario", horario);

    const iframe = getEl("localizacao-map-iframe");
    if (iframe && embedUrl) {
      iframe.src = embedUrl;
      iframe.title = `Mapa de ${nome} no Google Maps`;
    }

    const mapsBtn = getEl("localizacao-maps-btn");
    const footerLink = getEl("localizacao-map-footer-link");

    if (mapsBtn) {
      mapsBtn.textContent = localizacao.botaoPrimario || "Abrir no Google Maps";
      mapsBtn.href = mapsUrl;
      mapsBtn.target = "_blank";
      mapsBtn.rel = "noopener";
      mapsBtn.addEventListener("click", () => {
        trackEvent("clique_google_maps", { local: "secao_localizacao", endereco });
      });
    }

    if (footerLink) {
      footerLink.href = mapsUrl;
      footerLink.target = "_blank";
      footerLink.rel = "noopener";
      footerLink.addEventListener("click", () => {
        trackEvent("clique_google_maps", { local: "mapa_embutido", endereco });
      });
    }

    const waBtn = getEl("localizacao-whatsapp-btn");
    if (waBtn) {
      const msg = localizacao.mensagemWhatsApp || `Olá! Vi o endereço no site e quero confirmar como chegar em ${nome}.`;
      waBtn.textContent = localizacao.botaoSecundario || "Chamar no WhatsApp";
      waBtn.href = buildWhatsAppUrl(msg);
      waBtn.target = "_blank";
      waBtn.rel = "noopener";
      waBtn.addEventListener("click", () => {
        trackEvent("clique_whatsapp", { local: "secao_localizacao" });
      });
    }
  }


  // ==========================================================
  //  HEADER SCROLL
  // ==========================================================

  function initHeaderScroll() {
    const header = getEl("main-header");
    if (!header) return;

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;

        if (y > 80) {
          header.style.boxShadow = "0 4px 40px rgba(0,0,0,0.75)";
        } else {
          header.style.boxShadow = "0 4px 30px rgba(0,0,0,0.5)";
        }
      },
      { passive: true }
    );
  }

  // ==========================================================
  //  LINKS INTERNOS
  // ==========================================================

  function initInternalLinks() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ==========================================================
  //  PAGE VIEW
  // ==========================================================

  function trackPageView() {
    trackEvent("view_campanha", {
      campanha: safeConfig("campanha.nome", "Jogos do Brasil"),
      tipoCampanha: safeConfig("tipoCampanha", "hibrida"),
      url: window.location.href,
    });
  }

  // ==========================================================
  //  INIT
  // ==========================================================

  function init() {
    toggleSectionByConfig();
    initTrackingIntegrations();

    initModals();

    initHeader();
    initTicker();
    initIntro();
    initHeroVideo();
    initHeroContent();
    initCards();

    initFormasTorcer();
    initCombos();
    initRetirada();
    initBar();

    initReservationCard();
    initReservations();

    initBolaoCard();
    initBolao();
    initBolaoMesaCard();
    initBolaoMesa();

    initReels();
    initPromocoes();
    initDuvidasObjecoes();
    initPotencializacao();
    initFinalCTA();
    initLocalizacao();
    initRoulette();

    initWhatsAppFab();
    initFooter();
    initHeaderScroll();
    initInternalLinks();

    playVideosOnHover();

    trackPageView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();