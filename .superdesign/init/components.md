# Shared UI Components

## Button
- Path: `src/components/ui/Button.tsx`
- Description: Neo-Brutalist tactile button with spring physics, active offset press, and sound effects.
- Props: `variant?: 'default' | 'mint' | 'violet' | 'amber' | 'sky' | 'ghost' | 'outline' | 'danger'`, `size?: 'sm' | 'md' | 'lg'`

```tsx
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
```

## Badge
- Path: `src/components/ui/Badge.tsx`
- Description: Neo-Brutalist pill badge with solid outlines and color variants.
- Props: `color?: string`, `variant?: 'craftsman' | 'velocity' | 'amber' | 'neutral' | 'pink' | 'sky'`

```tsx
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
```

## Modal
- Path: `src/components/ui/Modal.tsx`
- Description: Neo-brutalist modal dialog with Framer Motion spring physics and escape key listeners.
- Props: `isOpen: boolean`, `onClose: () => void`, `title?: string`, `maxWidth?: string`

```tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { sound } from '@/lib/sound';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} brutal-card bg-[#14161c] border-2 border-[#383e4d] p-6 shadow-[6px_6px_0px_#000000] z-10 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#2d323d]">
              {title && (
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  {title}
                </h3>
              )}
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f232b] transition-colors ml-auto"
              >
                <X size={20} />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

