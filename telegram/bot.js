import fetch from "node-fetch";
import fs from "fs";
import { parseStringPromise } from "xml2js";

const BOT_TOKEN = "ISI_DENGAN_TOKEN_LO";
const CHANNEL = "@netralnews";

const feeds = [
  { source: "Kompas", url: "https://rss.kompas.com/news" },
  { source: "CNN Indonesia", url: "https://www.cnnindonesia.com/rss" },
  { source: "KBR", url: "https://kbr.id/rss" }
];

const sentFile = "./sent.json";
let sent = JSON.parse(fs.readFileSync(sentFile));

async function sendMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHANNEL,
      text,
      disable_web_page_preview: false
    })
  });
}

async function fetchRSS() {
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url);
      const xml = await res.text();
      const data = await parseStringPromise(xml);
      const items = data.rss.channel[0].item.slice(0, 5);

      for (const item of items) {
        const title = item.title[0];
        const link = item.link[0];

        if (sent.includes(link)) continue;

        const desc = item.description
          ? item.description[0].replace(/<[^>]*>/g, "").slice(0, 160)
          : "";

        const message = `📰 *${title}*
${feed.source}

${desc}
🔗 ${link}`;

        await sendMessage(message);
        sent.push(link);
      }

    } catch (err) {
      console.error("Error:", feed.source, err);
    }
  }

  fs.writeFileSync(sentFile, JSON.stringify(sent, null, 2));
}

fetchRSS();
