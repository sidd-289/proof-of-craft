import { Category, Website, YouTubeVideo, Skill, Milestone, UserProfile } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-ai',
    name: 'AI & Agents',
    slug: 'ai-agents',
    icon: 'Bot',
    color: '#C4B5FD', // Retro Lavender
    description: 'LLM agents, frameworks, prompt techniques, and papers',
  },
  {
    id: 'cat-college',
    name: 'College & DSA',
    slug: 'college-dsa',
    icon: 'GraduationCap',
    color: '#6EE7B7', // Neo Mint
    description: 'Data structures, algorithms, OS, DBMS coursework',
  },
  {
    id: 'cat-tools',
    name: 'Dev Tools & Infra',
    slug: 'dev-tools',
    icon: 'Terminal',
    color: '#93C5FD', // Sky Blue
    description: 'CLI tools, databases, Docker, package managers, git',
  },
  {
    id: 'cat-ui',
    name: 'UI & Design',
    slug: 'ui-design',
    icon: 'Palette',
    color: '#FDE047', // Retro Amber
    description: 'Design inspiration, component libraries, typography',
  },
  {
    id: 'cat-hackathons',
    name: 'Hackathon Stacks',
    slug: 'hackathons',
    icon: 'Zap',
    color: '#F472B6', // Neo Pink
    description: 'Starter kits, boilerplates, APIs, fast deployment',
  },
];

