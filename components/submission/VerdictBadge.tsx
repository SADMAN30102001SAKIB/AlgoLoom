'use client';

import { CheckCircle2, XCircle, Clock, HardDrive, AlertTriangle, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VerdictBadgeProps {
  verdict: string;
  className?: string;
}

export function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
  const verdictConfig = {
    ACCEPTED: {
      label: 'Accepted',
      icon: CheckCircle2,
      className: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    WRONG_ANSWER: {
      label: 'Wrong Answer',
      icon: XCircle,
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    TIME_LIMIT_EXCEEDED: {
      label: 'Time Limit Exceeded',
      icon: Clock,
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    MEMORY_LIMIT_EXCEEDED: {
      label: 'Memory Limit Exceeded',
      icon: HardDrive,
      className: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    RUNTIME_ERROR: {
      label: 'Runtime Error',
      icon: AlertTriangle,
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    COMPILATION_ERROR: {
      label: 'Compilation Error',
      icon: Code,
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    PENDING: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
  };

  const config =
    verdictConfig[verdict as keyof typeof verdictConfig] || verdictConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1.5 font-medium', config.className, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
