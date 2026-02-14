// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// AMBIL CONTAINER
const newsContainer = document.getElementById("news");

// RSS FEEDS (Nasional + Sepak Bola)
const feeds = [
  { source: "Kompas", url: "https://rss.kompas.com/news" },
  { source: "CNN Indonesia", url: "https://www.cnnindonesia.com/rss" },
  { source: "KBR", url: "https://kbr.id/rss" },

  // Sepak Bola Internasional
  { source: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { source: "ESPN Soccer", url: "https://www.espn.com/espn/rss/soccer/news" },
  { source: "Sky Sports", url: "https://www.skysports.com/rss/12040" }
];

async function loadRSS() {
  newsContainer.innerHTML = "<p>Memuat berita terbaru...</p>";
  let articles = [];

  for (const feed of feeds) {
    try {
      const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(api);
      const data = await res.json();

      if (!data.items) continue;

      data.items.forEach(item => {
        articles.push({
          title: item.title,
          link: item.link,
          desc: item.description || "",
          date: new Date(item.pubDate),
          source: feed.source
        });
      });

    } catch (err) {
      console.error("RSS error:", feed.source, err);
    }
  }

  // Urutkan berdasarkan tanggal terbaru
  articles.sort((a, b) => b.date - a.date);

  // Ambil 30 berita terbaru
  renderNews(articles.slice(0, 30));
}

function renderNews(items) {
  newsContainer.innerHTML = "";

  if (items.length === 0) {
    newsContainer.innerHTML = "<p>Tidak ada berita.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "article";

    div.innerHTML = `
      <a href="${item.link}" target="_blank" rel="noopener">
        <h3>${item.title}</h3>
        <small>${item.source} | ${item.date.toLocaleString("id-ID")}</small>
        <p>${stripHTML(item.desc).slice(0, 120)}...</p>
      </a>
    `;

    newsContainer.appendChild(div);
  });
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

// LOAD AWAL
loadRSS();

// AUTO REFRESH 15 MENIT
setInterval(loadRSS, 15 * 60 * 1000);
