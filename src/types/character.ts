export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';

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
