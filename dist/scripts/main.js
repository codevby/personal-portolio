const root = document.documentElement;
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-toggle]");
const themeButton = document.querySelector("[data-theme-toggle]");
const yearEl = document.getElementById("year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const preferredTheme = localStorage.getItem("theme");
if (preferredTheme) {
  root.setAttribute("data-theme", preferredTheme);
}

const setThemeButtonLabel = () => {
  if (!themeButton) return;
  const current = root.getAttribute("data-theme") === "light" ? "Dark Mode" : "Light Mode";
  themeButton.textContent = current;
};
setThemeButtonLabel();

themeButton?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  const nextTheme = isLight ? "dark" : "light";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
  setThemeButtonLabel();
});

const closeMenu = () => {
  nav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    nav?.querySelector("a")?.focus();
  }
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!nav || !menuButton) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (!nav.classList.contains("open")) return;
  if (nav.contains(target) || menuButton.contains(target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!nav?.classList.contains("open")) return;
  closeMenu();
  menuButton?.focus();
});

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion) {
  // Respect user motion preferences by revealing content immediately.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element, index) => {
    const delay = Math.min(index * 70, 280);
    element.style.transitionDelay = `${delay}ms`;
    observer.observe(element);
  });
}
