import { AgentActionExecution, Category, Skill, Website, YouTubeVideo, AuthorshipMode } from '@/types';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtube';

export interface AgentContext {
  categories: Category[];
  websites: Website[];
  youtubeVideos: YouTubeVideo[];
  skills: Skill[];
  onAddWebsite: (website: any) => Website;
  onAddYouTube: (video: any) => YouTubeVideo;
  onMarkVideoWatched: (id: string, notes?: string) => void;
  onLogMilestone: (milestone: any) => any;
  onAwardXp: (skillName: string, amount: number, track: 'craftsman' | 'velocity') => any;
  geminiApiKey?: string;
}

export async function processAgentPrompt(prompt: string, context: AgentContext): Promise<AgentActionExecution> {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // Try API route first if Gemini key or server is configured
  try {
    const apiRes = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: p,
        geminiApiKey: context.geminiApiKey,
        categories: context.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
        skills: context.skills.map((s) => ({ name: s.name, level: s.level, track: s.track })),
      }),
    });

    if (apiRes.ok) {
      const parsed = await apiRes.json();
      if (parsed && parsed.actionType && parsed.actionType !== 'unknown') {
        return executeAction(parsed, context, p);
      }
    }
  } catch (err) {
    // Fall back to robust heuristic engine
    console.warn('Backend agent route fallback to local parser', err);
  }

  // Local Intelligent Heuristic Parser
  return parseLocally(p, context);
}

