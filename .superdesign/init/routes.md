# Route Structure

Meta-framework: Next.js 16 (App Router)

## Routes

### `/` (Home / Main Application)
- File: `src/app/page.tsx`
- Layout: `src/app/layout.tsx`
- Description: The single-page responsive hub featuring:
  1. `🏠 Daily Focus`: Overview dashboard with Quick XP overview, "Up Next" YouTube carousel, recently saved bookmarks, latest verified milestone.
  2. `🔖 Vault`: Categorized website vault with filter pills, search, tags, and favorites.
  3. `🎬 YouTube`: Video queue tracking (`To Watch` vs `Watched`), thumbnails, AI summaries, notes, and 1-click completion.
  4. `⚔️ Journey`: Timeline of college labs and hackathons with the Authorship spectrum (Handcrafted vs AI-Assisted).
  5. `🌳 Skill Matrix`: Interactive Tech Tree with segmented XP bars, level-up practice test buttons, and Craftsman vs Velocity tracks.
- Integrations: Global `CommandBar` with natural language agent automation, `LevelUpCelebration` modal with confetti and Web Audio fanfare, and `AgentResultModal`.

### `/api/agent` (API Endpoint)
- File: `src/app/api/agent/route.ts`
- Description: Next.js server route that calls Google GenAI SDK (`@google/genai`, model `gemini-2.5-flash`) for intent detection and structured action execution.

