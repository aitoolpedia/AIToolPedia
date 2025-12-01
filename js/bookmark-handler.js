/* ============================================
   UNIVERSAL BOOKMARK HANDLER
   Works on index.html, explore.html, bookmarks.html
   Storage format stays identical to tools.json
   ============================================ */

// --- Get bookmarks ---
function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarkedTools")) || [];
}

// --- Save bookmarks ---
function saveBookmarks(bookmarks) {
  localStorage.setItem("bookmarkedTools", JSON.stringify(bookmarks));

  // Trigger sync across all open tabs/pages
  window.dispatchEvent(new Event("storage"));
}

// --- Toggle bookmark on/off ---
function toggleBookmark(toolObj) {
  let saved = getBookmarks();
  const exists = saved.some((t) => t.Name === toolObj.Name);

  if (exists) {
    saved = saved.filter((t) => t.Name !== toolObj.Name);
  } else {
    saved.push({
      Name: toolObj.Name,
      LOGO: toolObj.LOGO,
      Pricing: toolObj.Pricing,
      Description: toolObj.Description,
      Link: toolObj.Link,
      Category: toolObj.Category
    });
  }

  saveBookmarks(saved);
}

/* ============================================
   UPDATE BOOKMARK ICONS ON PAGE
   Called on: DOM load, bookmark change, page switch
   ============================================ */
function updateBookmarkIcons() {
  const saved = getBookmarks();

  document.querySelectorAll(".tool-card").forEach((card) => {
    const toolName = card.querySelector(".tool-name")?.textContent.trim();
    const icon = card.querySelector(".bookmark-btn i");

    if (!toolName || !icon) return;

    const isBookmarked = saved.some((t) => t.Name === toolName);

    icon.classList.toggle("bi-bookmark-fill", isBookmarked);
    icon.classList.toggle("bi-bookmark", !isBookmarked);
  });
}

/* ============================================
   GLOBAL EVENT LISTENERS
   ============================================ */

// When user clicks bookmark button
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".bookmark-btn");
  if (!btn) return;

  const card = btn.closest(".tool-card");
  if (!card) return;

  const tool = {
    Name: card.querySelector(".tool-name").textContent.trim(),
    LOGO: card.querySelector(".tool-logo").src,
    Pricing: card.querySelector(".pricing-tag").textContent.trim(),
    Description: card.querySelector(".tool-desc").textContent.trim(),
    Link: card.querySelector(".visit-btn").href,
    Category: [...card.querySelectorAll(".categories a")]
      .map((a) => a.textContent.trim())
      .join(",")
  };

  toggleBookmark(tool);
  updateBookmarkIcons();
});

// Sync across tabs/pages
window.addEventListener("storage", updateBookmarkIcons);

// Run once page loads
document.addEventListener("DOMContentLoaded", updateBookmarkIcons);
