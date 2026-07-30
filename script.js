const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const menuLinks = [...document.querySelectorAll(".site-nav a")];
const navigationLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const reveals = [...document.querySelectorAll(".reveal")];
const year = document.querySelector("[data-year]");
const productFilters = [...document.querySelectorAll("[data-product-filter]")];
const productCards = [...document.querySelectorAll("[data-product-card]")];
const productCount = document.querySelector("[data-product-count]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  navigation?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  navigation?.classList.toggle("open", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (
    target instanceof Node &&
    navigation?.classList.contains("open") &&
    !navigation.contains(target) &&
    !menuToggle?.contains(target)
  ) {
    closeMenu();
  }
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.2, 0.5],
  },
);

sections.forEach((section) => activeSectionObserver.observe(section));

productFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.productFilter;
    let visibleProducts = 0;

    productFilters.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    productCards.forEach((card) => {
      const isVisible =
        selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleProducts += 1;
    });

    if (productCount) {
      productCount.textContent = String(visibleProducts);
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("visible"));
}
