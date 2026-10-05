/* =============================================================
   SCRIPT.JS  —  a bit of JavaScript
   =============================================================
   This file handles four small jobs: the mobile menu, the footer
   year, the photo slideshow, and the click-to-enlarge photo
   lightbox. You probably don't need to touch it, but here's what
   each part does so nothing feels like magic.
   ============================================================= */

/* -------------------------------------------------------------
   1. MOBILE MENU
   On small screens, tapping the hamburger button shows/hides the
   navigation links.
   ------------------------------------------------------------- */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    // Add or remove the "open" class that makes the menu visible.
    const isOpen = links.classList.toggle("nav__links--open");
    // Tell screen readers whether the menu is open, and match the label to it.
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu again after tapping a link.
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("nav__links--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* -------------------------------------------------------------
   2. AUTOMATIC YEAR IN THE FOOTER
   Fills in the current year so you never have to update it.
   ------------------------------------------------------------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------
   3. PHOTO SLIDESHOW (the Gallery section)
   Swaps the visible photo automatically every few seconds, and
   pauses whenever a visitor hovers or keyboard-focuses it. The
   arrows and dots also work with a click/tap. Add more photos by
   copying a ".slideshow__slide" <img> AND a matching
   ".slideshow__dot" <button> in index.html — this code adapts to
   however many you add.
   ------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.querySelectorAll("[data-slideshow]").forEach((root) => {
  const slides = Array.from(root.querySelectorAll(".slideshow__slide"));
  const dots = Array.from(root.querySelectorAll(".slideshow__dot"));
  const prevButton = root.querySelector("[data-slideshow-prev]");
  const nextButton = root.querySelector("[data-slideshow-next]");
  let current = 0;
  let timer = null;

  function showSlide(index) {
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("aria-hidden", "true");
    if (dots[current]) {
      dots[current].classList.remove("is-active");
      dots[current].setAttribute("aria-selected", "false");
    }

    // Wrap around at either end, so "next" from the last slide goes
    // back to the first (and "previous" from the first goes to the last).
    current = (index + slides.length) % slides.length;

    slides[current].classList.add("is-active");
    slides[current].removeAttribute("aria-hidden");
    if (dots[current]) {
      dots[current].classList.add("is-active");
      dots[current].setAttribute("aria-selected", "true");
    }
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    // Respect "reduce motion", and don't bother if there's only one photo.
    if (prefersReducedMotion || slides.length < 2) return;
    timer = setInterval(() => showSlide(current + 1), 3000);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextButton?.addEventListener("click", (event) => {
    // Stops the click also bubbling up to the frame itself, which
    // would otherwise open the enlarge-photo lightbox at the same time.
    event.stopPropagation();
    showSlide(current + 1);
    restartAutoplay();
  });

  prevButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    showSlide(current - 1);
    restartAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoplay();
    });
  });

  // Pause on hover and on keyboard focus, so it never fights a
  // visitor who's actually looking at (or tabbing through) it.
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  startAutoplay();
});

/* -------------------------------------------------------------
   4. PHOTO LIGHTBOX
   Click any photo in a ".polaroid" frame and it grows to fill the
   screen over a dimmed copy of the normal page. Close it with the
   x button, the Esc key, or by clicking the dimmed background.
   Side arrows (or the left/right arrow keys) flip through the other
   photos in the SAME project only, stopping at the first and last
   photo (the arrow greys out) rather than looping round — a
   project's photos are grouped
   by a shared data-gallery="name" attribute in index.html. Photos
   with no group (or alone in one) simply have no arrows. The overlay
   itself is built here in JavaScript, so it needs no extra HTML.
   ------------------------------------------------------------- */
(function () {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Enlarged photo");
  overlay.hidden = true;
  overlay.innerHTML =
    '<button class="lightbox__close" type="button" aria-label="Close enlarged photo">&times;</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">&#8249;</button>' +
    '<img class="lightbox__img" alt="" />' +
    '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">&#8250;</button>' +
    '<p class="lightbox__count" aria-live="polite"></p>';
  document.body.appendChild(overlay);

  const bigImg = overlay.querySelector(".lightbox__img");
  const closeBtn = overlay.querySelector(".lightbox__close");
  const prevBtn = overlay.querySelector(".lightbox__nav--prev");
  const nextBtn = overlay.querySelector(".lightbox__nav--next");
  const count = overlay.querySelector(".lightbox__count");
  let lastFocused = null;
  let photos = []; // the photos of the project currently open
  let index = 0;

  // A frame's photo(s). A slideshow frame holds several photos, all
  // of which belong to the project's set.
  function photosIn(frame) {
    const slides = frame.querySelectorAll(".slideshow__slide");
    return slides.length ? Array.from(slides) : [frame.querySelector("img")];
  }

  // Every photo in one project, in page order.
  function projectPhotos(frame) {
    const group = frame.closest("[data-gallery]");
    if (!group) return photosIn(frame);
    const name = group.dataset.gallery;
    const list = [];
    document
      .querySelectorAll('[data-gallery="' + name + '"] .polaroid')
      .forEach((f) => list.push(...photosIn(f)));
    return list;
  }

  function show(i) {
    // A stopper at each end: the first and last photo of a project
    // don't wrap round to the other end.
    if (i < 0 || i >= photos.length) return;
    index = i;
    const img = photos[index];
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt;
    const many = photos.length > 1;
    prevBtn.hidden = nextBtn.hidden = count.hidden = !many;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === photos.length - 1;
    count.textContent = index + 1 + " / " + photos.length;
    // If the button that had focus just switched off, don't lose focus.
    if (document.activeElement && document.activeElement.disabled) closeBtn.focus();
  }

  function open(frame) {
    lastFocused = document.activeElement;
    photos = projectPhotos(frame);
    const shown = frame.querySelector("img.is-active") || frame.querySelector("img");
    show(Math.max(0, photos.indexOf(shown)));
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    // Let the browser register the change first so the fade-in plays.
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".polaroid").forEach((frame) => {
    if (!frame.querySelector("img")) return;
    frame.classList.add("is-zoomable");
    frame.tabIndex = 0;
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", "Enlarge photo");
    frame.addEventListener("click", () => open(frame));
    frame.addEventListener("keydown", (event) => {
      // Only for the frame itself getting Enter/Space — not a
      // bubbled-up keypress from a prev/next button inside it (those
      // already have their own Enter/Space behaviour as buttons).
      if (event.target !== frame) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(frame);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  // Clicking the dimmed area (but not the photo or buttons) also closes.
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") close();
    if (photos.length > 1 && event.key === "ArrowLeft") show(index - 1);
    if (photos.length > 1 && event.key === "ArrowRight") show(index + 1);
  });
  // Keep Tab cycling between the lightbox buttons, not the page behind.
  overlay.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const buttons = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden && !b.disabled);
    const at = buttons.indexOf(document.activeElement);
    event.preventDefault();
    const step = event.shiftKey ? -1 : 1;
    buttons[(at + step + buttons.length) % buttons.length].focus();
  });
})();