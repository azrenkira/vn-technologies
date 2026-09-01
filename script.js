const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const navigationLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const productFilters = [...document.querySelectorAll("[data-product-filter]")];
const productCards = [...document.querySelectorAll("[data-product-card]")];
const productCount = document.querySelector("[data-product-count]");

/**
 * Creates a short reference that can connect a browser error to a support report.
 *
 * @returns {string} A non-sensitive, locally generated diagnostic reference.
 * Side effects: None.
 */
function createClientReference() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `VN-${timePart}-${randomPart}`;
}

/**
 * Converts an unknown JavaScript failure into a short message safe for local logging.
 *
 * @param {unknown} error - The thrown value or rejected promise reason.
 * @returns {string} A single-line message limited to 240 characters.
 * Side effects: None. This intentionally omits stack traces and page data.
 */
function getSafeErrorMessage(error) {
  const rawMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return rawMessage.replace(/\s+/g, " ").slice(0, 240);
}

/**
 * Records a structured client diagnostic without transmitting visitor information.
 *
 * @param {unknown} error - The original error or rejection reason.
 * @param {string} context - The site operation that failed.
 * @returns {string} The reference written to the browser console.
 * Side effects: Writes one structured entry to the local browser console only.
 */
function reportClientError(error, context) {
  const reference = createClientReference();
  console.error("VN site enhancement error", {
    code: "VN-WEB-001",
    reference,
    context,
    message: getSafeErrorMessage(error),
    occurredAt: new Date().toISOString(),
  });
  return reference;
}

/**
 * Updates the copyright year from the visitor's current calendar year.
 *
 * @returns {void}
 * Side effects: Changes the text of every element marked with data-year.
 */
function initializeCopyrightYears() {
  const currentYear = String(new Date().getFullYear());
  const yearElements = document.querySelectorAll("[data-year]");
  for (const yearElement of yearElements) yearElement.textContent = currentYear;
}

/**
 * Applies the compact header style once the visitor scrolls beyond 20 pixels.
 *
 * @returns {void}
 * Side effects: Toggles the scrolled class on the page header.
 */
function updateHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

/**
 * Closes the mobile menu and restores the toggle's accessible label.
 *
 * @returns {void}
 * Side effects: Updates navigation classes and ARIA attributes.
 */
function closeMenu() {
  navigation?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
}

/**
 * Opens or closes the mobile navigation when its toggle is activated.
 *
 * @returns {void}
 * Side effects: Updates navigation classes and ARIA attributes.
 */
