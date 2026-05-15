'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, gradient, iconBg, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity',
          gradient,
        )}
      />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-sm', iconBg)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
          gradient,
        )}
      />
    </motion.div>
  );
}
