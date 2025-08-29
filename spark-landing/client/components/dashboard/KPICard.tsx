import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  className 
}: KPICardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-lg p-6 hover-lift group cursor-pointer",
        "hover:aurora-gradient-subtle transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-body-small text-muted-foreground font-medium mb-1">
            {title}
          </p>
          <p className="text-heading-2 font-bold text-foreground mb-2">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'positive' && (
                <TrendingUp className="w-4 h-4 text-green-600" />
              )}
              {changeType === 'negative' && (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={cn(
                  "text-body-small font-medium",
                  changeType === 'positive' && "text-green-600",
                  changeType === 'negative' && "text-red-600",
                  changeType === 'neutral' && "text-muted-foreground"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        
        <div className="w-12 h-12 aurora-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
