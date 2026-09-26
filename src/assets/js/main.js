// Mobile menu
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("hidden", open);
});

// Scroll-to-top button
const scrollTop = document.querySelector("[data-scroll-top]");
if (scrollTop) {
  const update = () => scrollTop.toggleAttribute("data-visible", window.scrollY > 400);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Home page hero slider (fade, 6s autoplay, pauses on hover/focus)
const slider = document.querySelector("[data-slider]");
if (slider) {
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dots = [...slider.querySelectorAll("[data-slide-dot]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer;

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const active = n === current;
      s.classList.toggle("opacity-100", active);
      s.classList.toggle("opacity-0", !active);
      s.classList.toggle("pointer-events-none", !active);
      s.toggleAttribute("aria-hidden", !active);
      s.querySelectorAll("a").forEach((a) => (a.tabIndex = active ? 0 : -1));
    });
    dots.forEach((d, n) => d.setAttribute("aria-selected", String(n === current)));
  };
  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => show(current + 1), 6000);
  };
  const stop = () => clearInterval(timer);

  dots.forEach((d, n) => d.addEventListener("click", () => { show(n); start(); }));
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);

  // Swipe on touch devices
  let x0 = null;
  slider.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  slider.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); start(); }
    x0 = null;
  });

  show(0);
  start();
}

// Gallery lightbox
const dialog = document.querySelector("[data-lightbox-dialog]");
if (dialog) {
  const links = [...document.querySelectorAll("[data-lightbox]")];
  const img = dialog.querySelector("[data-lightbox-img]");
  const count = dialog.querySelector("[data-lightbox-count]");
  let index = 0;

  const open = (i) => {
    index = (i + links.length) % links.length;
    img.src = links[index].href;
    img.alt = links[index].querySelector("img")?.alt ?? "";
    count.textContent = `${index + 1} / ${links.length}`;
    if (!dialog.open) dialog.showModal();
  };

  links.forEach((link, i) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    }),
  );
  dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-lightbox-prev]").addEventListener("click", () => open(index - 1));
  dialog.querySelector("[data-lightbox-next]").addEventListener("click", () => open(index + 1));
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.tagName === "FIGURE") dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") open(index - 1);
    if (e.key === "ArrowRight") open(index + 1);
  });
  dialog.addEventListener("close", () => img.removeAttribute("src"));
}
