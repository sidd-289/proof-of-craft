# Extractable Components

## Header
- Source: `src/components/layout/Header.tsx`
- Category: layout
- Description: Sticky top navigation bar with brand, streak counter, level badge, and settings trigger.
- Extractable props: streakDays (number, default: 4), overallLevel (number, default: 7), isMuted (boolean, default: false)
- Hardcoded: Logo SVG, app title ("TRACKER // AGENT"), layout styling

## CommandBar
- Source: `src/components/agent/CommandBar.tsx`
- Category: basic
- Description: Omni-command prompt bar for natural language agent automation and link capture.
- Extractable props: prompt (string), isProcessing (boolean), placeholder (string)
- Hardcoded: Suggestion pills, keyboard shortcut badge ([Cmd+K]), bot icon

## Button
- Source: `src/components/ui/Button.tsx`
- Category: basic
- Description: Neo-Brutalist tactile button with click sound and active press states.
- Extractable props: variant (string, default: "default"), size (string, default: "md"), disabled (boolean)
- Hardcoded: brutal-btn CSS classes, sound trigger

## Badge
- Source: `src/components/ui/Badge.tsx`
- Category: basic
- Description: Pill-shaped status and track badge with hard border and subtle background fill.
- Extractable props: variant (string, default: "neutral"), color (string)
- Hardcoded: brutal-badge styling, mono font

## Modal
- Source: `src/components/ui/Modal.tsx`
- Category: basic
- Description: Neo-Brutalist popup modal dialog with spring animations and escape key listener.
- Extractable props: isOpen (boolean), title (string), maxWidth (string)
- Hardcoded: Backdrop blur, close button X icon, spring animation parameters

## WebsiteCard
- Source: `src/components/vault/WebsiteGrid.tsx`
- Category: basic
- Description: Resource card displaying title, description, category pill, favorite toggle, and open link button.
- Extractable props: title (string), url (string), description (string), isFavorite (boolean), tags (string[])
- Hardcoded: Card layout, star icon, external link icon

## VideoCard
- Source: `src/components/youtube/VideoQueue.tsx`
- Category: basic
- Description: YouTube video card with thumbnail preview, duration badge, title, channel, and "Mark Watched" action.
- Extractable props: title (string), channelTitle (string), thumbnailUrl (string), duration (string), isWatched (boolean)
- Hardcoded: Aspect video container, play overlay, XP badge

## SkillNodeCard
- Source: `src/components/gamification/SkillTree.tsx`
- Category: basic
- Description: Gamified skill node with segmented XP progress bar, tier badge, level number, and practice button.
- Extractable props: name (string), level (number), xp (number), nextLevelXp (number), tier (string), track (string)
- Hardcoded: HP bar styling, icon container, practice button

