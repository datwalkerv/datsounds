# datsounds Public API

> Instructions for AI agents and developers. This file is everything you need to use the API.
> Base URL: `https://datsounds.vercel.app`
> Docs URL: `https://datsounds.vercel.app/api.md`

The API lets you search tracks and sound effects (SFX), list popular and latest tracks, get a track's stems (full mix, bass, drums, instruments, melody) and download MP3.

- **API key required.** Send it on every `/api/v1/*` request in the `x-api-key` header. Ask the datsounds owner for a key; never put it in public code or URLs.
- `download` links (`/api/download`) do not need the key, so you can hand them to a browser or `<audio>` tag.
- Every endpoint is `GET` and returns JSON, except `/api/download`, which returns an MP3.
- CORS is open (`Access-Control-Allow-Origin: *`), so browsers can call it directly.
- Responses are cached for 5 minutes (`s-maxage=300`). The same query within that window returns the same data.

---

## Authentication

```
x-api-key: <your key>
```

Missing or wrong key → `401 { "error": "Missing or invalid API key. Send it in the x-api-key header." }`.
Agents: read the key from an environment variable (e.g. `DATSOUNDS_API_KEY`) instead of hard-coding it.

## Quick start

```bash
KEY="$DATSOUNDS_API_KEY"

# 1. Search
curl -H "x-api-key: $KEY" "https://datsounds.vercel.app/api/v1/tracks?q=lofi"

# 1b. Search sound effects
curl -H "x-api-key: $KEY" "https://datsounds.vercel.app/api/v1/sfx?q=impact"

# 2. Get every stem of one result (use its kosmosId)
curl -H "x-api-key: $KEY" "https://datsounds.vercel.app/api/v1/tracks/<kosmosId>"

# 3. Download an MP3 (use a `download` URL from step 1 or 2 as-is)
curl -L -o track.mp3 "<download URL>"
```

---

## Endpoints

### 1. List and search tracks

`GET /api/v1/tracks`

| Param  | Type    | Default | Allowed | Meaning |
|--------|---------|---------|---------|---------|
| `q`    | string  | `""`    | 0–100 chars | Search text: genre, mood, instrument, title, artist ("lofi", "epic trailer", "sad piano"). Empty means no filter. |
| `sort` | string  | `relevance` if `q` is set, else `popular` | `popular`, `latest`, `relevance` | `popular`: trending now. `latest`: newest additions first. `relevance`: best match for `q`. |
| `page` | integer | `1`     | 1–100   | Page number. 60 tracks per page. |

`sort` and `q` combine freely: `?q=trap&sort=latest` gives the newest trap tracks.

**Response**

```json
{
  "page": 1,
  "totalPages": 9,
  "totalHits": 500,
  "sort": "relevance",
  "q": "lofi",
  "count": 60,
  "tracks": [ /* PublicTrack, see below */ ]
}
```

| Field        | Meaning |
|--------------|---------|
| `page`       | The page you asked for. |
| `totalPages` | Pages the upstream reports. Treat it as a ceiling; see Pagination. |
| `totalHits`  | Total matching tracks (upstream caps this, e.g. 500 or 10000). |
| `sort`, `q`  | The values actually used, after defaults. |
| `count`      | Tracks on this page (usually 60; fewer on the last page). |
| `tracks`     | Tracks in ranked order. List items have **no `stems`**; use endpoint 3 for those. |

### 2. Search sound effects

`GET /api/v1/sfx`

Same params, limits, response and errors as endpoint 1, but searches only sound effects (whooshes, impacts, risers, ambiences, foley…).

| Param  | Default | Notes |
|--------|---------|-------|
| `q`    | `""`    | What the sound is: "impact", "whoosh", "camera shutter", "crowd cheer", "rain". |
| `sort` | `relevance` if `q` is set, else `latest` | Same values as endpoint 1. Use `relevance` (default) for the best matches. `latest` with `q` is a loose match and can return unrelated new sounds. |
| `page` | `1`     | 1–100, 60 per page. |

