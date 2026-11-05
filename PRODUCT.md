# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A student, developer, or builder balancing university computer science coursework (operating systems, data structures, algorithms, databases) with AI-assisted software shipping, hackathons, and personal projects. The user uses the tool throughout the day on desktop during study/work sessions and across breaks.

## Product Purpose

A personal companion and second brain that prevents knowledge loss, manages learning queues, and honestly tracks technical growth. Success means the user effortlessly captures every valuable link or video without form-filling fatigue, maintains an active learning queue, and holds an authentic, gamified record of their skills that separates real foundational craftsmanship from AI-generated velocity.

## Positioning

Unlike generic bookmark managers or static portfolios, Tracker // Agent introduces the **Authorship Spectrum**:
1. Hand-crafted college coursework and scratch implementations strictly earn **Craftsman XP** (rewarding genuine syntax mastery, pointer logic, algorithms, and manual debugging).
2. AI-assisted hackathon projects and prompt-engineered workflows strictly earn **Velocity XP** (rewarding rapid assembly and system design, without falsely inflating core coding competence).
3. The natural-language **Universal Command Bar** ("Prompt & Done") turns capture, queuing, milestone logging, and retrieval into instantaneous single-line commands.

## Operating Context

- Daily desktop browser usage alongside code editors (VS Code / Cursor / terminal), university course portals, YouTube lectures, and GitHub.
- Low-latency, keyboard-first environment (`Cmd+K` omni-bar) designed to eliminate manual modal clicking and form fatigue.
- Local-first architecture (instant offline loading with LocalStorage) with optional Gemini API augmentation for deep summaries and hackathon ideation.

## Capabilities and Constraints

- **Knowledge Vault**: Color-coded, tagged website bookmark storage with live search, filtering, and 1-click external navigation.
- **YouTube Watch Hub**: Separate `To Watch` and `Watched` queues with oEmbed metadata parsing, video duration tags, AI briefing summaries, and 1-click completion (`+35 XP`).
- **Authorship Spectrum Milestone Logging**: Logs college labs, hackathons, and projects under three distinct modes:
  - `100% Handcrafted` (Core Craftsman XP)
  - `AI-Assisted` (Balanced Craftsman & Velocity XP)
  - `Vibe-Coded / AI Prototype` (Velocity XP only, 0% core syntax credit)
- **Gamified RPG Skill Matrix**: Dual tracks (Craftsman vs. Velocity), XP health-bars, mastery tiers (Novice ➔ Apprentice ➔ Practitioner ➔ Specialist ➔ Grandmaster), and celebratory level-up animations with Web Audio API arcade fanfares.
- **Agent Omni-Bar**: Natural language prompt interpretation executing database actions and metadata extraction.
- **Technical Constraints**: Local-first persistence; offline-resilient Web Audio API sound synthesis; no mandatory backend database required for core operations.

## Brand Commitments

- **Product Name**: Tracker // Agent
- **Aesthetic Vibe**: Dark Minimal Neo-Brutalism. Deep matte obsidian surfaces (`#0C0D11`, `#14161C`), solid 2px dark-zinc borders (`#2D323D`), crisp hard drop-shadows (`box-shadow: 3px 3px 0px #000`), tactile active button depressions, and high-contrast neon accents (Mint `#6EE7B7`, Lavender `#C4B5FD`, Amber `#FDE047`, Sky `#93C5FD`).
- **Tone**: Focused, tactile, high-agency, arcade-charmed, and engineering-grounded.

## Evidence on Hand

- Runnable Next.js 16 (App Router) codebase in `src/`.
- Working components: `Header.tsx`, `CommandBar.tsx`, `WebsiteGrid.tsx`, `VideoQueue.tsx`, `MilestoneTimeline.tsx`, `SkillTree.tsx`, `LevelUpCelebration.tsx`, `Modal.tsx`, `Button.tsx`, `Badge.tsx`.
- Synthesized Web Audio API sound manager in `src/lib/sound.ts`.
- Pre-populated realistic initial dataset in `src/lib/initial-data.ts`.

## Product Principles

1. **Zero Form-Filling Fatigue**: If adding a bookmark or logging a lab takes more than a 2-second prompt or 1 click, the design has failed.
2. **Honest Skill Attribution**: AI velocity is celebrated, but never allowed to masquerade as core human coding mastery.
3. **Tactile & Audible Feedback**: Actions should feel physical—hard borders, sharp drop-shadows, satisfying clicks, and rewarding level-up fanfare.
4. **Calm Daily Utility**: High contrast and bold brutalist accents, but on an uncluttered obsidian canvas that never strains the eyes during late-night study sessions.

