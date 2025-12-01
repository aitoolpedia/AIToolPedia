// bookmarks.js

// ---- Helpers ----
const getBookmarks = () => JSON.parse(localStorage.getItem("bookmarkedTools")) || [];
const saveBookmarks = (data) => localStorage.setItem("bookmarkedTools", JSON.stringify(data));

// ---- Globals ----
let currentPage = 1;
const toolsPerPage = 20;

// ---- DOM References ----
const container = document.getElementById("bookmarkedTools");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const pagination = document.querySelector(".pagination");

// ---- Render ----
function renderPage() {
  const bookmarks = getBookmarks();
  container.innerHTML = "";

  if (bookmarks.length === 0) {
    container.innerHTML = `<p class="empty-state">You haven’t bookmarked any tools yet.</p>`;
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  const totalPages = Math.ceil(bookmarks.length / toolsPerPage);
  const start = (currentPage - 1) * toolsPerPage;
  const toolsToShow = bookmarks.slice(start, start + toolsPerPage);

  toolsToShow.forEach(tool => {
    const categories = tool.Category
      ? tool.Category.split(",").map(cat => `<a href="#">${cat.trim()}</a>`).join("")
      : "";

    container.innerHTML += `
      <div class="tool-card">
        <div class="tool-header">
          <img src="${tool.LOGO}" alt="${tool.Name} logo" class="tool-logo">
          <span class="pricing-tag">${tool.Pricing}</span>
          <button class="bookmark-btn active" aria-label="Remove Bookmark" onclick="removeBookmark('${tool.Name}')">
            <i class="bi bi-bookmark-fill"></i>
          </button>
        </div>
        <h3 class="tool-name">${tool.Name}</h3>
        <p class="tool-desc">${tool.Description}</p>
        <div class="tool-meta">
          <div class="categories">
            ${categories}
          </div>
        </div>
        <a href="${tool.Link}" target="_blank" class="visit-btn">Visit</a>
      </div>`;
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// ---- Events ----
function removeBookmark(name) {
  const updated = getBookmarks().filter(tool => tool.Name !== name);
  saveBookmarks(updated);
  renderPage();
}

prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextBtn?.addEventListener("click", () => {
  const totalPages = Math.ceil(getBookmarks().length / toolsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

// Sync across tabs
window.addEventListener("storage", renderPage);

// ---- Init ----
document.addEventListener("DOMContentLoaded", renderPage);