export const INITIAL_WEBSITES: Website[] = [
  {
    id: 'web-1',
    url: 'https://github.com/shadcn-ui/ui',
    title: 'shadcn/ui - Beautifully Designed Components',
    description: 'Accessible and customizable components that you can copy and paste into your apps. Built with Radix and Tailwind.',
    categoryId: 'cat-ui',
    tags: ['React', 'Tailwind', 'DesignSystem'],
    isFavorite: true,
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'web-2',
    url: 'https://visualgo.net',
    title: 'VisuAlgo - Visualising Data Structures and Algorithms',
    description: 'Interactive animated visualizer for Sorting, Graph Traversal, Binary Search Trees, and Dynamic Programming.',
    categoryId: 'cat-college',
    tags: ['Algorithms', 'Graphs', 'CollegePrep'],
    isFavorite: true,
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'web-3',
    url: 'https://github.com/langchain-ai/langgraph',
    title: 'LangGraph - Build Resilient Multi-Agent Workflows',
    description: 'Stateful, multi-actor applications with LLMs. Graph-based orchestration with human-in-the-loop and memory.',
    categoryId: 'cat-ai',
    tags: ['Agents', 'MultiAgent', 'Python'],
    isFavorite: false,
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'web-4',
    url: 'https://astral.sh/uv',
    title: 'uv - Extremely Fast Python Package Manager',
    description: 'An extremely fast Python package and project manager written in Rust, 10-100x faster than pip.',
    categoryId: 'cat-tools',
    tags: ['Python', 'Rust', 'DevOps'],
    isFavorite: false,
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    videoId: 'kCc8FmEb1nY',
    title: 'What is a Neural Network? (Deep Learning Chapter 1)',
    channelTitle: '3Blue1Brown',
    thumbnailUrl: 'https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg',
    duration: '19:13',
    categoryId: 'cat-ai',
    status: 'to_watch',
    notes: 'Watch to clarify backpropagation matrix multiplication intuitions for AI class.',
    aiSummary: 'Covers the mathematical intuition of multilayer perceptrons, weights, biases, and activation functions via stunning geometric visual animations.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'yt-2',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    videoId: 'zjkBMFhNj_g',
    title: 'Intro to Large Language Models',
    channelTitle: 'Andrej Karpathy',
    thumbnailUrl: 'https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg',
    duration: '59:45',
    categoryId: 'cat-ai',
    status: 'to_watch',
    notes: 'Recommended by hackathon mentor for understanding pre-training vs RLHF.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'yt-3',
    url: 'https://www.youtube.com/watch?v=9gBC9R-msAk',
    videoId: '9gBC9R-msAk',
    title: 'Operating Systems: Crash Course Computer Science #18',
    channelTitle: 'CrashCourse',
    thumbnailUrl: 'https://img.youtube.com/vi/9gBC9R-msAk/hqdefault.jpg',
    duration: '12:35',
    categoryId: 'cat-college',
    status: 'watched',
    watchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Great high-level overview of context switching and kernel rings before reading dinosaur book.',
    aiSummary: 'Explains the role of the OS kernel, hardware multiplexing, virtual memory paging, and process scheduling.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

export const INITIAL_SKILLS: Skill[] = [
  // Craftsman Track (College, Fundamentals, Hand-Written)
  {
    id: 'skill-cpp',
    name: 'C & C++ Systems',
    track: 'craftsman',
    level: 7,
    xp: 340,
    nextLevelXp: 500,
    icon: 'Cpu',
    tier: 'Apprentice',
    category: 'Systems & OS',
    description: 'Memory pointers, struct alignment, manual memory management, POSIX threads.',
  },
  {
    id: 'skill-dsa',
    name: 'DSA & Algorithms',
    track: 'craftsman',
    level: 9,
    xp: 420,
    nextLevelXp: 500,
    icon: 'GitFork',
    tier: 'Apprentice',
    category: 'College Core',
    description: 'Graph BFS/DFS, Trees, Heaps, Dynamic Programming, and Big-O analysis.',
  },
  {
    id: 'skill-dbms',
    name: 'Database Architecture',
    track: 'craftsman',
    level: 5,
    xp: 180,
    nextLevelXp: 300,
    icon: 'Database',
    tier: 'Novice',
    category: 'Backend Core',
    description: 'SQL queries, relational normalization, B-trees, ACID transactions.',
  },

  // Velocity Track (AI, Hackathons, Rapid Shipping)
  {
    id: 'skill-agents',
    name: 'Agentic AI & Orchestration',
    track: 'velocity',
    level: 8,
    xp: 380,
    nextLevelXp: 500,
    icon: 'Bot',
    tier: 'Apprentice',
    category: 'AI Velocity',
    description: 'Function calling, multi-agent state machines, system prompt tuning, embeddings.',
  },
  {
    id: 'skill-rapid-web',
    name: 'Rapid Web Prototyping',
    track: 'velocity',
    level: 12,
    xp: 150,
    nextLevelXp: 600,
    icon: 'Layers',
    tier: 'Practitioner',
    category: 'Frontend & Ship',
    description: 'Next.js App Router, Tailwind CSS, Vercel deployments, responsive UI assembling.',
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'mile-1',
    title: 'Operating Systems: Producer-Consumer with Semaphores',
    type: 'college_lab',
    authorship: 'handcrafted',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
    techStack: ['C', 'POSIX Threads', 'Semaphores', 'Linux'],
    description: 'Hand-coded multi-threaded circular buffer in C. Solved race conditions using pthread mutex locks and counting semaphores.',
    roleDescription: 'Wrote 100% of the code manually for college lab assessment; verified zero memory leaks with Valgrind.',
    xpAwarded: {
      craftsmanXp: 150,
      velocityXp: 0,
    },
    outcome: 'Lab Verified by Professor (Grade: 10/10)',
  },
  {
    id: 'mile-2',
    title: 'Gemini Agent Hackathon: EcoPulse MVP',
    type: 'hackathon',
    authorship: 'assisted',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0],
    techStack: ['Next.js', 'Gemini API', 'Tailwind', 'Supabase'],
    description: 'Built a 24-hour hackathon prototype analyzing household energy receipts via multimodal vision and generating savings tips.',
    roleDescription: 'Directed the product architecture and agent tool schema; used AI for rapid UI generation and mock receipt data.',
    xpAwarded: {
      craftsmanXp: 75,
      velocityXp: 250,
    },
    outcome: 'Top 10 Finalist Track Award',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Sidd',
  title: 'Polymath Engineer & Agent Architect',
  totalCraftsmanXp: 940,
  totalVelocityXp: 530,
  totalKnowledgeXp: 260,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

