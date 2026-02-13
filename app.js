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

async function loadRSS() {
  newsContainer.innerHTML = "Memuat berita terbaru...";

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

    } catch (e) {
      console.error("RSS error:", feed.source, e);
    }
  }

  articles.sort((a, b) => b.date - a.date);
  renderNews(articles.slice(0, 30));
}
