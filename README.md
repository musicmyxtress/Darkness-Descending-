# Darkness-Descending-

A very randomized, replayable web roguelike.

## Play locally

This is a zero-build static site — no dependencies, no bundler. Serve the
folder with any static file server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(A plain static server is needed rather than opening `index.html` directly,
because the game loads ES modules.)

## Deploy to Netlify

The repo is Netlify-ready via [`netlify.toml`](./netlify.toml):

- **Build command:** none
- **Publish directory:** `.` (the repository root)

Connect the repository in Netlify (or drag-and-drop the folder), and it
deploys as-is.

## Current features

- **Character creation screen**
  - Type a hero name.
  - Choose a **class**: Mage, Cleric, Thief, or Warrior — each with its own
    stats and flavor.
  - Choose a **profession**: Smith (works metal and leather) or Tailor
    (works cloth and jewels).

## Project structure

```
index.html            App shell
netlify.toml          Netlify (static) deploy config
src/
  main.js             App entry + character-creation UI
  style.css           Dark-fantasy theme
  data/
    classes.js        Class definitions and stats
    professions.js    Profession definitions and materials
```
