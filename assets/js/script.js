// script.js
// Portfolio one-page — Vanilla JS
// Interactions : scroll reveal, scrollspy, filtre projets, modal accessible (focus trap + ESC),
// menu mobile, validation formulaire, back-to-top.

(() => {
  "use strict";

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  // Focusable elements selector for focus trap
  const FOCUSABLE = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  // -----------------------------
  // Footer year
  // -----------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------
  // Mobile nav toggle (accessible)
  // -----------------------------
  const navToggle = $(".nav-toggle");
  const siteNav = $("#site-nav");

  const closeNav = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };

  const openNav = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    siteNav.classList.add("is-open");
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeNav() : openNav();
    });

    // Close on link click (mobile)
    $$(".nav-link", siteNav).forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!siteNav.classList.contains("is-open")) return;
      const isClickInside = siteNav.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // -----------------------------
  // Scroll reveal (IntersectionObserver)
  // -----------------------------
  const revealEls = $$(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // -----------------------------
  // Scrollspy (active nav link by visible section)
  // -----------------------------
  const spyLinks = $$("[data-scrollspy]");
  const sections = spyLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (id) => {
    spyLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("is-active", isActive);
      a.setAttribute("aria-current", isActive ? "page" : "false");
    });
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      // Find the most visible section among entries that intersect
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActiveLink(visible.target.id);
    },
    {
      root: null,
      threshold: [0.22, 0.35, 0.5, 0.7],
      // Offset for sticky header
      rootMargin: "-20% 0px -60% 0px"
    }
  );

  sections.forEach((sec) => spyObserver.observe(sec));

  // -----------------------------
  // Projects data for modal (mock)
  // -----------------------------
  const PROJECTS = {
    p1: {
      title: "Campagne Instagram “Semaine Thématique”",
      type: "Campagne Instagram",
      category: "communication",
      desc:
        "Série de contenus pensée pour clarifier l’univers de marque et favoriser l’engagement : storytelling, cohérence visuelle et CTA.",
      bullets: [
        "Définition du concept et des objectifs (engagement / visibilité).",
        "Création d’un kit de templates (posts, stories, highlights).",
        "Rédaction des accroches + variations de CTA.",
        "Organisation du calendrier de publication."
      ],
      tags: ["Canva", "Meta", "Copywriting", "Calendrier éditorial"],
      gradientClass: "g1"
    },
    p2: {
      title: "Teaser vidéo — format vertical",
      type: "Teaser vidéo",
      category: "audiovisuel",
      desc:
        "Montage conçu pour une lecture mobile : hook immédiat, titrage lisible et rythme aligné sur la musique.",
      bullets: [
        "Sélection des meilleurs plans + structuration en 3 temps.",
        "Montage rythmé (cuts, dynamiques, respirations).",
        "Titrage + sous-titres pour accessibilité mobile.",
        "Exports optimisés pour plateformes (ratio, poids, audio)."
      ],
      tags: ["Premiere Pro", "Sous-titres", "Sound design", "Vertical"],
      gradientClass: "g2"
    },
    p3: {
      title: "Mini identité visuelle — marque fictive",
      type: "Identité visuelle",
      category: "design",
      desc:
        "Construction d’un univers premium : choix typographiques, grille, composants et règles d’usage pour une cohérence globale.",
      bullets: [
        "Moodboard + direction artistique (références, intentions).",
        "Palette, typographies et composants UI réutilisables.",
        "Déclinaisons : posts, stories et landing.",
        "Mini guide : règles d’espacement, hiérarchie, usages."
      ],
      tags: ["Figma", "Branding", "Grille", "UI"],
      gradientClass: "g3"
    },
    p4: {
      title: "Interview — capsule courte",
      type: "Interview",
      category: "audiovisuel",
      desc:
        "Capsule humaine et claire : préparation éditoriale, son propre, montage fluide et habillage minimal.",
      bullets: [
        "Préparation : questions, intentions, structure narrative.",
        "Prise de son + vérification des niveaux.",
        "Montage + nettoyage audio léger.",
        "Habillage : titrage, respirations, sous-titres."
      ],
      tags: ["Tournage", "Premiere Pro", "Sound", "Habillage"],
      gradientClass: "g4"
    },
    p5: {
      title: "Motion design — typographie animée",
      type: "Motion design",
      category: "audiovisuel",
      desc:
        "Animation typographique orientée message : timing, transitions propres et lisibilité prioritaire sur mobile.",
      bullets: [
        "Choix typo + hiérarchie de l’information.",
        "Animation (easing, timing, transitions) sobre et premium.",
        "Gestion des contrastes et des zones de sécurité.",
        "Exports adaptés (mp4 / gifs légers)."
      ],
      tags: ["After Effects", "Typo", "Easing", "Transitions"],
      gradientClass: "g5"
    },
    p6: {
      title: "Audit express — présence en ligne",
      type: "Communication",
      category: "communication",
      desc:
        "Analyse rapide et actionnable : cohérence du feed, ton, fréquence et pistes de formats pour gagner en impact.",
      bullets: [
        "Benchmark + identification des opportunités rapides.",
        "Recommandations sur la ligne éditoriale et le ton.",
        "Propositions de formats (séries, rubriques, hooks).",
        "Checklist de cohérence visuelle (grille, typos, couleurs)."
      ],
      tags: ["Benchmark", "Stratégie", "Réseaux", "Recommandations"],
      gradientClass: "g6"
    }
  };

  // -----------------------------
  // Projects filtering
  // -----------------------------
  const filterBtns = $$(".filter-btn");
  const projectCards = $$(".project-card");
  const projectsCount = $("#projectsCount");

  const updateCount = () => {
    const visibleCount = projectCards.filter((c) => !c.hasAttribute("hidden")).length;
    if (projectsCount) projectsCount.textContent = String(visibleCount);
  };

  const setFilterActive = (btn) => {
    filterBtns.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const applyFilter = (filter) => {
    projectCards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      const show = filter === "all" || cat === filter;
      card.toggleAttribute("hidden", !show);
      // Improve a11y: hidden cards should not be focusable
      card.setAttribute("aria-hidden", show ? "false" : "true");
    });
    updateCount();
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      setFilterActive(btn);
      applyFilter(filter);
    });
  });

  // Init
  updateCount();

  // -----------------------------
  // Modal (accessible): open/close + focus trap + ESC
  // -----------------------------
  const modal = $("#projectModal");
  const modalDialog = $(".modal-dialog", modal || document);
  const modalTitle = $("#modalTitle");
  const modalType = $("#modalType");
  const modalDesc = $("#modalDesc");
  const modalBullets = $("#modalBullets");
  const modalTags = $("#modalTags");
  const modalGradient = $("#modalGradient");
  const modalCta = $("#modalCta");

  let lastFocusedEl = null;

  const isModalOpen = () => modal?.classList.contains("is-open");

  const getFocusableInModal = () => {
    if (!modalDialog) return [];
    return $$(FOCUSABLE, modalDialog).filter((el) => el.offsetParent !== null);
  };

  const trapFocus = (e) => {
    if (!isModalOpen()) return;
    if (e.key !== "Tab") return;

    const focusables = getFocusableInModal();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const fillModal = (data) => {
    if (!data) return;

    if (modalType) modalType.textContent = data.type;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    // Gradient
    if (modalGradient) {
      modalGradient.className = `thumb-grad ${data.gradientClass || "g1"}`;
    }

    // Bullets
    if (modalBullets) {
      modalBullets.innerHTML = "";
      data.bullets.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        modalBullets.appendChild(li);
      });
    }

    // Tags
    if (modalTags) {
      modalTags.innerHTML = "";
      data.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        modalTags.appendChild(span);
      });
    }

    // CTA link stays in-page (local)
    if (modalCta) modalCta.setAttribute("href", "#contact");
  };

  const openModal = (projectId) => {
    if (!modal) return;
    const data = PROJECTS[projectId];
    if (!data) return;

    lastFocusedEl = document.activeElement;

    fillModal(data);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // Focus first meaningful element (close button)
    const closeBtn = $("[data-close-modal]", modal);
    (closeBtn || modalDialog)?.focus?.();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  };

  // Open modal from project cards
  $$(".project-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      const id = card?.getAttribute("data-project-id");
      if (id) openModal(id);
    });
  });

  // Close modal (overlay and buttons)
  if (modal) {
    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.hasAttribute("data-close-modal")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (!isModalOpen()) return;
      if (e.key === "Escape") closeModal();
      trapFocus(e);
    });

    // Close if focus leaves dialog via click to overlay already handled
  }

  // -----------------------------
  // Back to top (bonus)
  // -----------------------------
  const backToTop = $(".back-to-top");
  const toggleBackToTop = () => {
    if (!backToTop) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    backToTop.classList.toggle("is-visible", y > 700);
  };

  if (backToTop) {
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -----------------------------
  // Contact form validation (non-bloquante)
  // -----------------------------
  const form = $("#contactForm");
  const statusEl = $("#formStatus");

  const setFieldError = (name, message) => {
    const field = $(`#${name}`);
    const errorEl = $(`[data-error-for="${name}"]`);
    if (!field || !errorEl) return;

    if (message) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  };

  const isValidEmail = (email) => {
    // Simple, robust enough for front validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const validateForm = () => {
    let ok = true;

    const name = $("#name")?.value?.trim() || "";
    const email = $("#email")?.value?.trim() || "";
    const message = $("#message")?.value?.trim() || "";

    // Reset
    setFieldError("name", "");
    setFieldError("email", "");
    setFieldError("message", "");

    if (name.length < 2) {
      setFieldError("name", "Merci d’indiquer un nom (au moins 2 caractères).");
      ok = false;
    }
    if (!isValidEmail(email)) {
      setFieldError("email", "Merci d’indiquer un email valide.");
      ok = false;
    }
    if (message.length < 10) {
      setFieldError("message", "Votre message est un peu court (10 caractères minimum).");
      ok = false;
    }

    return ok;
  };

  if (form) {
    // Inline validation on blur
    ["name", "email", "message"].forEach((id) => {
      const el = $(`#${id}`);
      if (!el) return;
      el.addEventListener("blur", () => {
        validateForm();
      });
      el.addEventListener("input", () => {
        // Remove error as user types (gentle)
        if (el.classList.contains("is-invalid")) validateForm();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = validateForm();
      if (!statusEl) return;

      if (ok) {
        // Non-blocking confirmation (pas d'envoi réel — fonctionne en local)
        statusEl.textContent = "Message prêt à être envoyé ✅ (démo locale). Vous pouvez aussi me contacter par email.";
        form.reset();

        // Clear invalid styles
        ["name", "email", "message"].forEach((id) => setFieldError(id, ""));

        // Subtle auto-clear
        window.setTimeout(() => {
          statusEl.textContent = "";
        }, 5000);
      } else {
        statusEl.textContent = "Veuillez corriger les champs signalés.";
      }
    });
  }

  // -----------------------------
  // Small polish: smooth anchor offset with sticky header
  // -----------------------------
  const header = $(".site-header");
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0);

  // Intercept nav clicks to apply offset (still local)
  $$(".nav-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 10;
      window.scrollTo({ top: clamp(y, 0, Number.MAX_SAFE_INTEGER), behavior: "smooth" });
    });
  });
})();