// Local Natural Language Execution Engine
async function parseLocally(prompt: string, context: AgentContext): Promise<AgentActionExecution> {
  const lower = prompt.toLowerCase();

  // 1. Check for YouTube URL
  const ytMatch = parseYouTubeUrl(prompt);
  if (ytMatch) {
    const isWatched = lower.includes('watched') || lower.includes('finished') || lower.includes('already watched');
    const oembed = await fetchYouTubeOEmbed(ytMatch.cleanUrl);

    // Auto-detect category
    let categoryId = 'cat-ai';
    if (lower.includes('college') || lower.includes('os') || lower.includes('dsa') || lower.includes('algorithm')) {
      categoryId = 'cat-college';
    } else if (lower.includes('tool') || lower.includes('rust') || lower.includes('docker') || lower.includes('git')) {
      categoryId = 'cat-tools';
    } else if (lower.includes('ui') || lower.includes('design') || lower.includes('css')) {
      categoryId = 'cat-ui';
    }

    const title = oembed?.title || `YouTube Video (${ytMatch.videoId})`;
    const channel = oembed?.author_name || 'YouTube Creator';

    const newVideo = context.onAddYouTube({
      url: ytMatch.cleanUrl,
      videoId: ytMatch.videoId,
      title,
      channelTitle: channel,
      thumbnailUrl: ytMatch.thumbnailUrl,
      categoryId,
      status: isWatched ? 'watched' : 'to_watch',
      notes: `Saved via Agent: "${prompt}"`,
    });

    return {
      type: 'save_youtube',
      success: true,
      message: `Automatically saved to YouTube ${isWatched ? 'Watched Archive' : 'To Watch Queue'}.`,
      data: newVideo,
      xpGained: isWatched
        ? {
            track: 'knowledge',
            amount: 35,
            skillName: 'Continuous Learning',
          }
        : undefined,
    };
  }

  // 2. Check for General Website URL
  const urlMatch = prompt.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    const url = urlMatch[0];
    let categoryId = 'cat-tools';
    let tags = ['Resource'];

    if (lower.includes('ai') || lower.includes('agent') || lower.includes('llm') || url.includes('langchain') || url.includes('huggingface')) {
      categoryId = 'cat-ai';
      tags = ['AI', 'Agent'];
    } else if (lower.includes('college') || lower.includes('algo') || lower.includes('exam') || lower.includes('dsa')) {
      categoryId = 'cat-college';
      tags = ['College', 'DSA'];
    } else if (lower.includes('ui') || lower.includes('design') || lower.includes('css') || lower.includes('component')) {
      categoryId = 'cat-ui';
      tags = ['UI', 'Frontend'];
    } else if (lower.includes('hackathon') || lower.includes('starter') || lower.includes('template')) {
      categoryId = 'cat-hackathons';
      tags = ['Hackathon', 'Boilerplate'];
    }

    // Generate readable title from URL domain and path
    let title = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace('www.', '');
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      title = pathParts.length > 0 ? `${pathParts[pathParts.length - 1]} (${host})` : host;
    } catch {}

    const newSite = context.onAddWebsite({
      url,
      title,
      description: `Saved via Agent: "${prompt}"`,
      categoryId,
      tags,
      isFavorite: false,
      status: 'unread',
    });

    return {
      type: 'save_website',
      success: true,
      message: `Website saved and categorized under "${context.categories.find((c) => c.id === categoryId)?.name}".`,
      data: newSite,
      xpGained: {
        track: 'knowledge',
        amount: 25,
      },
    };
  }

  // 3. Mark Video as Watched
  if (lower.includes('mark') && (lower.includes('watched') || lower.includes('finished'))) {
    const matchingVideo = context.youtubeVideos.find(
      (v) =>
        lower.includes(v.title.toLowerCase().slice(0, 15)) ||
        lower.includes(v.channelTitle.toLowerCase()) ||
        v.status === 'to_watch'
    );

    if (matchingVideo) {
      context.onMarkVideoWatched(matchingVideo.id, `Watched via Agent command: "${prompt}"`);
      return {
        type: 'mark_video_watched',
        success: true,
        message: `Marked "${matchingVideo.title}" as Watched.`,
        data: matchingVideo,
        xpGained: {
          track: 'knowledge',
          amount: 35,
          skillName: 'Knowledge Growth',
        },
      };
    }
  }

  // 4. College Lab / Milestone / Project Submission
  if (
    lower.includes('lab') ||
    lower.includes('assignment') ||
    lower.includes('college') ||
    lower.includes('hackathon') ||
    lower.includes('project') ||
    lower.includes('finished') ||
    lower.includes('submitted')
  ) {
    const isCollegeOrScratch =
      lower.includes('college') ||
      lower.includes('lab') ||
      lower.includes('scratch') ||
      lower.includes('coursework') ||
      lower.includes('c++') ||
      lower.includes('from scratch') ||
      lower.includes('myself');

    const isAi = lower.includes('with ai') || lower.includes('vibe') || lower.includes('cursor') || lower.includes('gemini');
    const isVibeCoded = lower.includes('vibe') || lower.includes('prompt only') || lower.includes('ai generated');

    const authorship: AuthorshipMode = isCollegeOrScratch && !isAi ? 'handcrafted' : isVibeCoded ? 'ai_generated' : 'assisted';

    // Detect tech stack
    const techStack: string[] = [];
    if (lower.includes('c++') || lower.includes('c ') || lower.endsWith('c')) techStack.push('C / C++');
    if (lower.includes('python')) techStack.push('Python');
    if (lower.includes('java')) techStack.push('Java');
    if (lower.includes('react') || lower.includes('next.js')) techStack.push('Next.js');
    if (lower.includes('os') || lower.includes('semaphore') || lower.includes('thread')) techStack.push('OS & Systems');
    if (lower.includes('dsa') || lower.includes('algo') || lower.includes('graph')) techStack.push('DSA');
    if (techStack.length === 0) techStack.push('Software Engineering');

    const primaryTech = techStack[0];
    const craftsmanXp = authorship === 'handcrafted' ? 150 : 50;
    const velocityXp = authorship === 'assisted' ? 250 : authorship === 'ai_generated' ? 300 : 0;

    const milestone = context.onLogMilestone({
      title: prompt.length > 50 ? prompt.slice(0, 50) + '...' : prompt,
      type: lower.includes('hackathon') ? 'hackathon' : 'college_lab',
      authorship,
      date: new Date().toISOString().split('T')[0],
      techStack,
      description: prompt,
      roleDescription: authorship === 'handcrafted' ? '100% Hand-coded from scratch for college/learning.' : 'AI-assisted rapid prototype.',
      xpAwarded: {
        craftsmanXp,
        velocityXp,
      },
      outcome: 'Verified Milestone',
    });

    const levelUp = context.onAwardXp(
      primaryTech,
      authorship === 'handcrafted' ? craftsmanXp : velocityXp,
      authorship === 'handcrafted' ? 'craftsman' : 'velocity'
    );

    return {
      type: 'log_milestone',
      success: true,
      message: `Milestone logged under ${authorship === 'handcrafted' ? 'Craftsman Track (100% Authentic Code)' : 'Velocity Track (AI-Assisted)'}.`,
      data: milestone,
      xpGained: {
        track: authorship === 'handcrafted' ? 'craftsman' : 'velocity',
        amount: authorship === 'handcrafted' ? craftsmanXp : velocityXp,
        skillName: primaryTech,
      },
      levelUp: levelUp || undefined,
    };
  }

  // 5. Search Intent
  if (lower.includes('find') || lower.includes('search') || lower.includes('where is')) {
    const q = prompt.replace(/find|search|where is|that|saved/gi, '').trim().toLowerCase();
    const matchedWeb = context.websites.find((w) => w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q));
    const matchedYt = context.youtubeVideos.find((v) => v.title.toLowerCase().includes(q));

    if (matchedWeb) {
      return {
        type: 'search',
        success: true,
        message: `Found website: "${matchedWeb.title}"`,
        data: matchedWeb,
      };
    }

    if (matchedYt) {
      return {
        type: 'search',
        success: true,
        message: `Found video: "${matchedYt.title}" in your ${matchedYt.status === 'to_watch' ? 'To Watch queue' : 'Watched archive'}`,
        data: matchedYt,
      };
    }

    return {
      type: 'search',
      success: false,
      message: `No exact matches for "${q}". Check the Vault or YouTube tabs!`,
    };
  }

  // 6. Ideation / Suggestions
  if (lower.includes('idea') || lower.includes('suggest') || lower.includes('hackathon') || lower.includes('what should i build')) {
    return {
      type: 'ideate',
      success: true,
      message: `Hackathon & Project Inspiration:`,
      data: {
        ideas: [
          {
            title: 'NeuralMemory CLI',
            pitch: 'A local C++/Python hybrid tool that indexes your terminal commands and college notes using local GGUF models.',
            track: 'Systems + AI',
            leverages: 'C++ Systems & Agentic AI',
          },
          {
            title: 'ProofOfWork Dev Portfolio',
            pitch: 'An automated verifier that audits git commit diffs to prove whether code was hand-written or AI generated.',
            track: 'Web & Developer Tooling',
            leverages: 'Next.js & DSA Big-O analysis',
          },
        ],
      },
    };
  }

  // Fallback
  return {
    type: 'unknown',
    success: false,
    message: `I didn't quite catch that action. Try pasting a URL, typing: "Log college OS lab on Semaphores in C", or "Suggest hackathon ideas"!`,
  };
}

