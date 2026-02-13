if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

const newsContainer = document.getElementById("news");

// RSS sources
const feeds = [
  {
    source: "Kompas",
    url: "https://rss.kompas.com/news"
  },
  {
    source: "CNN Indonesia",
    url: "https://www.cnnindonesia.com/rss"
  },
  {
    source: "KBR",
    url: "https://kbr.id/rss"
  }
];

// RSS proxy (public, read-only)
const PROXY = "https://api.allorigins.win/raw?url=";

async function loadRSS() {
  newsContainer.innerHTML = "Memuat berita terbaru...";

  let articles = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(PROXY + encodeURIComponent(feed.url));
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const items = xml.querySelectorAll("item");

      items.forEach(item => {
        articles.push({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          desc: item.querySelector("description")?.textContent || "",
          date: new Date(item.querySelector("pubDate")?.textContent || Date.now()),
          source: feed.source
        });
      });

    } catch (err) {
      console.error("RSS error:", feed.source, err);
    }
  }

  // sort terbaru
  articles.sort((a, b) => b.date - a.date);

  renderNews(articles.slice(0, 30));
}

function renderNews(data) {
  newsContainer.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "article";

    div.innerHTML = `
      <a href="${item.link}" target="_blank" rel="noopener">
        <h3>${item.title}</h3>
        <small>${item.source} | ${item.date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</small>
        <p>${stripHTML(item.desc).slice(0, 120)}...</p>
      </a>
    `;

    newsContainer.appendChild(div);
  });
}

// helper
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// initial load
loadRSS();

// auto refresh tiap 15 menit
setInterval(loadRSS, 15 * 60 * 1000);
