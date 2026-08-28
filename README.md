# Magical Wands — Static Build

A pure HTML/CSS/JS version of the original Next.js "Magical Wands" project
(hand-gesture spellcasting with MediaPipe). No build step, no npm install —
just open it in a local server.

## Run it locally

You can't just double-click `index.html` (browsers block webcam access and
ES module imports on the `file://` protocol) — you need a local server:

**Option A — Python (already on most machines)**
```
cd magical-wands
python3 -m http.server 8080
```
Then open http://localhost:8080

**Option B — Node**
```
cd magical-wands
npx serve .
```
(follow the URL it prints, usually http://localhost:3000)

**Option C — VS Code**
Install the "Live Server" extension, right-click `index.html` →
"Open with Live Server".

## How it works

- `index.html` — the page markup (landing screen + camera HUD)
- `css/style.css` — all styling, plus added mobile/tablet responsive rules
- `js/main.js` — boots the app once the page loads
- `js/lib/` — the original game logic (hand tracking, wand effects, canvas
  rendering) — unchanged from the source, just no longer wrapped in React
- `assets/` — icons

MediaPipe's hand-tracking library loads from a CDN, so you'll need an
internet connection even though the site itself runs locally. Grant camera
permission when prompted; if you decline or have no webcam, it automatically
falls back to mouse/touch control.

## Notes on this conversion

The original repo was a Next.js app — that's why it had no `index.html`
(Next.js generates pages internally and needs `npm run dev` to serve them).
Since almost all the actual logic lived in plain JS modules (`src/lib/`),
this build strips out React/Next entirely and loads those same modules
directly as native ES modules in the browser — same behavior, zero build
tooling required.

Created by Rupam Kayal — https://github.com/Ritesh1840
