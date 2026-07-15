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

## Deploy to GitHub Pages

The repo deploys to GitHub Pages automatically via
[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml):
every push to `main` publishes the repository root as-is (no build step).

One-time setup, if the first workflow run doesn't enable it automatically:
in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**.

The site is served at
`https://<username>.github.io/Darkness-Descending-/`. All asset paths in
the app are relative, so it works from that subpath without changes.

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
.github/workflows/
  deploy-pages.yml    GitHub Pages deploy workflow
src/
  main.js             App entry + character-creation UI
  style.css           Dark-fantasy theme
  data/
    classes.js        Class definitions and stats
    professions.js    Profession definitions and materials
```
