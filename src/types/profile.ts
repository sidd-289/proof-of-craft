export type PlatformType = 'github' | 'leetcode' | 'codeforces' | 'codechef';

export interface PlatformMetrics {
  primaryLabel: string;
  primaryValue: string | number;
  secondaryLabel?: string;
  secondaryValue?: string | number;
  tertiaryLabel?: string;
  tertiaryValue?: string | number;
  rankTitle?: string;
  avatarUrl?: string;
  profileUrl?: string;
  details?: Record<string, string | number>;
}

export interface PlatformStats {
  platform: PlatformType;
  username: string;
  apiKey?: string;
  verified: boolean;
  verifiedAt?: string;
  metrics?: PlatformMetrics;
}

export interface UserCompetitiveProfiles {
  github?: PlatformStats;
  leetcode?: PlatformStats;
  codeforces?: PlatformStats;
  codechef?: PlatformStats;
}

export interface PlatformDefinition {
  id: PlatformType;
  name: string;
  color: string;
  badgeBg: string;
  iconName: string;
  placeholder: string;
  apiKeyLabel?: string;
  apiKeyPlaceholder?: string;
  apiKeyHelper?: string;
  docsUrl: string;
}

export const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    color: '#F5F0E5',
    badgeBg: '#222222',
    iconName: 'Github',
    placeholder: 'torvalds or your-username',
    apiKeyLabel: 'Personal Access Token (Optional)',
    apiKeyPlaceholder: 'ghp_...',
    apiKeyHelper: 'Optional: Grants access to private repo stats and higher rate limits.',
    docsUrl: 'https://github.com/settings/tokens',
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    color: '#FFA116',
    badgeBg: '#281a05',
    iconName: 'Code2',
    placeholder: 'leetcode-username',
    apiKeyLabel: 'Session Cookie / API Token (Optional)',
    apiKeyPlaceholder: 'LEETCODE_SESSION...',
    apiKeyHelper: 'Public stats are verified automatically via LeetCode GraphQL API.',
    docsUrl: 'https://leetcode.com',
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    color: '#38BDF8',
    badgeBg: '#082f49',
    iconName: 'Terminal',
    placeholder: 'tourist or your-handle',
    apiKeyLabel: 'API Key (Optional)',
    apiKeyPlaceholder: 'API Key...',
    apiKeyHelper: 'Official Codeforces public API verified automatically.',
    docsUrl: 'https://codeforces.com/settings/api',
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    color: '#C4B5FD',
    badgeBg: '#241a3d',
    iconName: 'Award',
    placeholder: 'codechef-handle',
    apiKeyLabel: 'API Token (Optional)',
    apiKeyPlaceholder: 'Bearer token...',
    apiKeyHelper: 'Verifies star ranking and current contest rating.',
    docsUrl: 'https://www.codechef.com',
  },
];

