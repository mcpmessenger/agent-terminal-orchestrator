import { cn } from '@/lib/utils';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Wraps any element in a 1-px rainbow gradient that animates on hover.
export default function GlowWrapper({ children, className, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'group rounded-lg bg-gradient-to-r from-fuchsia-500 via-blue-500 to-emerald-400 p-px',
        className
      )}
    >
      {children}
    </div>
  );
} 