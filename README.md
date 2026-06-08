# 💿 Virtual Record Collection

A static music dashboard for GitHub Pages. Browse your favorite albums with era filters, tag-based filtering, and clean record cards.

---

## What it does

| Feature | Detail |
|---|---|
| **Era filters** | Classic / Vintage / Modern card categories |
| **Tag filtering** | Filter albums by mood, genre, or playlist tags |
| **Clean dashboard** | Static UI powered by `index.html` |
| **GitHub Pages friendly** | Deploy the site directly from the repo |

---

## How to add records

Edit `data/records.json` and add album objects using this format:

```json
[
  {
    "title": "Kind Of Blue",
    "artist": "Miles Davis",
    "year": 1959,
    "url": "https://open.spotify.com/album/1weenld61qoidwYuZ1GESA",
    "tags": ["Main", "Moods"]
  }
]
```

- `title` — album name
- `artist` — recording artist / band
- `year` — release year
- `url` — link to the album page
- `tags` — list of genres, moods, playlists, or collection notes

## Run locally

Open `index.html` in your browser. No build step required.

## Deploy to GitHub Pages

1. Create a repository from this folder.
2. Go to **Settings → Pages**.
3. Set the source to **GitHub Actions** or **Deploy from main branch**.

The site will render the `index.html` dashboard and read albums from `data/records.json`.

---

## Notes

- The dashboard uses year ranges to categorize albums:
  - `Classic` — before 1980
  - `Vintage` — 1980–1999
  - `Modern` — 2000 and later
- Filter on a tag to narrow the collection by genres like `Jazz`, `Pop`, or `Christmas albums`.


  {
    "url": "",
    "tags": [""]
  }
