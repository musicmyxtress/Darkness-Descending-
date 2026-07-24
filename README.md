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
  - Choose a **class**: Mage, Cleric, Thief, or Warrior.
  - Choose a **profession**: Smith (works metal and leather) or Tailor
    (works cloth and jewels).
- **Stats** — every hero starts with 5 in each stat, +2 to their class stat:
  - **Strength** (Warrior): how hard you hit with a weapon.
  - **Dexterity** (Thief): carry capacity (half your Dexterity in items) and
    a chance to double-attack with a weapon.
  - **Intelligence** (Mage): how hard your damage and damage-over-time
    spells hit.
  - **Wisdom** (Cleric): health and mana regeneration outside of combat.
- **Stat allocation screen** — after creation, spend 4 free stat points
  however you like before the descent begins.

## Project structure

```
index.html            App shell
.github/workflows/
  deploy-pages.yml    GitHub Pages deploy workflow
src/
  main.js             App entry + creation/allocation UI
  style.css           Dark-fantasy theme
  data/
    stats.js          Stat definitions, baselines, derived rules
    classes.js        Class definitions and bonus stats
    professions.js    Profession definitions and materials
```
