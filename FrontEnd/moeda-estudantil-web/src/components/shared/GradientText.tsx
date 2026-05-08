import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'indigo' | 'amber' | 'violet';
}

const variants = {
  indigo: 'from-indigo-500 to-violet-500',
  amber: 'from-amber-400 to-amber-600',
  violet: 'from-violet-400 to-purple-600',
};

export function GradientText({
  children,
  className,
  variant = 'indigo',
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
