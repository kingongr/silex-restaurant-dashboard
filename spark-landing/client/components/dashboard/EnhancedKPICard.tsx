import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface EnhancedKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    type: 'up' | 'down';
    color: string;
  };
  className?: string;
  size?: 'default' | 'large';
  layout?: 'horizontal' | 'vertical';
}

export default function EnhancedKPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  iconBg, 
  trend, 
  className = '',
  size = 'default',
  layout = 'vertical'
}: EnhancedKPICardProps) {
  // Helper function to format numbers with X,XXX.xx format
  const formatNumber = (num: number, includeDecimals: boolean = true): string => {
    if (includeDecimals) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return num.toLocaleString('en-US');
  };

  // Helper function to format the complete value with prefix/suffix
  const formatValue = (num: number, originalValue: string): string => {
    const hasPercentage = originalValue.includes('%');
    const hasCurrency = originalValue.includes('$');
    
    if (hasCurrency) {
      return '$' + formatNumber(num);
    } else if (hasPercentage) {
      return formatNumber(num, false) + '%';
    } else {
      // For regular numbers, check if the original value had decimals
      const originalNum = parseFloat(originalValue);
      const hasDecimals = originalValue.includes('.') || originalNum !== Math.floor(originalNum);
      return formatNumber(num, hasDecimals);
    }
  };

  // Helper function to get the formatted static value
  const getFormattedStaticValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return formatNumber(val);
    }
    
    const stringValue = val.toString();
    const numericMatch = stringValue.match(/[\d,.]+/);
    
    if (numericMatch) {
      const numericValue = parseFloat(stringValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericValue)) {
        return formatValue(numericValue, stringValue);
      }
    }
    
    return stringValue;
  };

  const isLarge = size === 'large';
  const isHorizontal = layout === 'horizontal';

  if (isHorizontal) {
    return (
      <div className={`bg-white dark:bg-[#1B2030] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'} text-gray-900 dark:text-white`}>
                {getFormattedStaticValue(value)}
              </span>
              {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend.color}`}>
                  {trend.type === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {trend.value}
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-[#1B2030] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend.color}`}>
            {trend.type === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
        <div className="mb-2">
          <span className={`font-bold ${isLarge ? 'text-3xl' : 'text-2xl'} text-gray-900 dark:text-white`}>
            {getFormattedStaticValue(value)}
          </span>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
