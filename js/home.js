// Email Subscriber capture (using make.com)
// ConvertKit Email Capture - Final Version
document.getElementById("newsletter-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const message = document.getElementById("form-message");

  const payload = {
    api_key: "8149tPrr7Zd22v4sPP1DDQ",
    email: email
  };

  try {
    const response = await fetch("https://api.convertkit.com/v3/forms/8752043/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.subscription || data.subscriber) {
      message.textContent = "✅ Thanks! Confirm your email to receive the 500+ AI tools list.";
      message.style.color = "#00ff6a";
      e.target.reset();
    } else {
      console.log(data);
      message.textContent = "⚠️ Something went wrong. Please try again.";
      message.style.color = "#ff4444";
    }

  } catch (error) {
    console.error(error);
    message.textContent = "❌ Network error. Try again later.";
    message.style.color = "#ff4444";
  }
});

// Email Subscriber End 

// Fade / Slide Reveal Animation for featured section
const revealElements = document.querySelectorAll('.reveal');

function handleScrollReveal() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);
// Fade / Slide Reveal Animation End


// Trending Category
// ✅ Make trending category cards clickable
document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll(".trend-card");

  categoryCards.forEach(card => {

    card.addEventListener("click", () => {
      const selectedCategory = card.getAttribute("data-category");

      if (selectedCategory) {
        window.location.href = `explore.html?category=${encodeURIComponent(selectedCategory)}`;
      }
    });
  });
});

// Trending category