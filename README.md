# Letting Go with Love — App

A gentle, interactive companion to the *Letting Go with Love* workbook by Nichole Gehman & Kate Fish, LMFT.

## What this is

A free, no-login web app that turns the workbook into something you can actually *use*. Seven journeys of reading. An interactive **Exposure Ladder** for releasing emotionally sticky items one step at a time. A **15-minute reset timer** with streak tracking. All notes save locally to your device — no accounts, no backend, no friction.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router
- LocalStorage for persistence
- Cloudflare Pages for hosting

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Cloudflare Pages

```bash
npm run deploy
```

(requires `wrangler login` first)

Or connect this GitHub repo to Cloudflare Pages — build command `npm run build`, output directory `dist`.
