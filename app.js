if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

const news = document.getElementById("news");

// dummy data (nanti diganti RSS)
const sample = [
  {
    title: "Contoh Judul Berita",
    source: "Kompas",
    time: "14:30",
    link: "https://www.kompas.com"
  }
];

sample.forEach(item => {
  const div = document.createElement("div");
  div.className = "article";
  div.innerHTML = `
    <a href="${item.link}" target="_blank">
      <h3>${item.title}</h3>
      <small>${item.source} | ${item.time}</small>
    </a>
  `;
  news.appendChild(div);
});
