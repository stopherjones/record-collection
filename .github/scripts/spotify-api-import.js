import fs from "fs";
import fetch from "node-fetch";

async function getToken(clientId, clientSecret) {
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const j = await resp.json();
  return j.access_token;
}

function extractSpotifyId(url) {
  const m = url.match(/spotify\.com\/(album|playlist)\/([A-Za-z0-9]+)/);
  return m ? { type: m[1], id: m[2] } : null;
}

async function fetchAlbum(token, id) {
  const r = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.json();
}

async function fetchPlaylist(token, id) {
  const r = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.json();
}

async function run() {
  const pending = JSON.parse(fs.readFileSync("pending.json","utf8"));
  const records = JSON.parse(fs.readFileSync("records.json","utf8"));
  const token = await getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

  for (const p of pending) {
    const info = extractSpotifyId(p.url);
    if (!info) continue;
    if (info.type === "album") {
      const album = await fetchAlbum(token, info.id);
      records.push({
        title: album.name,
        artist: album.artists?.map(a=>a.name).join(", "),
        year: album.release_date?.slice(0,4) || null,
        url: p.url,
        tags: p.tags || []
      });
    } else {
      const pl = await fetchPlaylist(token, info.id);
      records.push({
        title: pl.name,
        artist: pl.owner?.display_name || pl.owner?.id || "",
        year: null,
        url: p.url,
        tags: p.tags || []
      });
    }
  }

  fs.writeFileSync("records.json", JSON.stringify(records, null, 2));
  fs.writeFileSync("pending.json", "[]");
}

run().catch(e=>{ console.error(e); process.exit(1); });
