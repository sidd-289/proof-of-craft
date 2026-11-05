# Design System & Theme Tokens

## Part 1 — Compact Token Summary

### Color Palette (Dark Minimal Neo-Brutalism)
- Canvas Background: `#0C0D11`
- Card Surface: `#14161C`
- Raised Surface / Hover: `#1C1F27`
- Modal Surface: `#12141A`
- Border Muted: `#2D323D`
- Border Strong: `#464D5C`
- Border Contrast (Active): `#FFFFFF` or `#E4E4E7`

### Accent Colors
- Mint / Acid Emerald (`--mint`): `#6EE7B7` (Craftsman XP, College Labs, Core Handcrafted Code)
- Retro Lavender / Violet (`--violet`): `#C4B5FD` (Velocity XP, AI-Assisted Projects, Agent Automation)
- Retro Amber / Gold (`--amber`): `#FDE047` (Streaks, Level-Up Fanfare, YouTube Queue, Achievements)
- Sky Blue (`--sky`): `#93C5FD` (Web Vault, Bookmarks, Dev Tools)
- Neo Pink (`--pink`): `#F472B6` (Hackathons, Boilerplates)
- Rose / Red: `#EF4444` (Delete, Danger)

### Typography & Fonts
- Sans-serif: Geist Sans (`var(--font-geist-sans)`)
- Monospace: Geist Mono (`var(--font-geist-mono)`) used for levels, XP, shortcuts, and metadata badges.

### Neo-Brutalist Tactile Physics
- Borders: Solid 2px (`border-2 border-[#2d323d]`)
- Hard Drop Shadows:
  - Standard Card: `3px 3px 0px #000000`
  - Large / Hover Card: `4px 4px 0px #000000`
  - Modal: `6px 6px 0px #000000`
  - Badges: `1.5px 1.5px 0px #000000`
- Active Click State:
  - Button depress: `transform: translate(2px, 2px); box-shadow: 0px 0px 0px #000;`

---

## Part 2 — Raw Source Dumps

### `src/app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #0c0d11;
  --foreground: #f4f4f6;
  --surface: #14161c;
  --surface-hover: #1c1f27;
  --border-muted: #2d323d;
  --border-strong: #464d5c;
  --mint: #6ee7b7;
  --violet: #c4b5fd;
  --amber: #fde047;
  --pink: #f472b6;
  --sky: #93c5fd;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow-x: hidden;
}

/* Minimal Neo-Brutalist Utility Classes */
.brutal-card {
  background-color: #14161c;
  border: 2px solid #2d323d;
  box-shadow: 3px 3px 0px #000000;
  border-radius: 1rem;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.brutal-card:hover {
  border-color: #464d5c;
  box-shadow: 4px 4px 0px #000000;
}

.brutal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border: 2px solid #2d323d;
  box-shadow: 3px 3px 0px #000000;
  border-radius: 0.75rem;
  transition: all 0.1s ease;
  user-select: none;
  cursor: pointer;
}

.brutal-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #000000;
  border-color: #f4f4f6;
}

.brutal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #000000;
}

.brutal-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.2rem 0.55rem;
  border-radius: 0.5rem;
  border: 1.5px solid #2d323d;
  box-shadow: 1.5px 1.5px 0px #000000;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0c0d11;
}

::-webkit-scrollbar-thumb {
  background: #2d323d;
  border-radius: 4px;
  border: 1px solid #14161c;
}

::-webkit-scrollbar-thumb:hover {
  background: #464d5c;
}
```

