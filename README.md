# Tran Viet Gia Huy Portfolio

Personal portfolio for Tran Viet Gia Huy, built with React and styled as a dark/light data portfolio inspired by modern analytics case-study layouts.

## Features

- Responsive homepage with hero, profile photo, animated role text, theme toggle, and contact links.
- Featured work filtering by Business Data Analyst, Data Engineering, and Scientific Research.
- Vaibhav-style case study pages for analytics, data engineering, SaaS, computer vision, and NLP projects.
- Resume preview/download route.
- GitHub Pages SPA fallback support.

## Local Development

```powershell
npm.cmd install
npm.cmd start
```

## Production Build

```powershell
npm.cmd run build
node scripts\serve-build.js
```

Then open `http://localhost:3000`.

## Deploy

```powershell
npm.cmd run deploy
```

The deploy script publishes the `build` folder to the `gh-pages` branch.
