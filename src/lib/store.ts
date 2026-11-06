'use client';

import { useState, useEffect } from 'react';
import {
  Category,
  Website,
  YouTubeVideo,
  Skill,
  Milestone,
  UserProfile,
  TrackType,
  AuthorshipMode,
  PlatformType,
  PlatformStats,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WEBSITES,
  INITIAL_YOUTUBE_VIDEOS,
  INITIAL_SKILLS,
  INITIAL_MILESTONES,
  INITIAL_USER_PROFILE,
} from './initial-data';
import { sound } from './sound';

const STORAGE_KEYS = {
  CATEGORIES: 'ptracker_categories',
  WEBSITES: 'ptracker_websites',
  YOUTUBE: 'ptracker_youtube',
  SKILLS: 'ptracker_skills',
  MILESTONES: 'ptracker_milestones',
  PROFILE: 'ptracker_profile',
};

export interface LevelUpEvent {
  skillName: string;
  previousLevel: number;
  newLevel: number;
  tier: string;
  track: 'craftsman' | 'velocity';
}

function calculateTier(level: number): Skill['tier'] {
  if (level >= 45) return 'Grandmaster';
  if (level >= 30) return 'Specialist';
  if (level >= 15) return 'Practitioner';
  if (level >= 6) return 'Apprentice';
  return 'Novice';
}

