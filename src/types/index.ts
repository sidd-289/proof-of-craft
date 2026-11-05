export type TrackType = 'craftsman' | 'velocity' | 'knowledge';

export type AuthorshipMode = 'handcrafted' | 'assisted' | 'ai_generated';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string; // Hex or Tailwind color
  description?: string;
}

export interface Website {
  id: string;
  url: string;
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  isFavorite: boolean;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface YouTubeVideo {
  id: string;
  url: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration?: string;
  categoryId: string;
  status: 'to_watch' | 'watched';
  notes?: string;
  aiSummary?: string;
  watchedAt?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  track: 'craftsman' | 'velocity';
  level: number;
  xp: number;
  nextLevelXp: number;
  icon: string;
  tier: 'Novice' | 'Apprentice' | 'Practitioner' | 'Specialist' | 'Grandmaster';
  category: string;
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  type: 'college_lab' | 'coursework' | 'hackathon' | 'personal_project' | 'competition';
  authorship: AuthorshipMode;
  date: string;
  techStack: string[];
  description: string;
  roleDescription?: string;
  xpAwarded: {
    craftsmanXp: number;
    velocityXp: number;
  };
  link?: string;
  outcome?: string; // e.g. "Completed Lab with Grade A", "Winner Track #1", "Finalist"
}

export interface UserProfile {
  name: string;
  title: string;
  totalCraftsmanXp: number;
  totalVelocityXp: number;
  totalKnowledgeXp: number;
  streakDays: number;
  lastActiveDate: string;
  geminiApiKey?: string;
}

export interface AgentActionExecution {
  type: 'save_website' | 'save_youtube' | 'log_milestone' | 'mark_video_watched' | 'search' | 'ideate' | 'unknown';
  success: boolean;
  message: string;
  data?: any;
  xpGained?: {
    track: TrackType;
    amount: number;
    skillName?: string;
  };
  levelUp?: {
    skillName: string;
    previousLevel: number;
    newLevel: number;
    tier: string;
  };
}