```bash
curl -H "x-api-key: $KEY" "https://datsounds.vercel.app/api/v1/sfx?q=impact"          # most relevant impacts
curl -H "x-api-key: $KEY" "https://datsounds.vercel.app/api/v1/sfx"                   # newest SFX in the library
```

The response has the same shape as endpoint 1 (the list key is still `tracks`). SFX items are `PublicTrack`s with:
- `isSfx: true`, `bpm: 0`, `artists: []`, `moods: []`
- `genres` = the SFX category, e.g. `["Impact"]`
- `title` = comma-separated descriptors, e.g. `"Fight, Impact, Hit, Boomy, Crisp"`
- only a `full` stem. Use the list's `download` directly; endpoint 3 also works with an SFX `kosmosId`.

### 3. Get one track with all stems

`GET /api/v1/tracks/{kosmosId}`

`kosmosId` is the UUID from a list result, e.g. `584229b9-cb0c-4379-98dd-6e37ce719052`. Allowed characters: letters, digits, `-`, `_` (max 64).

Returns a single `PublicTrack` **with** a `stems` object:

```json
{
  "id": 284473,
  "kosmosId": "584229b9-cb0c-4379-98dd-6e37ce719052",
  "title": "Funk on the One",
  "artists": ["Jobii", "Loyae"],
  "bpm": 105,
  "durationSec": 153,
  "energy": "medium",
  "genres": ["Funk"],
  "moods": ["Happy", "Smooth"],
  "hasVocals": false,
  "isSfx": false,
  "added": "2026-04-22T15:26:20",
  "cover": "https://cdn.epidemicsound.com/curation-assets/commercial-release-cover-images/15865/3000x3000.jpg?height=600&width=600",
  "preview": "https://audiocdn.epidemicsound.com/lqmp3/01KQCC1MXM44X92CCVNTPSQJFC.mp3",
  "download": "https://datsounds.vercel.app/api/download?url=https%3A%2F%2Faudiocdn.epidemicsound.com%2Flqmp3%2F01KQCC1MXM44X92CCVNTPSQJFC.mp3&filename=Funk%20on%20the%20One%20-%20Full%20Track%20%5Bdatsounds%5D.mp3",
  "stems": {
    "full":        { "preview": "https://audiocdn.epidemicsound.com/lqmp3/….mp3", "download": "https://datsounds.vercel.app/api/download?url=…&filename=Funk%20on%20the%20One%20-%20Full%20Track%20%5Bdatsounds%5D.mp3" },
    "bass":        { "preview": "…", "download": "…" },
    "drums":       { "preview": "…", "download": "…" },
    "instruments": { "preview": "…", "download": "…" },
    "melody":      { "preview": "…", "download": "…" }
  }
}
```

Not every track has every stem. Only the stems that exist are present; `full` is almost always there. Sound effects (`isSfx: true`) usually have only `full`.

### 4. Download an MP3

`GET /api/download?url={audio URL}&filename={name.mp3}`

You normally never build this yourself: every `download` field is a ready-to-use link. It returns the MP3 as an attachment (`Content-Type: audio/mpeg`).

| Param      | Required | Meaning |
|------------|----------|---------|
| `url`      | yes | A `preview` URL. Must start with `https://audiocdn.epidemicsound.com/`, otherwise 403. |
| `filename` | no  | Saved file name. Default `track.mp3`. |

---

## PublicTrack fields

| Field         | Type             | Meaning |
|---------------|------------------|---------|
| `id`          | number           | Numeric Epidemic Sound track id. |
| `kosmosId`    | string \| null   | UUID. Use it for endpoint 3. |
| `title`       | string           | Track title. |
| `artists`     | string[]         | Main and featured artist names. |
| `bpm`         | number           | Tempo in beats per minute (0 if unknown). |
| `durationSec` | number           | Length in seconds. |
| `energy`      | string           | `low`, `medium`, `high` or `variable`. |
| `genres`      | string[]         | Genre names, e.g. `["Hip Hop", "Trap"]`. |
| `moods`       | string[]         | Mood names, e.g. `["Dark", "Epic"]`. |
| `hasVocals`   | boolean          | true if the track has vocals. |
| `isSfx`       | boolean          | true for sound effects, false for music. |
| `added`       | string           | ISO 8601 date the track was added to the library. |
| `cover`       | string \| null   | 600×600 cover image URL. |
| `preview`     | string \| null   | Direct MP3 URL of the full mix, for streaming or an `<audio>` tag. |
| `download`    | string \| null   | datsounds link that downloads the full mix with a clean file name. |
| `stems`       | object           | **Only on endpoint 3.** Keys: `full`, `bass`, `drums`, `instruments`, `melody`; each `{ preview, download }`. |

