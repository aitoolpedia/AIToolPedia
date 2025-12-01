const id = new URLSearchParams(window.location.search).get("id");

fetch("/data/news.json")
  .then(res => res.json())
  .then(data => {
    const article = data.find(n => n.id == id);

    if (!article) return;

    document.getElementById("newsBanner").src = article.image;
    document.getElementById("newsTitle").textContent = article.title;
    document.getElementById("newsDate").textContent = article.date;
    document.getElementById("newsContent").innerHTML = article.content;
  });


// Existing code loads article...

// Load "More News" list
fetch("/data/news.json")
  .then(res => res.json())
  .then(data => {
    const latestList = document.getElementById("latestNewsList");

    data.slice(0, 5).forEach(n => {
      const li = document.createElement("li");
      li.textContent = n.title;
      li.onclick = () => window.location.href = `/aibizmind-news/news.html?id=${n.id}`;
      latestList.appendChild(li);
    });
  });
