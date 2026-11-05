# Component Dependency Trees

## / (Home & Focus Dashboard)
Entry: `src/app/page.tsx`
Layout: `src/app/layout.tsx`

Dependencies:
- `src/components/layout/Header.tsx`
  - `src/components/layout/SettingsModal.tsx`
    - `src/components/ui/Modal.tsx`
    - `src/components/ui/Button.tsx`
  - `src/lib/sound.ts`
- `src/components/agent/CommandBar.tsx`
  - `src/lib/agent.ts`
    - `src/lib/youtube.ts`
  - `src/lib/sound.ts`
- `src/components/agent/AgentResultModal.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Badge.tsx`
- `src/components/gamification/LevelUpCelebration.tsx`
  - `src/components/ui/Button.tsx`
- `src/components/vault/WebsiteGrid.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/vault/AddWebsiteModal.tsx`
    - `src/components/ui/Modal.tsx`
    - `src/components/ui/Button.tsx`
- `src/components/youtube/VideoQueue.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/youtube/AddVideoModal.tsx`
    - `src/components/ui/Modal.tsx`
    - `src/components/ui/Button.tsx`
    - `src/lib/youtube.ts`
- `src/components/journey/MilestoneTimeline.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/journey/LogMilestoneModal.tsx`
    - `src/components/ui/Modal.tsx`
    - `src/components/ui/Button.tsx`
- `src/components/gamification/SkillTree.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Badge.tsx`
- `src/lib/store.ts`
  - `src/lib/initial-data.ts`
  - `src/lib/sound.ts`

