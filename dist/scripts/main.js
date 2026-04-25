const root = document.documentElement;
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-toggle]");
const themeButton = document.querySelector("[data-theme-toggle]");
const form = document.getElementById("contact-form");
const yearEl = document.getElementById("year");

const preferredTheme = localStorage.getItem("theme");
if (preferredTheme) {
  root.setAttribute("data-theme", preferredTheme);
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.setAttribute("data-theme", "light");
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

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks! Your message has been received.");
    form.reset();
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

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

document.querySelectorAll(".reveal").forEach((element, index) => {
  const delay = Math.min(index * 70, 280);
  element.style.transitionDelay = `${delay}ms`;
  observer.observe(element);
});
