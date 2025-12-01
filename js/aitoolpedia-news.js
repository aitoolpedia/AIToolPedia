let newsData = [];
let currentSlide = 0;

// Load JSON for ai-news.html
fetch("/data/news.json")
  .then(res => res.json())
  .then(data => {
    newsData = data;
    renderSlider();
    renderGrid();
    startAutoSlide();
  });

// -------- Slider --------
function renderSlider() {
  const slider = document.getElementById("sliderContainer");
  slider.innerHTML = newsData.slice(0, 10).map(n => `
    <div class="slide" data-id="${n.id}">
      <img src="${n.image}" alt="${n.title}">
      <div class="slide-text">
        <h2>${n.title}</h2>
        <p>${n.summary}</p>
      </div>
    </div>
  `).join("");

  slider.querySelectorAll(".slide").forEach(slide => {
    slide.addEventListener("click", () => {
      window.location.href = `aibizmind-news/news.html?id=${slide.dataset.id}`;
    });
  });
}

// Navigation
document.getElementById("nextNews").addEventListener("click", () => changeSlide(1));
document.getElementById("prevNews").addEventListener("click", () => changeSlide(-1));

function changeSlide(dir) {
  currentSlide = (currentSlide + dir + 10) % 10;
  document.querySelector(".slider-container").style.transform =
    `translateX(-${currentSlide * 100}%)`;
}

// Autoplay
let autoPlay = setInterval(() => changeSlide(1), 4000);

document.querySelector(".news-slider").addEventListener("mouseenter", () => clearInterval(autoPlay));
document.querySelector(".news-slider").addEventListener("mouseleave", () => {
  autoPlay = setInterval(() => changeSlide(1), 4000);
});

// -------- News Grid --------
// Pagination
// -------- Pagination Config --------
let currentPage = 1;
const itemsPerPage = 12;

function renderGrid() {
  const grid = document.getElementById("newsGrid");
  const pagination = document.getElementById("pagination");

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = newsData.slice(start, start + itemsPerPage);

  // Render news cards
  grid.innerHTML = paginatedData.map(n => `
      <div class="news-card" data-id="${n.id}">
        <img src="${n.image}">
        <h3>${n.title}</h3>
        <p>${n.summary}</p>
      </div>
  `).join("");

  // Add click event
  grid.querySelectorAll(".news-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = `aibizmind-news/news.html?id=${card.dataset.id}`;
    });
  });

  renderPagination();
}
// Pagination
function renderPagination() {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  let html = "";

  // Prev button
  if (currentPage > 1) {
    html += `<button class="page-btn prev" data-page="${currentPage - 1}">Prev</button>`;
  }

  // Page buttons (smart logic)
  const visiblePages = 5;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (startPage > 1) html += `<button class="page-btn" data-page="1">1</button>`;
  if (startPage > 2) html += `<span class="dots">...</span>`;

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i == currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages - 1) html += `<span class="dots">...</span>`;
  if (endPage < totalPages) html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;

  // Next button
  if (currentPage < totalPages) {
    html += `<button class="page-btn next" data-page="${currentPage + 1}">Next</button>`;
  }

  pagination.innerHTML = html;

  document.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      renderGrid();
    });
  });
}

