# MokaTroy TFT Overlay

A lightweight Windows companion that stays above the game and shows MokaTroy TFT compositions. It never reads game memory, captures the screen, or automates gameplay.

## First version

- Always-on-top, frameless overlay window
- Toggle shortcut: `Ctrl + Shift + Space`
- Search and switch among the comps hosted on MokaTroy TFT
- Core units, traits, items, and play guide in Arabic
- Uses the published site's JSON data, so the app does not duplicate comp content

## Run locally

```bash
cd overlay
npm install
npm start
```

For the best experience, run Teamfight Tactics in borderless/windowed mode.

## Build a Windows installer

```bash
npm run package:win
```

The installer will be created in `overlay/dist/`.