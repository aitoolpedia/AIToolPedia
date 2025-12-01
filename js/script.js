const toolsPerPage = 20;
const toolsSection = document.getElementById("tools-section");
const pagination = document.getElementById("pagination");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const pricingFilter = document.getElementById("pricingFilter");
const resetFilters = document.getElementById("resetFilters");

let allTools = [];
let currentPage = 1;

// ---------- Fetch and Initialize ----------
fetch("data/tools.json")
  .then(res => res.json())
  .then(data => {
    allTools = data;
    populateCategories(data);
    renderTools();
  })
  .catch(err => {
    console.error("Error loading tools:", err);
    toolsSection.innerHTML = "<p>⚠️ Failed to load tools. Please try again later.</p>";
  });

// ---------- Rendering Tools ----------
function renderTools(page = 1) {
  currentPage = page;
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const pricing = pricingFilter.value;

  const filteredTools = allTools.filter(tool => {
    const matchesSearch =
      tool.Name.toLowerCase().includes(query) ||
      tool.Description.toLowerCase().includes(query);
    const matchesCategory =
      !category || tool.Category.toLowerCase().includes(category.toLowerCase());
    const matchesPricing =
      !pricing || tool.Pricing.toLowerCase() === pricing.toLowerCase();
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const start = (page - 1) * toolsPerPage;
  const end = start + toolsPerPage;
  const currentTools = filteredTools.slice(start, end);

  toolsSection.innerHTML = "";

  if (currentTools.length === 0) {
    toolsSection.innerHTML = "<p>No tools found. Try different filters.</p>";
  } else {
    currentTools.forEach(tool => {
      const card = document.createElement("div");
      card.classList.add("tool-card");
      card.innerHTML = `
        <div class="tool-header">
          <img src="${tool.LOGO}" alt="${tool.Name} logo" class="tool-logo" loading="lazy">
          <span class="pricing-tag">${tool.Pricing}</span>
          <button class="bookmark-btn" aria-label="Bookmark Tool" data-id="${tool.ID}">
            <i class="bi bi-bookmark"></i>
          </button>
        </div>
        <h3 class="tool-name">${tool.Name}</h3>
        <p class="tool-desc">${tool.Description}</p>
        <div class="tool-meta">
          <div class="categories">
            ${tool.Category.split(",")
              .map(cat => `<a href="#">${cat.trim()}</a>`)
              .join("")}
          </div>
        </div>
        <a href="${tool.Link}" target="_blank" class="visit-btn">Visit</a>
      `;

      toolsSection.appendChild(card);
    });
  }

  renderPagination(totalPages);
}

// ---------- Pagination ----------
function renderPagination(totalPages) {
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const firstPages = [1, 2];
  const lastPages = [totalPages - 1, totalPages];
  const aroundCurrent = 2; // how many pages before/after current

  function addPage(num) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = num;
    link.classList.add("page-btn");
    if (num === currentPage) link.classList.add("active");
    link.onclick = () => {
      renderTools(num);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    pagination.appendChild(link);
  }

  function addDots() {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.classList.add("dots");
    pagination.appendChild(dots);
  }

  // Prev button
  if (currentPage > 1) {
    const prev = document.createElement("a");
    prev.href = "#";
    prev.textContent = "← Prev";
    prev.classList.add("page-btn");
    prev.onclick = () => renderTools(currentPage - 1);
    pagination.appendChild(prev);
  }

  // First 2 pages
  firstPages.forEach(page => {
    if (page <= totalPages) addPage(page);
  });

  // Show dots if middle section doesn't touch first pages
  const startMiddle = currentPage - aroundCurrent;
  const endMiddle = currentPage + aroundCurrent;

  if (startMiddle > 3) addDots();

  // Middle section (pages around current page)
  for (let i = Math.max(startMiddle, 3); i <= Math.min(endMiddle, totalPages - 2); i++) {
    addPage(i);
  }

  // Show dots if middle section doesn't touch last pages
  if (endMiddle < totalPages - 2) addDots();

  // Last 2 pages
  lastPages.forEach(page => {
    if (page > 2) addPage(page);
  });

  // Next button
  if (currentPage < totalPages) {
    const next = document.createElement("a");
    next.href = "#";
    next.textContent = "Next →";
    next.classList.add("page-btn");
    next.onclick = () => renderTools(currentPage + 1);
    pagination.appendChild(next);
  }
}


// ---------- Populate Category Filter ----------
function populateCategories(tools) {
  const categories = new Set();
  tools.forEach(t => {
    t.Category.split(",").forEach(cat => categories.add(cat.trim()));
  });
   // Convert to array and sort alphabetically (case-insensitive)
  const sortedCategories = Array.from(categories).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  sortedCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// ---------- Filter Events ----------
searchInput.addEventListener("input", () => renderTools());
categoryFilter.addEventListener("change", () => renderTools());
pricingFilter.addEventListener("change", () => renderTools());
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  pricingFilter.value = "";
  renderTools();
});

// Taking in category Selection by Default from HomePage
// ✅ Handle category pre-selection from URL (coming from Trending categories on homepage)
// ---------- Detect category from URL ----------
function applyCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");

  if (categoryFromURL) {
    categoryFilter.value = categoryFromURL;
    renderTools(); // re-render with selected category filtered
  }
}

// Run after tools are loaded
fetch("data/tools.json")
  .then(res => res.json())
  .then(data => {
    allTools = data;
    populateCategories(data);
    applyCategoryFromURL(); // ⬅️ ADD THIS LINE
    renderTools();
  })
  .catch(err => {
    console.error("Error loading tools:", err);
    toolsSection.innerHTML = "<p>⚠️ Failed to load tools. Please try again later.</p>";
  });


