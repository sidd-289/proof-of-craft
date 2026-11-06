'use client';

import React from 'react';

export const GithubIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LeetCodeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.658c.241.025.485.038.729.038.995 0 1.98-.255 2.857-.751l4.02-2.316a1.385 1.385 0 0 0 .69-1.2 1.385 1.385 0 0 0-.69-1.2l-3.96-2.28a1.59 1.59 0 0 1-.8-1.38c0-.57.3-1.09.8-1.38l3.96-2.28a1.385 1.385 0 0 0 .69-1.2 1.385 1.385 0 0 0-.69-1.2L14.444.438A1.374 1.374 0 0 0 13.483 0z" />
    <path
      d="M4.538 14.887a1.385 1.385 0 0 0 1.385 1.385h13.846a1.385 1.385 0 1 0 0-2.77H5.923a1.385 1.385 0 0 0-1.385 1.385z"
      opacity="0.75"
    />
  </svg>
);

export const CodeforcesIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {/* Codeforces iconic 3-bar indicator */}
    <rect x="2" y="9" width="4.5" height="13" rx="1.5" fill="#FFD43B" />
    <rect x="9.75" y="2" width="4.5" height="20" rx="1.5" fill="#1F8ACB" />
    <rect x="17.5" y="6" width="4.5" height="16" rx="1.5" fill="#EF4444" />
  </svg>
);

export const CodeChefIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5.13z" />
    <line x1="6" y1="17" x2="18" y2="17" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
  </svg>
);
