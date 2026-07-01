# Swarna Sparsh — Premium Mobile-First QR Menu

This is a React + Vite TypeScript project: a mobile-first, premium QR restaurant menu for Swarna Sparsh.

Quick start

1. Install:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Notes

- Menu data is in `src/data/menu.json`. Replace items with the exact menu content from https://swarnasparsh.in/food. Keep IDs stable when editing.
- Replace placeholder images in `public/placeholders/` with real dish images.
- Change logo and colors in `src/components/Header.tsx` and `tailwind.config.js`.

Translation

- Language files are in `src/locales/` (English, Hindi, Marathi). The site remembers language in `localStorage`.

Call Waiter

- Floating button opens the Call Waiter panel; this is frontend-only and shows a confirmation.
