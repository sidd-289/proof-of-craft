export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';

export type CharacterArchetype =
  | 'cyber_craftsman'
  | 'arcane_architect'
  | 'neon_shinobi'
  | 'shadow_alchemist'
  | 'void_walker';

export interface CharacterCustomization {
  archetype: CharacterArchetype;
  hairStyle: string;
  hairColor: string;
  auraColor: string;
  gear: string;
  expression: string;
  uploadedPhotoUrl?: string;
  customAvatarUrl?: string;
  bio?: string;
  element?: string;
}

export const ARCHETYPE_PRESETS: Record<
  CharacterArchetype,
  {
    name: string;
    description: string;
    auraColor: string;
    avatarUrl: string;
    defaultGear: string;
    statFocus: string;
  }
> = {
  cyber_craftsman: {
    name: 'Cyber Craftsman',
    description: 'Master of hand-crafted systems, bare-metal logic, and neon circuitry.',
    auraColor: '#FF8A32',
    avatarUrl: '/assets/character-cyber-craftsman.png',
    defaultGear: 'Holo-Blade of Logic',
    statFocus: 'STR & CON',
  },
  arcane_architect: {
    name: 'Arcane Architect',
    description: 'High-level system designer commanding distributed digital lattices.',
    auraColor: '#E9A13D',
    avatarUrl: '/assets/character-arcane-architect.jpg',
    defaultGear: 'Sacred Data Gauntlet',
    statFocus: 'WIS & FOC',
  },
  neon_shinobi: {
    name: 'Neon Shinobi',
    description: 'Agile rapid-deployment engineer striking bugs with blistering speed.',
    auraColor: '#38BDF8',
    avatarUrl: '/assets/character-cyber-shinobi.jpg',
    defaultGear: 'Dual Cyber Katana',
    statFocus: 'FOC & DIS',
  },
  shadow_alchemist: {
    name: 'Shadow Alchemist',
    description: 'Deep subterranean compiler hacker uncovering obscure edge-case arcana.',
    auraColor: '#C4B5FD',
    avatarUrl: '/assets/character-shadow-alchemist.jpg',
    defaultGear: 'Void Code Sigil',
    statFocus: 'DIS & STR',
  },
  void_walker: {
    name: 'Void Walker',
    description: 'Transcendent full-stack anomaly bending AI velocity to absolute will.',
    auraColor: '#F472B6',
    avatarUrl: '/assets/character-shadow-alchemist.jpg',
    defaultGear: 'Quantum Rift Deck',
    statFocus: 'STR & WIS',
  },
};

export interface AttributeStat {
  code: string;
  name: string;
  value: number;
  maxValue: number;
  color: string;
  description: string;
}

export interface CharacterData {
  name: string;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  currentDay: number;
  totalDays: number;
  streakDays: number;
  totalAchievements: number;
  totalXp: number;
  rank: RankTier;
  avatarUrl?: string;
  customization?: CharacterCustomization;
  attributes: {
    CON: AttributeStat;
    FOC: AttributeStat;
    DIS: AttributeStat;
    STR: AttributeStat;
    WIS: AttributeStat;
  };
}

export const INITIAL_CHARACTER_DATA: CharacterData = {
  name: 'Sidd',
  title: 'Cyber Craftsman & System Architect',
  level: 44,
  currentXp: 1820,
  nextLevelXp: 2254,
  currentDay: 66,
  totalDays: 66,
  streakDays: 4,
  totalAchievements: 14,
  totalXp: 14820,
  rank: 'Bronze',
  avatarUrl: '/assets/character.png',
  customization: {
    archetype: 'cyber_craftsman',
    hairStyle: 'Spiky Rebel',
    hairColor: '#171717',
    auraColor: '#FF8A32',
    gear: 'Holo-Blade of Logic',
    expression: 'Focused',
    bio: 'Crafting digital architectures from bare-metal logic to high-agency systems.',
    element: 'Neon Flux',
  },
  attributes: {
    CON: {
      code: 'CON',
      name: 'Constitution',
      value: 19,
      maxValue: 30,
      color: '#FF8A32',
      description: 'Physical & mental endurance, daily building stamina, habits.',
    },
    FOC: {
      code: 'FOC',
      name: 'Focus',
      value: 8,
      maxValue: 30,
      color: '#38BDF8',
      description: 'Deep work capacity, uninterrupted terminal & algorithm sprints.',
    },
    DIS: {
      code: 'DIS',
      name: 'Discipline',
      value: 14,
      maxValue: 30,
      color: '#6EE7B7',
      description: 'Consistency of commits, showing up daily, queue completion.',
    },
    STR: {
      code: 'STR',
      name: 'Strength (Craftsman)',
      value: 19,
      maxValue: 30,
      color: '#F472B6',
      description: 'Foundational CS, C++ systems, manual pointer & OS debugging.',
    },
    WIS: {
      code: 'WIS',
      name: 'Wisdom (Knowledge)',
      value: 8,
      maxValue: 30,
      color: '#C4B5FD',
      description: 'Vault research papers, AI architectures, YouTube lectures.',
    },
  },
};