async function executeAction(apiResult: any, context: AgentContext, originalPrompt: string): Promise<AgentActionExecution> {
  const { actionType, payload } = apiResult;

  if (actionType === 'save_youtube') {
    const ytMatch = parseYouTubeUrl(payload.url || originalPrompt);
    const video = context.onAddYouTube({
      url: payload.url || (ytMatch ? ytMatch.cleanUrl : originalPrompt),
      videoId: ytMatch ? ytMatch.videoId : 'custom-' + Date.now(),
      title: payload.title || 'YouTube Video',
      channelTitle: payload.channelTitle || 'YouTube Creator',
      thumbnailUrl: ytMatch ? ytMatch.thumbnailUrl : 'https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg',
      categoryId: payload.categoryId || 'cat-ai',
      status: payload.isWatched ? 'watched' : 'to_watch',
      notes: payload.notes || `Saved via Gemini Agent: "${originalPrompt}"`,
      aiSummary: payload.summary,
    });

    return {
      type: 'save_youtube',
      success: true,
      message: `Gemini Agent saved video to ${payload.isWatched ? 'Watched' : 'To Watch'} queue.`,
      data: video,
      xpGained: {
        track: 'knowledge',
        amount: 35,
        skillName: 'Continuous Learning',
      },
    };
  }

  if (actionType === 'save_website') {
    const site = context.onAddWebsite({
      url: payload.url,
      title: payload.title || 'Bookmarked Site',
      description: payload.description || `Saved via Gemini Agent: "${originalPrompt}"`,
      categoryId: payload.categoryId || 'cat-tools',
      tags: payload.tags || ['Web', 'Tool'],
      isFavorite: false,
      status: 'unread',
    });

    return {
      type: 'save_website',
      success: true,
      message: `Gemini Agent organized link into ${payload.categoryName || 'Vault'}.`,
      data: site,
      xpGained: {
        track: 'knowledge',
        amount: 25,
      },
    };
  }

  if (actionType === 'log_milestone') {
    const authorship = payload.authorship || 'handcrafted';
    const craftsmanXp = authorship === 'handcrafted' ? 150 : 50;
    const velocityXp = authorship === 'assisted' ? 250 : authorship === 'ai_generated' ? 300 : 0;
    const primaryTech = (payload.techStack && payload.techStack[0]) || 'Computer Science';

    const milestone = context.onLogMilestone({
      title: payload.title || originalPrompt,
      type: payload.type || 'college_lab',
      authorship,
      date: new Date().toISOString().split('T')[0],
      techStack: payload.techStack || [primaryTech],
      description: payload.description || originalPrompt,
      roleDescription: payload.roleDescription || '',
      xpAwarded: {
        craftsmanXp,
        velocityXp,
      },
      outcome: payload.outcome || 'Logged via Agent',
    });

    const levelUp = context.onAwardXp(
      primaryTech,
      authorship === 'handcrafted' ? craftsmanXp : velocityXp,
      authorship === 'handcrafted' ? 'craftsman' : 'velocity'
    );

    return {
      type: 'log_milestone',
      success: true,
      message: `Gemini Agent logged milestone under ${authorship === 'handcrafted' ? 'Craftsman Track' : 'Velocity Track'}.`,
      data: milestone,
      xpGained: {
        track: authorship === 'handcrafted' ? 'craftsman' : 'velocity',
        amount: authorship === 'handcrafted' ? craftsmanXp : velocityXp,
        skillName: primaryTech,
      },
      levelUp: levelUp || undefined,
    };
  }

  return parseLocally(originalPrompt, context);
}
