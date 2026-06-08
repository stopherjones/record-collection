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

When you commit to Github the spotify-import.yml action will then pull the remaining details - artist, title, year and thumbnail - update `records.json` and clean `pending.json`

Alternatively, record the details manually in `records.json`:

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


To get the thumbnail url: 

Copy the Spotify link for your album or playlist (Share > Copy link)

Open a new tab in your browser and paste this prefix into the address bar:
https://open.spotify.com/oembed?url=

Paste your Spotify link directly after the equal sign so it looks like this:
https://open.spotify.com/oembed?url=https://open.spotify.com/album/4aawyAB9vmqN3uCO70I6Ft

Press Enter. You’ll see a line of text on your screen. Look for the "thumbnail_url" key.

Copy the image link right next to it (it will start with https://i.scdn.co/image/...) and paste it in the json schema above.


## Deploy to GitHub Pages

1. Create a repository from this folder.
2. Go to **Settings → Pages**.
3. Set the source to **GitHub Actions** or **Deploy from main branch**.

The site will render the `index.html` dashboard and read albums from `records.json`.