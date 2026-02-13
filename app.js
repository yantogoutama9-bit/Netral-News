const feeds = [
  { name: "Kompas", url: "https://rss.kompas.com/" },
  { name: "CNN Indonesia", url: "https://www.cnnindonesia.com/rss" },
  { name: "KBR", url: "https://kbr.id/rss" },
  { name: "BeritaBolaDunia", url: "https://beritabola-dunia.id/rss" }
];

const container = document.getElementById("news");

async function loadNews() {
  container.innerHTML = "<p>Loading...</p>";
  let allItems = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
      const data = await res.json();
      if (!data.items) continue;

      data.items.forEach(item => {
        item.source = feed.name;
        allItems.push(item);
      });
    } catch (e) {}
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  container.innerHTML = "";
  allItems.slice(0, 20).forEach(item => {
    const el = document.createElement("article");
    el.innerHTML = `
      <a href="${item.link}" target="_blank">${item.title}</a><br>
      <small>${item.source} • ${new Date(item.pubDate).toLocaleString("id-ID")}</small>
    `;
    container.appendChild(el);
  });
}

loadNews();
setInterval(loadNews, 1800000);
