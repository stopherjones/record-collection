// .github/scripts/spotify-api-import.js
import fs from "fs";
import fetch from "node-fetch";

// ---------- Helpers ----------
function extractSpotify(url) {
  // Handles album / playlist / track URLs with or without query params
  const m = url.match(/open\.spotify\.com\/(album|playlist|track)\/([A-Za-z0-9]+)/);
  if (m) return { type: m[1], id: m[2] };
  return null;
}

async function getToken(clientId, clientSecret) {
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("Token request failed: " + resp.status + " " + txt);
  }

  const j = await resp.json();
  return j.access_token;
}

async function fetchJSON(url, token) {
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Fetch failed ${resp.status}: ${txt}`);
  }

  return resp.json();
}

// ---------- Album + Playlist Fetchers ----------
async function fetchAlbum(id, token) {
  return fetchJSON(`https://api.spotify.com/v1/albums/${id}`, token);
}

async function fetchPlaylist(id, token) {
  return fetchJSON(`https://api.spotify.com/v1/playlists/${id}`, token);
}
// ---------- Main ----------
async function run() {
  const pending = JSON.parse(fs.readFileSync("pending.json", "utf8"));
  const records = JSON.parse(fs.readFileSync("records.json", "utf8"));

  if (!pending.length) {
    console.log("No pending items.");
    return;
  }

  const token = await getToken(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET
  );

  const newRecords = [];
  const remaining = [];

  for (const item of pending) {
    try {
      const info = extractSpotify(item.url);
      if (!info) throw new Error("Could not extract Spotify ID from URL");

      if (info.type === "album") {
        const album = await fetchAlbum(info.id, token);

        newRecords.push({
          title: album.name,
          artist: album.artists.map(a => a.name).join(", "),
          year: album.release_date?.slice(0, 4) || null,
          url: item.url,
          thumbnail: album.images?.[0]?.url || null,
          tags: item.tags || []
        });
      }

      else if (info.type === "playlist") {
        const pl = await fetchPlaylist(info.id, token);
        const playlistArtist = (pl.name || "").match(/^This is\s+(.+)$/i)?.[1]?.trim() || "Various Artists";

        newRecords.push({
          title: pl.name,
          artist: playlistArtist,
          year: null,
          url: item.url,
          thumbnail: pl.images?.[0]?.url || null,
          tags: item.tags || []
        });
      }

      else {
        console.warn("Unsupported type:", info.type);
        remaining.push(item);
      }

    } catch (err) {
      console.error("Failed to process", item.url, err.message);
      remaining.push(item);
    }
  }

  fs.writeFileSync("records.json", JSON.stringify([...records, ...newRecords], null, 2));
  fs.writeFileSync("pending.json", JSON.stringify(remaining, null, 2));

  console.log("Imported:", newRecords.length, "Remaining:", remaining.length);
}

run().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
