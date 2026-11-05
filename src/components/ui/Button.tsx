'use client';

import React from 'react';
import { sound } from '@/lib/sound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'mint' | 'violet' | 'amber' | 'sky' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    if (onClick) onClick(e);
  };

  const variantStyles = {
    default: 'bg-[#1e222b] text-white border-[#383e4d] hover:border-white',
    mint: 'bg-[#6ee7b7] text-[#0c0d11] border-[#0c0d11] font-bold hover:bg-[#86efac]',
    violet: 'bg-[#c4b5fd] text-[#0c0d11] border-[#0c0d11] font-bold hover:bg-[#ddd6fe]',
    amber: 'bg-[#fde047] text-[#0c0d11] border-[#0c0d11] font-bold hover:bg-[#fef08a]',
    sky: 'bg-[#93c5fd] text-[#0c0d11] border-[#0c0d11] font-bold hover:bg-[#bfdbfe]',
    danger: 'bg-[#ef4444] text-white border-[#7f1d1d] hover:bg-[#dc2626]',
    outline: 'bg-transparent text-gray-300 border-[#2d323d] hover:border-gray-400 hover:text-white',
    ghost: 'bg-transparent text-gray-400 border-transparent shadow-none hover:bg-[#1a1d24] hover:text-white',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-5 py-3 rounded-xl font-bold',
  }[size];

  return (
    <button
      onClick={handleClick}
      className={`brutal-btn ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