---

## Pagination

- 60 tracks per page. Stop when `count` is 0 or `page` reaches `totalPages`.
- The upstream library caps deep paging, sometimes below `totalPages`. Pages past its limit return **502**. Treat a 502 on page > 1 as "no more results".

## Filtering that the API does not do

There are no `bpm`, `energy`, `genre`, `mood` or `vocals` query params. To filter:

1. Put descriptive words in `q` ("dark trap", "happy acoustic"). Negations like "no vocals" do not work; filter `hasVocals` yourself.
2. Fetch one or more pages and filter the `tracks` array on the client by `bpm`, `durationSec`, `energy`, `genres`, `moods`, `hasVocals`, `isSfx`.

## Errors

Errors are JSON: `{ "error": "message" }`.

| Status | When |
|--------|------|
| 400 | Bad `sort`, `page` out of 1–100, `q` over 100 chars, or malformed `kosmosId`. |
| 401 | Missing or wrong `x-api-key` on an `/api/v1/*` request. |
| 403 | `/api/download` with a URL not on `audiocdn.epidemicsound.com`. |
| 404 | `kosmosId` not found. |
| 503 | The server has no API key configured (owner's setup issue). |
| 502 | Upstream failed or the page is past the upstream limit. Retry once after a few seconds; on page > 1 treat it as end of results. |

## Recipes for agents

**Find a track for a video and download it**
1. `GET /api/v1/tracks?q=<mood + genre words>`
2. Pick by `durationSec` (≥ video length), `bpm`, `energy`, `hasVocals`.
3. Download its `download` URL.

**Get a drumless or instrumental version**
1. Get the track's `kosmosId` from a list.
2. `GET /api/v1/tracks/{kosmosId}`.
3. Download `stems.instruments` / `stems.melody` / `stems.bass` as needed.

**Find a sound effect for a cut**
1. `GET /api/v1/sfx?q=<what it sounds like>` ("whoosh", "bass drop impact", "glitch").
2. Pick by `title` descriptors and `durationSec` (short = punchier).
3. Download its `download` URL.

**What is trending / new**
- `GET /api/v1/tracks?sort=popular` or `GET /api/v1/tracks?sort=latest`
- Narrow with `q`: `?sort=latest&q=lofi`.

**JavaScript**
```js
const BASE = "https://datsounds.vercel.app";
const headers = { "x-api-key": process.env.DATSOUNDS_API_KEY };
const { tracks } = await fetch(`${BASE}/api/v1/tracks?q=${encodeURIComponent("chill lofi")}`, { headers }).then(r => r.json());
const pick = tracks.find(t => !t.hasVocals && t.durationSec >= 60);
const full = await fetch(`${BASE}/api/v1/tracks/${pick.kosmosId}`, { headers }).then(r => r.json());
console.log(full.stems.drums?.download);
```

**Python**
```python
import os, requests
BASE = "https://datsounds.vercel.app"
H = {"x-api-key": os.environ["DATSOUNDS_API_KEY"]}
tracks = requests.get(f"{BASE}/api/v1/tracks", params={"q": "epic trailer"}, headers=H).json()["tracks"]
t = max(tracks, key=lambda t: t["bpm"])
open(f"{t['title']}.mp3", "wb").write(requests.get(t["download"]).content)
```

## Be a good client

- Keep it to a few requests per second. No bulk mirroring.
- Reuse results: identical queries are cached for 5 minutes anyway.