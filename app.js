const feeds = [
  { name: "Kompas", url: "https://rss.kompas.com/" },
  { name: "CNN Indonesia", url: "https://www.cnnindonesia.com/rss" },
  { name: "KBR", url: "https://kbr.id/rss" }
];

const container = document.getElementById("news");

function loadNews() {
  container.innerHTML = "";
  feeds.forEach(feed => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
      .then(res => res.json())
      .then(data => {
        data.items.slice(0,5).forEach(item => {
          const el = document.createElement("article");
          el.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a><br><small>${feed.name}</small>`;
          container.appendChild(el);
        });
      });
  });
}

loadNews();
setInterval(loadNews, 1800000); // 30 menit
