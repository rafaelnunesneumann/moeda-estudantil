import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { AnimatedSection } from './AnimatedSection';

interface SectionHeaderProps {
  badge?: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <AnimatedSection className={cn('text-center mb-16', className)}>
      {badge && (
        <span
          className={cn(
            'inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4',
            light
              ? 'bg-white/15 text-white border border-white/20'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100',
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4',
          light ? 'text-white' : 'text-slate-900',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-lg max-w-2xl mx-auto leading-relaxed',
            light ? 'text-slate-300' : 'text-slate-500',
          )}
        >
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}