function toggleMenu() {
  if (!menuToggle) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  navigation?.classList.toggle("open", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
}

/**
 * Closes the mobile menu after a visitor selects any navigation link.
 *
 * @returns {void}
 * Side effects: Delegates to closeMenu.
 */
function handleMenuLinkSelection() {
  closeMenu();
}

/**
 * Closes the mobile menu when the Escape key is pressed.
 *
 * @param {KeyboardEvent} event - The document keyboard event.
 * @returns {void}
 * Side effects: May close the mobile menu.
 */
function handleDocumentKeydown(event) {
  if (event.key === "Escape") closeMenu();
}

/**
 * Closes an open mobile menu when a visitor clicks outside it.
 *
 * @param {MouseEvent} event - The document click event.
 * @returns {void}
 * Side effects: May close the mobile menu.
 */
function handleOutsideMenuClick(event) {
  const target = event.target;
  const clickedOutside =
    target instanceof Node &&
    navigation?.classList.contains("open") &&
    !navigation.contains(target) &&
    !menuToggle?.contains(target);
  if (clickedOutside) closeMenu();
}

/**
 * Connects mobile-navigation controls and header scroll behavior.
 *
 * @returns {void}
 * Side effects: Registers event listeners and sets the initial header state.
 */
function initializeNavigation() {
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  menuToggle?.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", handleDocumentKeydown);
  document.addEventListener("click", handleOutsideMenuClick);

  const menuLinks = document.querySelectorAll(".site-nav a");
  for (const link of menuLinks) link.addEventListener("click", handleMenuLinkSelection);
}

/**
 * Orders visible section entries from most visible to least visible.
 *
 * @param {IntersectionObserverEntry} first - The first observed section.
 * @param {IntersectionObserverEntry} second - The second observed section.
 * @returns {number} A descending comparison based on intersection ratio.
 * Side effects: None.
 */
function compareIntersectionRatio(first, second) {
  return second.intersectionRatio - first.intersectionRatio;
}

/**
 * Marks the navigation link that corresponds to the most visible home section.
 *
 * @param {IntersectionObserverEntry[]} entries - Changed section intersections.
 * @returns {void}
 * Side effects: Updates active classes and aria-current attributes.
 */
function handleActiveSectionEntries(entries) {
  const visibleEntries = [];
  for (const entry of entries) {
    if (entry.isIntersecting) visibleEntries.push(entry);
  }

  visibleEntries.sort(compareIntersectionRatio);
  const visible = visibleEntries[0];
  if (!visible) return;

  for (const link of navigationLinks) {
    const isActive = link.getAttribute("href") === `#${visible.target.id}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

/**
 * Observes home-page sections so the navigation reflects the reading position.
 *
 * @returns {void}
 * Side effects: Creates and starts an IntersectionObserver when supported.
 */
function initializeSectionTracking() {
  if (!("IntersectionObserver" in window) || sections.length === 0) return;
  const observer = new IntersectionObserver(handleActiveSectionEntries, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.2, 0.5],
  });
  for (const section of sections) observer.observe(section);
}

/**
 * Filters finished-product cards using the category button a visitor selected.
 *
 * @param {MouseEvent} event - Click from a button marked with data-product-filter.
 * @returns {void}
 * Side effects: Updates filter states, card visibility, and the visible-product count.
 */
function handleProductFilterClick(event) {
  const selectedButton = event.currentTarget;
  if (!(selectedButton instanceof HTMLButtonElement)) return;

  const selectedCategory = selectedButton.dataset.productFilter;
  let visibleProducts = 0;
  for (const filter of productFilters) {
    const isActive = filter === selectedButton;
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  }

  for (const card of productCards) {
    const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
    card.hidden = !isVisible;
    if (isVisible) visibleProducts += 1;
  }
  if (productCount) productCount.textContent = String(visibleProducts);
}

/**
 * Connects category buttons to the finished-products portfolio.
 *
 * @returns {void}
 * Side effects: Registers click listeners on product-filter buttons.
 */
function initializeProductFilters() {
  for (const filter of productFilters) filter.addEventListener("click", handleProductFilterClick);
}

/**
 * Reveals elements once they enter the viewport, then stops observing them.
 *
 * @param {IntersectionObserverEntry[]} entries - Changed reveal intersections.
 * @param {IntersectionObserver} observer - Observer controlling reveal elements.
 * @returns {void}
 * Side effects: Adds the visible class and removes completed observations.
 */
function handleRevealEntries(entries, observer) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  }
}

/**
 * Enables progressive reveal motion while preserving a no-JavaScript fallback.
 *
 * @returns {void}
 * Side effects: Creates an observer or immediately reveals every marked element.
 */
function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    for (const element of revealElements) element.classList.add("visible");
    return;
  }

  const observer = new IntersectionObserver(handleRevealEntries, { threshold: 0.12 });
  for (const element of revealElements) observer.observe(element);
}

/**
 * Builds the MaliCloud service card used on the homepage service grid.
 *
 * @returns {HTMLElement} A complete service-card element ready for insertion.
 * Side effects: Creates DOM elements but does not attach them to the document.
 */
function createMaliCloudServiceCard() {
  const card = document.createElement("article");
  card.className = "service-card service-card-wide reveal";
  card.dataset.malicloudService = "";
  card.innerHTML = `
    <span class="service-index">08</span>
    <div class="service-wide-intro">
      <div class="service-icon" aria-hidden="true">☁</div>
      <div>
        <div class="product-status" style="display:inline-flex;margin:0 0 14px">
          <span></span>
          R&amp;D / prototyping
        </div>
        <h3>MaliCloud — Private AI &amp; Resilient Local Computing</h3>
        <p>
          An offline-capable edge platform concept connecting an organization’s
          existing computers for application continuity, private AI, document
          replication, backup, and recovery.
        </p>
      </div>
    </div>
    <ul class="service-wide-list">
      <li>Existing-device resource pooling</li>
      <li>Offline-first local applications</li>
      <li>Private on-premise AI assistance</li>
      <li>Encrypted document replication</li>
      <li>Automatic node health monitoring</li>
      <li>Failover and delayed cloud synchronization</li>
    </ul>
    <a class="text-link" href="malicloud.html" style="margin-top:24px">
      Explore MaliCloud <span aria-hidden="true">→</span>
    </a>
  `;
  return card;
}

/**
 * Adds the MaliCloud service card once on pages containing the service grid.
 *
 * @returns {void}
 * Side effects: Appends a new service card to the homepage and reveals it.
 */
function addMaliCloudServiceCard() {
  const serviceGrid = document.querySelector(".service-grid");
  if (!serviceGrid || serviceGrid.querySelector("[data-malicloud-service]")) return;
  const card = createMaliCloudServiceCard();
  serviceGrid.append(card);
  card.classList.add("visible");
}

/**
 * Converts uncaught browser errors into structured, local-only diagnostics.
 *
 * @param {ErrorEvent} event - The browser's uncaught error event.
 * @returns {void}
 * Side effects: Writes one safe diagnostic entry to the local console.
 */
function handleGlobalError(event) {
  reportClientError(event.error ?? event.message, "uncaught-window-error");
}

/**
 * Converts unhandled promise rejections into structured, local-only diagnostics.
 *
 * @param {PromiseRejectionEvent} event - The browser's unhandled rejection event.
 * @returns {void}
 * Side effects: Writes one safe diagnostic entry to the local console.
 */
function handleUnhandledRejection(event) {
  reportClientError(event.reason, "unhandled-promise-rejection");
}

/**
 * Starts every progressive enhancement used across the VN Technologies website.
 *
 * @returns {void}
 * Side effects: Updates the DOM and registers event observers and listeners.
 */
function initializeSite() {
  initializeCopyrightYears();
  initializeNavigation();
  initializeSectionTracking();
  initializeProductFilters();
  addMaliCloudServiceCard();
  initializeRevealAnimations();
}

window.addEventListener("error", handleGlobalError);
window.addEventListener("unhandledrejection", handleUnhandledRejection);

try {
  initializeSite();
} catch (error) {
  reportClientError(error, "site-initialization");
  document.documentElement.dataset.enhancementStatus = "degraded";
}
