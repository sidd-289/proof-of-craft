# ⚡ Tracker // Agentic Vault & Skill Matrix

> A **Personal Knowledge Vault & Gamified Skill Radar** designed in **Dark Minimal Neo-Brutalism**. 
> Distinguishes between **genuine handcrafted skills** (college labs, coursework, scratch code) and **AI-assisted velocity** (hackathon MVPs, prompt workflows).

---

## 🌟 Core Features

### 1. 💬 Universal Agent Command Bar ("Prompt & Done")
Never fill out tedious forms. Just press `Cmd + K` or type naturally in the prompt bar:
- `"Save https://youtu.be/kCc8FmEb1nY to watch later, it's about neural networks"`
- `"Log college OS lab on Semaphores in C, wrote it completely from scratch"`
- `"Save https://astral.sh/uv under dev tools"`
- `"Brainstorm hackathon project ideas based on my skills"`
- `"Mark the Andrej Karpathy video as watched"`

The agent parses your intent, extracts metadata, saves to database, and triggers feedback & rewards automatically.

---

### 2. 🛡️ Authorship Spectrum: College Scratch vs. AI-Assisted
Protects your genuine foundational skills from being falsely inflated by AI:
- **100% Handcrafted (College / Scratch)**: Awards **Craftsman XP** (`+150 XP` for C, Java, DSA, OS).
- **AI-Assisted (Hybrid)**: Splits XP between architecture and velocity.
- **AI-Orchestrated (Vibe-Coded)**: Awards **Velocity XP** (`+300 XP`), but `0%` core syntax coding skill.

---

### 3. 🎬 YouTube Hub (`To Watch` vs `Watched`)
- High-res YouTube thumbnail previews, duration badges, and channel info.
- Auto-fetches titles and creator names via oEmbed.
- AI Briefing & takeaway notes for each video.
- 1-click **"Mark as Watched"** awards `+35 Knowledge XP`.

---

### 4. 🔖 Categorized Website Vault
- Custom color-coded categories:
  - `🤖 AI & Agents` (Retro Lavender)
  - `🎓 College & DSA` (Neo Mint)
  - `🛠️ Dev Tools & Infra` (Sky Blue)
  - `🎨 UI & Design` (Retro Amber)
  - `⚡ Hackathon Stacks` (Neo Pink)
- Tagging, favorites, search, and direct link actions.

---

### 5. 🎮 Gamification & Level-Up Celebrations
- **Mastery Tiers**: Bronze Novice ➔ Silver Apprentice ➔ Gold Practitioner ➔ Platinum Specialist ➔ Diamond Grandmaster.
- Celebratory modal with **Neo-Brutalist particle confetti** and **Web Audio API arcade chimes**.
- Interactive **Tech Tree & Skill Radars** with segmented XP health-bars.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000
```

---

## 🎨 Theme: Dark Minimal Neo-Brutalism
- Deep obsidian matte surface (`#0C0D11`, `#14161C`)
- Solid 2px tactile borders with hard drop shadows (`box-shadow: 3px 3px 0px #000`)
- Active button click physics (`translate(2px, 2px)` with shadow release)
- High-contrast neon accents: Mint (`#6EE7B7`), Lavender (`#C4B5FD`), Amber (`#FDE047`)
