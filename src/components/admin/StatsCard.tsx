import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="text-primary" size={20} />
        </div>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium px-2 py-1 rounded',
              trend.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            )}
          >
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
    </div>
  );
};

export default StatsCard;
