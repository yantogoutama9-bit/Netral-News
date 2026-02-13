const feeds = [
  { name: "Kompas", url: "https://rss.kompas.com/", type: "umum" },
  { name: "CNN Indonesia", url: "https://www.cnnindonesia.com/rss", type: "umum" },
  { name: "KBR", url: "https://kbr.id/rss", type: "umum" },
  { name: "Berita Bola Dunia", url: "https://beritabola-dunia.id/rss", type: "bola" }
];

const container = document.getElementById("news");
const refreshBtn = document.getElementById("refreshBtn");

async function loadNews() {
  container.innerHTML = "<p>Loading berita...</p>";
  let allItems = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`
      );
      const data = await res.json();
      if (!data.items) continue;

      data.items.forEach(item => {
        allItems.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: feed.name,
          type: feed.type
        });
      });
    } catch (e) {
      console.error("Gagal load:", feed.name);
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  container.innerHTML = "";
  allItems.slice(0, 25).forEach(item => {
    const article = document.createElement("article");
    const badge =
      item.type === "bola"
        ? `<span class="badge bola">⚽ Bola</span>`
        : `<span class="badge umum">📰 Umum</span>`;

    article.innerHTML = `
      ${badge}
      <a href="${item.link}" target="_blank">${item.title}</a><br>
      <small>${item.source} • ${new Date(item.pubDate).toLocaleString("id-ID")}</small>
    `;
    container.appendChild(article);
  });
}

refreshBtn.addEventListener("click", loadNews);

// auto load
loadNews();

// auto refresh tiap 30 menit
setInterval(loadNews, 1800000);
