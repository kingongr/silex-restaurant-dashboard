import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  Clock,
  Activity,
  PieChart
} from 'lucide-react';

interface StatisticsOverviewProps {
  compareEnabled: boolean;
}

// Sample data for charts
const revenueData = [
  { day: 'Mon', revenue: 2400, forecast: 2600 },
  { day: 'Tue', revenue: 1398, forecast: 1500 },
  { day: 'Wed', revenue: 9800, forecast: 10200 },
  { day: 'Thu', revenue: 3908, forecast: 4100 },
  { day: 'Fri', revenue: 4800, forecast: 5000 },
  { day: 'Sat', revenue: 3800, forecast: 4200 },
  { day: 'Sun', revenue: 4300, forecast: 4600 }
];

const orderMixData = [
  { name: 'Dine-in', value: 45, color: '#5B47FF' },
  { name: 'Pickup', value: 35, color: '#7B6CFF' },
  { name: 'Delivery', value: 20, color: '#9CA3FF' }
];

const sparklineData = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, { value: 700 }, { value: 900 }, { value: 1100 }
];

const KPICard = ({ 
  title, 
  value, 
  delta, 
  deltaType, 
  icon: Icon, 
  showSparkline = false,
  compareEnabled 
}: {
  title: string;
  value: string;
  delta: string;
  deltaType: 'up' | 'down' | 'neutral';
  icon: any;
  showSparkline?: boolean;
  compareEnabled: boolean;
}) => {
  const getDeltaColor = () => {
    switch (deltaType) {
      case 'up': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'down': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getDeltaIcon = () => {
    switch (deltaType) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5B47FF]/20 to-[#7B6CFF]/20 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#5B47FF]" />
          </div>
          {compareEnabled && (
            <Badge className={`${getDeltaColor()} border-0 flex items-center gap-1`}>
              {getDeltaIcon()}
              {delta}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>

        {showSparkline && (
          <div className="mt-4 h-12">
            {/* Simple sparkline representation */}
            <div className="flex items-end justify-between h-full">
              {sparklineData.map((point, index) => (
                <div
                  key={index}
                  className="w-1 bg-gradient-to-t from-[#5B47FF] to-[#7B6CFF] rounded-full"
                  style={{ height: `${(point.value / 1100) * 100}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function StatisticsOverview({ compareEnabled }: StatisticsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value="$84,247"
          delta="+12.5%"
          deltaType="up"
          icon={DollarSign}
          showSparkline={true}
          compareEnabled={compareEnabled}
        />
        
        <KPICard
          title="Total Orders"
          value="1,247"
          delta="+8.3%"
          deltaType="up"
          icon={ShoppingCart}
          compareEnabled={compareEnabled}
        />
        
        <KPICard
          title="Average Order Value"
          value="$67.58"
          delta="-2.1%"
          deltaType="down"
          icon={Activity}
          compareEnabled={compareEnabled}
        />
        
        <KPICard
          title="Customer Satisfaction"
          value="4.8/5"
          delta="+0.2"
          deltaType="up"
          icon={Star}
          compareEnabled={compareEnabled}
        />
      </div>

      {/* Revenue Trends Chart */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#5B47FF]/20 to-[#7B6CFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#5B47FF]" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Revenue Chart</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">30-day revenue trend analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Mix and Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Mix */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#5B47FF]" />
              Order Mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderMixData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-lg font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5B47FF]" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-8 h-8 text-[#5B47FF] mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Peak Hours Heatmap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

