'use client';

import React from 'react';

interface BadgeProps {
  color?: string; // hex or bg class
  children: React.ReactNode;
  className?: string;
  variant?: 'craftsman' | 'velocity' | 'amber' | 'neutral' | 'pink' | 'sky';
}

export const Badge: React.FC<BadgeProps> = ({
  color,
  children,
  className = '',
  variant = 'neutral',
}) => {
  const variantStyles = {
    craftsman: 'bg-[#6ee7b7]/15 text-[#6ee7b7] border-[#6ee7b7]/40',
    velocity: 'bg-[#c4b5fd]/15 text-[#c4b5fd] border-[#c4b5fd]/40',
    amber: 'bg-[#fde047]/15 text-[#fde047] border-[#fde047]/40',
    neutral: 'bg-[#1e222b] text-gray-300 border-[#2d323d]',
    pink: 'bg-[#f472b6]/15 text-[#f472b6] border-[#f472b6]/40',
    sky: 'bg-[#93c5fd]/15 text-[#93c5fd] border-[#93c5fd]/40',
  }[variant];

  return (
    <span
      className={`brutal-badge font-mono ${variantStyles} ${className}`}
      style={color ? { backgroundColor: `${color}20`, color: color, borderColor: `${color}60` } : undefined}
    >
      {children}
    </span>
  );
};

