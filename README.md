# 💿 Virtual Record Collection

A simple 'virtual record collection' intended to make it easier to see what albums and playlists you've saved on Spotify.

Features include 

- sort by Artist, Title and Year 
- filter by user-generated tags, such as Film scores, Christmas albums, Main collection
- random entry picker, including within filtered results
- search

## How to add records

The simplest way is to add the Spotify url and any tags to `pending.json`:

  {
    "url": "",
    "tags": ["", ""]
  }

When you commit to Github the spotify-import.yml action will then pull the remaining details - artist, title, year and thumbnail - update `data/records.json` and clean `pending.json`

Alternatively, record the details manually in `data/records.json`:

  {
    "title": "",
    "artist": "",
    "year": "",
    "url": "",
    "thumbnail": "",
    "tags": [
      "", ""
    ]
  }


## Deploy to GitHub Pages

1. Create a repository from this folder.
2. Go to **Settings → Pages**.
3. Set the source to **GitHub Actions** or **Deploy from main branch**.

The site will render the `index.html` dashboard and read albums from `data/records.json`.

