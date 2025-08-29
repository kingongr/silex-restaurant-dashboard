import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function FloatingActionButton({ 
  children, 
  onClick, 
  className,
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6', 
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed w-14 h-14 aurora-gradient rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-30 flex items-center justify-center lg:hidden",
        positionClasses[position],
        className
      )}
    >
      {children}
    </button>
  );
}