export function useTrackerStore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [youtubeVideos, setYouTubeVideos] = useState<YouTubeVideo[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLevelUp, setActiveLevelUp] = useState<LevelUpEvent | null>(null);

  // Initialize from LocalStorage or seed defaults
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);

      const savedWebs = localStorage.getItem(STORAGE_KEYS.WEBSITES);
      setWebsites(savedWebs ? JSON.parse(savedWebs) : INITIAL_WEBSITES);

      const savedYt = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      setYouTubeVideos(savedYt ? JSON.parse(savedYt) : INITIAL_YOUTUBE_VIDEOS);

      const savedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
      setSkills(savedSkills ? JSON.parse(savedSkills) : INITIAL_SKILLS);

      const savedMiles = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      setMilestones(savedMiles ? JSON.parse(savedMiles) : INITIAL_MILESTONES);

      const savedProf = localStorage.getItem(STORAGE_KEYS.PROFILE);
      setProfile(savedProf ? JSON.parse(savedProf) : INITIAL_USER_PROFILE);
    } catch (e) {
      console.error('Failed to load local storage', e);
      setCategories(INITIAL_CATEGORIES);
      setWebsites(INITIAL_WEBSITES);
      setYouTubeVideos(INITIAL_YOUTUBE_VIDEOS);
      setSkills(INITIAL_SKILLS);
      setMilestones(INITIAL_MILESTONES);
      setProfile(INITIAL_USER_PROFILE);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
  }, [websites, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(youtubeVideos));
  }, [youtubeVideos, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  }, [milestones, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile, isLoaded]);

  // Website Actions
  const addWebsite = (website: Omit<Website, 'id' | 'createdAt'>) => {
    const newSite: Website = {
      ...website,
      id: 'web-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setWebsites((prev) => [newSite, ...prev]);
    sound.playSuccess();
    return newSite;
  };

  const deleteWebsite = (id: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id));
    sound.playClick();
  };

  const updateWebsite = (id: string, partial: Partial<Website>) => {
    setWebsites((prev) => prev.map((w) => (w.id === id ? { ...w, ...partial } : w)));
  };

  // YouTube Actions
  const addYouTubeVideo = (video: Omit<YouTubeVideo, 'id' | 'createdAt'>) => {
    const newVideo: YouTubeVideo = {
      ...video,
      id: 'yt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setYouTubeVideos((prev) => [newVideo, ...prev]);
    sound.playSuccess();
    return newVideo;
  };

  const updateYouTubeVideo = (id: string, partial: Partial<YouTubeVideo>) => {
    setYouTubeVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...partial } : v)));
  };

  const deleteYouTubeVideo = (id: string) => {
    setYouTubeVideos((prev) => prev.filter((v) => v.id !== id));
    sound.playClick();
  };

  const markVideoWatched = (id: string, notes?: string) => {
    const video = youtubeVideos.find((v) => v.id === id);
    if (!video) return;

    setYouTubeVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'watched',
              notes: notes || v.notes,
              watchedAt: new Date().toISOString(),
            }
          : v
      )
    );

    // Award Knowledge XP
    setProfile((prev) => ({
      ...prev,
      totalKnowledgeXp: prev.totalKnowledgeXp + 35,
    }));

    sound.playSuccess();
  };

  // Skill & XP Awarding Engine
  const awardXpToSkill = (
    skillName: string,
    amount: number,
    track: 'craftsman' | 'velocity'
  ): LevelUpEvent | null => {
    let triggeredLevelUp: LevelUpEvent | null = null;

    setSkills((prevSkills) => {
      // Find matching skill or create one
      const index = prevSkills.findIndex(
        (s) => s.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.name.toLowerCase())
      );

      if (index === -1) {
        // Create new skill dynamically
        const newSkill: Skill = {
          id: 'skill-' + Date.now(),
          name: skillName,
          track,
          level: 1,
          xp: amount,
          nextLevelXp: 150,
          icon: track === 'craftsman' ? 'Cpu' : 'Zap',
          tier: 'Novice',
          category: track === 'craftsman' ? 'Foundations' : 'AI & Systems',
          description: `Skill automatically tracked via your learning journey.`,
        };
        return [...prevSkills, newSkill];
      }

      const current = prevSkills[index];
      let newXp = current.xp + amount;
      let newLevel = current.level;
      let nextXp = current.nextLevelXp;
      let leveledUp = false;

      while (newXp >= nextXp) {
        newXp -= nextXp;
        newLevel += 1;
        nextXp = Math.floor(nextXp * 1.25);
        leveledUp = true;
      }

      if (leveledUp) {
        const tier = calculateTier(newLevel);
        triggeredLevelUp = {
          skillName: current.name,
          previousLevel: current.level,
          newLevel,
          tier,
          track: current.track,
        };
      }

      const updated = [...prevSkills];
      updated[index] = {
        ...current,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextXp,
        tier: calculateTier(newLevel),
      };
      return updated;
    });

    if (triggeredLevelUp) {
      setActiveLevelUp(triggeredLevelUp);
      sound.playLevelUp();
    } else {
      sound.playSuccess();
    }

    return triggeredLevelUp;
  };

  // Milestone Logging with AI Involvement Spectrum
  const logMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: 'mile-' + Date.now(),
    };

    setMilestones((prev) => [newMilestone, ...prev]);

    // Update global profile XP
    setProfile((prev) => ({
      ...prev,
      totalCraftsmanXp: prev.totalCraftsmanXp + newMilestone.xpAwarded.craftsmanXp,
      totalVelocityXp: prev.totalVelocityXp + newMilestone.xpAwarded.velocityXp,
    }));

    // Award XP to relevant tech stack skills
    if (newMilestone.techStack.length > 0) {
      const primaryTech = newMilestone.techStack[0];
      const track: TrackType = newMilestone.authorship === 'handcrafted' ? 'craftsman' : 'velocity';
      const xp = track === 'craftsman' ? newMilestone.xpAwarded.craftsmanXp : newMilestone.xpAwarded.velocityXp;
      if (xp > 0) {
        awardXpToSkill(primaryTech, xp, track as any);
      }
    }

    return newMilestone;
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...category,
      id: 'cat-' + Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
    sound.playSuccess();
    return newCat;
  };

  const setGeminiApiKey = (key: string) => {
    setProfile((prev) => ({ ...prev, geminiApiKey: key }));
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
      characterCustomization: updated.characterCustomization
        ? { ...(prev.characterCustomization || {}), ...updated.characterCustomization } as any
        : prev.characterCustomization,
    }));
    sound.playSuccess();
  };

  const saveCompetitiveProfile = (platform: PlatformType, stats: PlatformStats) => {
    setProfile((prev) => {
      const updatedProfiles = {
        ...(prev.competitiveProfiles || {}),
        [platform]: stats,
      };

      let bonusCraftsman = 0;
      let bonusVelocity = 0;
      if (stats.verified) {
        if (platform === 'leetcode' || platform === 'codeforces' || platform === 'codechef') {
          bonusCraftsman = 75;
        } else if (platform === 'github') {
          bonusVelocity = 75;
        }
      }

      return {
        ...prev,
        totalCraftsmanXp: prev.totalCraftsmanXp + bonusCraftsman,
        totalVelocityXp: prev.totalVelocityXp + bonusVelocity,
        competitiveProfiles: updatedProfiles,
      };
    });
    sound.playSuccess();
  };

  const removeCompetitiveProfile = (platform: PlatformType) => {
    setProfile((prev) => {
      const updatedProfiles = { ...(prev.competitiveProfiles || {}) };
      delete updatedProfiles[platform];
      return {
        ...prev,
        competitiveProfiles: updatedProfiles,
      };
    });
    sound.playClick();
  };

  return {
    categories,
    websites,
    youtubeVideos,
    skills,
    milestones,
    profile,
    isLoaded,
    activeLevelUp,
    setActiveLevelUp,
    addWebsite,
    deleteWebsite,
    updateWebsite,
    addYouTubeVideo,
    updateYouTubeVideo,
    deleteYouTubeVideo,
    markVideoWatched,
    awardXpToSkill,
    logMilestone,
    addCategory,
    setGeminiApiKey,
    updateProfile,
    saveCompetitiveProfile,
    removeCompetitiveProfile,
  };
}

