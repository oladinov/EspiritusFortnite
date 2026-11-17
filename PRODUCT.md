# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Public Spanish-speaking Fortnite squads (friends playing together in a lobby or room) using both mobile phones (often between matches) and desktop browsers.

## Product Purpose

Help Fortnite squads compare their Sprite ("espíritus") collections and organize the optimal gifting/trading sequence across the whole group so everyone completes their collection with minimal dust ("polvo") cost and no manual guesswork. Success means a squad can join a shared room, immediately see who gives what to whom (including return trades and missing sprites), and copy the plan straight into Discord or WhatsApp between matches.

## Positioning

Unlike 1v1-only tools such as `spritelocker.com`, Espíritus Fortnite is a multi-player cascade and return-trade planner built for whole squads in Spanish, combining real-time synced rooms (`#sala=`) and persistent personal lockers (`#casillero=`) with one-click Discord/WhatsApp trade plans.

## Operating Context

- **Mid-session / between-match use:** Players frequently open the app on their phone while in a Fortnite lobby or between matches, requiring fast tap targets, scannable cards, and minimal friction.
- **Cross-device sharing:** Squad members share `#sala=` room links and `#casillero=` personal locker links via WhatsApp or Discord, or paste `spritelocker.com` collection/compare URLs.
- **Offline & CLI companions:** Works locally via [`abrir_app.bat`](abrir_app.bat) / [`index.html`](index.html) with localStorage fallback, alongside [`compartir.py`](compartir.py) and [`compartir.mjs`](compartir.mjs) CLI scripts.

## Capabilities and Constraints

- **Architecture:** Zero-build static HTML, CSS, and vanilla JavaScript (`index.html`, `style.css`, `app.js`, `db.js`) backed by Firebase Firestore (`firestore.rules`, `firebase.json`) for real-time room and personal locker sync.
- **Mobile-first ergonomics:** Must remain fast and readable on phone screens with comfortable tap targets for marking sprites and reviewing trade chains between matches.
- **Core views & flows:**
  - Personal Locker mode (`#casillero=...`) with search, variant/status filters, bulk mark/clear, avatar picker, and auto-sync.
  - Squad Room mode (`#sala=...`) with player lobby cards, cascade share queue (`Fila de Compartir`), 1v1 detailed comparator (`1 vs 1 Detallado`), squad-wide missing sprites (`Faltantes del Escuadrón`), and Vault (`Bóveda C7S4` / `C7S3`).
- **Link compatibility:** Decodes `spritelocker.com` collection (`#c=...`) and compare (`#vs=...`) URLs as well as raw codes.
- **Language:** Spanish-first UI (`lang="es"`).

## Brand Commitments

- **Name:** Espíritus Fortnite (Organizador de Intercambios en Cadena).
- **Domain terminology:** Preserve established Spanish Fortnite terms (`espíritus`, `casillero`, `sala`, `polvo`, `Bóveda`, `Normal`, `Fortuna`, `Maldito`).
- **Assets:** [`favicon.svg`](favicon.svg) and [`sprites_db.json`](sprites_db.json) / [`db.js`](db.js) sprite catalog.

## Evidence on Hand

- Active sprite catalog in [`sprites_db.json`](sprites_db.json) and [`db.js`](db.js): Chapter 7 Minitemporada (16 sprites / 42 variants: Normal, Fortuna, Maldito) plus Vault data (`C7S4` 27 sprites / 162 variants, `C7S3` 25 sprites).
- No external user testimonials, analytics, or marketing claims are on hand; future copy must not fabricate them.

## Product Principles

1. **Squad-first clarity:** Prioritize multi-player trade chains and actionable next steps over raw data tables.
2. **Between-match speed:** Every primary action (join room, toggle owned sprites, copy trade plan) should take seconds on a phone.
3. **Zero-friction sharing:** Links (`#sala=`, `#casillero=`, `spritelocker.com`) and chat exports (Discord/WhatsApp) should work without accounts or setup.
4. **Stay lightweight:** Preserve the zero-build static web architecture so the app loads fast and runs anywhere.
