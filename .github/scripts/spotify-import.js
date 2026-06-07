const fs = require("fs");

async function fetchJSON(url) {
  return fetch(url).then(r => r.json());
}

async function fetchText(url) {
  return fetch(url).then(r => r.text());
}

async function getSpotifyMetadata(url) {
  const oembedUrl =
    "https://open.spotify.com/oembed?url=" + encodeURIComponent(url);

  const oembed = await fetchJSON(oembedUrl);

  const html = await fetchText(url);
  const yearMatch = html.match(/"release_date":"(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;

  return {
    title: oembed.title,
    artist: oembed.author_name,
    year,
    url,
    tags: []
  };
}

async function run() {
  const pending = JSON.parse(fs.readFileSync("pending.json", "utf8"));
  const records = JSON.parse(fs.readFileSync("records.json", "utf8"));

  const newRecords = [];

  for (const entry of pending) {
    const meta = await getSpotifyMetadata(entry.url);
    meta.tags = entry.tags;
    newRecords.push(meta);
  }

  const updated = [...records, ...newRecords];

  fs.writeFileSync("records.json", JSON.stringify(updated, null, 2));
  fs.writeFileSync("pending.json", "[]");
}

run();
