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
      title: "Photographies Cartes Postales",
      type: "Photographies",
      category: "communication",
      desc:
        "Conception d'une série de photos pour des cartes postales. Travail sur la composition, les couleurs et l'atmosphère pour créer des visuels authentiques et mémorables.",
      bullets: [
        "Sélection des lieux et repérage des meilleures prises de vue.",
        "Prise de photos avec attention particulière à la lumière naturelle.",
        "Retouche légère pour un rendu fidèle et harmonieux.",
        "Adaptation au format carte postale."
      ],
      tags: ["Photographie", "Canva", "Retouche", "Composition"],
      gradientClass: "g1",
      images: [
        "assets/images/cartes-postales1.JPG",
        "assets/images/cartes-postales2.JPG",
        "assets/images/cartes-postales3.JPG",
        "assets/images/cartes-postales4.JPG"
      ]
    },
    p2: {
      title: "Production audiovisuelle",
      type: "Teaser vidéo",
      category: "audiovisuel",
      desc:
        "Participation à la réalisation d'un film qui porte sur la richesse historique et culturelle de Bordeaux, dans le cadre du projet d'intégration organisé par mon IUT.",
      bullets: [
        "Participation aux repérages et à la définition du storyboard.",
        "Tournage sur plusieurs lieux emblématiques de Bordeaux.",
        "Montage et synchronisation audio.",
        "Travail en équipe sur un projet collectif.",
      ],
      tags: ["Premiere Pro", "Tournage", "Montage", "Travail d'équipe"],
      gradientClass: "g2",
    },
    p3: {
      title: "Atelier Coach Me",
      type: "Identité visuelle",
      category: "design",
      desc:
        "Création de posts photos et vidéos pour les réseaux sociaux d'une coach nutritioniste.",
      bullets: [
        "Analyse de communication digitale",
        "Elaboration d'une nouvelle stratégie social média (SOME)",
        "Prises Vidéo",
        "Gestion de projet",
        "Analyse de charte graphique",
        "Analyses de marché et des tendances de consommation"
      ],
      tags: ["Production de contenu", "Storytelling", "Gestion de projet", "Analyse de marché"],
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
        "Choix typo + hiérarchie de l'information.",
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

  // Carousel state
  let currentSlide = 0;
  let carouselImages = [];

  const carouselTrack = $("#carouselTrack");
  const carouselDots = $("#carouselDots");
  const carouselPrev = $("#carouselPrev");
  const carouselNext = $("#carouselNext");
  const modalCarousel = $("#modalCarousel");

  const updateCarousel = () => {
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    // Update dots
    $$(".carousel-dot", carouselDots).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    updateCarousel();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
  };

  const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
  };

  // Carousel navigation events
  if (carouselPrev) carouselPrev.addEventListener("click", prevSlide);
  if (carouselNext) carouselNext.addEventListener("click", nextSlide);

  // -----------------------------
  // Lightbox logic
  // -----------------------------
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");
  const lightboxCounter = $("#lightboxCounter");

  let lightboxIndex = 0;

  const updateLightbox = () => {
    if (!lightboxImg || !carouselImages.length) return;
    // Fade out slightly? Or just swap
    lightboxImg.style.opacity = "0.5";
    setTimeout(() => {
      lightboxImg.src = carouselImages[lightboxIndex];
      lightboxImg.style.opacity = "1";
    }, 150);

    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${carouselImages.length}`;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox || !carouselImages.length) return;
    lightboxIndex = index;
    lightboxImg.src = carouselImages[lightboxIndex]; // Instant first load
    if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} / ${carouselImages.length}`;

    lightbox.setAttribute("aria-hidden", "false");
    // Body is already hidden by modal, but redundancy is fine
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.setAttribute("aria-hidden", "true");
    // Do NOT reset body overflow if modal is open (which it is)
    if (!isModalOpen()) {
      document.body.style.overflow = "";
    }
  };

  const nextLightbox = () => {
    lightboxIndex = (lightboxIndex + 1) % carouselImages.length;
    updateLightbox();
  };

  const prevLightbox = () => {
    lightboxIndex = (lightboxIndex - 1 + carouselImages.length) % carouselImages.length;
    updateLightbox();
  };

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      const target = e.target;
      if (target && (target.hasAttribute("data-close-lightbox") || target === lightbox || target.closest(".lightbox-overlay"))) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); prevLightbox(); });
  if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); nextLightbox(); });

  const fillModal = (data, projectId) => {
    if (!data) return;

    if (modalType) modalType.textContent = data.type;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    // ✅ Carousel uniquement pour p1
    const shouldUseCarousel =
      projectId === "p1" &&
      Array.isArray(data.images) &&
      data.images.length > 0;

    if (shouldUseCarousel) {
      // Show carousel, hide gradient
      if (modalGradient) modalGradient.style.display = "none";
      if (modalCarousel) modalCarousel.removeAttribute("hidden");

      // Reset carousel state
      currentSlide = 0;
      carouselImages = data.images.slice();

      // Build slides
      if (carouselTrack) {
        carouselTrack.innerHTML = "";
        carouselImages.forEach((src, i) => {
          const slide = document.createElement("div");
          slide.className = "carousel-slide";

          const img = document.createElement("img");
          img.src = src;
          img.alt = `${data.title} - Image ${i + 1}`;
          img.loading = "lazy";
          img.addEventListener("click", () => openLightbox(i));

          slide.appendChild(img);
          carouselTrack.appendChild(slide);
        });
      }

      // Build dots
      if (carouselDots) {
        carouselDots.innerHTML = "";
        carouselImages.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.className = `carousel-dot${i === 0 ? " is-active" : ""}`;
          dot.type = "button";
          dot.setAttribute("aria-label", `Aller à l'image ${i + 1}`);
          dot.addEventListener("click", () => goToSlide(i));
          carouselDots.appendChild(dot);
        });
      }

      // Optionnel : cacher prev/next si 1 seule image
      const navDisplay = carouselImages.length > 1 ? "" : "none";
      if (carouselPrev) carouselPrev.style.display = navDisplay;
      if (carouselNext) carouselNext.style.display = navDisplay;

      updateCarousel();
    } else {
      // ✅ Tous les autres projets : pas de carousel
      carouselImages = [];
      currentSlide = 0;

      if (modalCarousel) modalCarousel.setAttribute("hidden", "");
      if (modalGradient) {
        modalGradient.style.display = "";
        modalGradient.className = `thumb-grad ${data.gradientClass || "g1"}`;
      }
    }

    // Bullets
    if (modalBullets) {
      modalBullets.innerHTML = "";
      (data.bullets || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        modalBullets.appendChild(li);
      });
    }

    // Tags
    if (modalTags) {
      modalTags.innerHTML = "";
      (data.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        modalTags.appendChild(span);
      });
    }

    if (modalCta) modalCta.setAttribute("href", "#contact");
  };

  const openModal = (projectId) => {
    if (!modal) return;
    const data = PROJECTS[projectId];
    if (!data) return;

    lastFocusedEl = document.activeElement;

    // ✅ on passe projectId à fillModal
    fillModal(data, projectId);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

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
      // Lightbox features
      if (lightbox && lightbox.getAttribute("aria-hidden") === "false") {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevLightbox();
        if (e.key === "ArrowRight") nextLightbox();
        return;
      }

      if (!isModalOpen()) return;
      if (e.key === "Escape") closeModal();
      trapFocus(e);
    });
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
      setFieldError("name", "Merci d'indiquer un nom (au moins 2 caractères).");
      ok = false;
    }
    if (!isValidEmail(email)) {
      setFieldError("email", "Merci d'indiquer un email valide.");
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
