import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';

interface StatisticsPerformanceProps {
  compareEnabled: boolean;
}

// Sample performance data
const efficiencyData = [
  { hour: '6AM', orders: 12, avgTime: 18, efficiency: 85 },
  { hour: '8AM', orders: 28, avgTime: 22, efficiency: 78 },
  { hour: '10AM', orders: 45, avgTime: 25, efficiency: 72 },
  { hour: '12PM', orders: 89, avgTime: 28, efficiency: 68 },
  { hour: '2PM', orders: 67, avgTime: 24, efficiency: 75 },
  { hour: '4PM', orders: 52, avgTime: 21, efficiency: 80 },
  { hour: '6PM', orders: 94, avgTime: 31, efficiency: 65 },
  { hour: '8PM', orders: 76, avgTime: 26, efficiency: 70 },
  { hour: '10PM', orders: 34, avgTime: 19, efficiency: 83 }
];

const tableTurnoverData = [
  { table: 'T1', turnover: 4.2, avgTime: 45, efficiency: 88 },
  { table: 'T2', turnover: 3.8, avgTime: 52, efficiency: 82 },
  { table: 'T3', turnover: 4.5, avgTime: 41, efficiency: 92 },
  { table: 'T4', turnover: 3.6, avgTime: 58, efficiency: 78 },
  { table: 'T5', turnover: 4.1, avgTime: 47, efficiency: 85 },
  { table: 'T6', turnover: 3.9, avgTime: 51, efficiency: 80 }
];

const performanceMetrics = [
  { metric: 'Speed', value: 85, target: 90, color: '#5B47FF' },
  { metric: 'Quality', value: 92, target: 88, color: '#7B6CFF' },
  { metric: 'Efficiency', value: 78, target: 85, color: '#9CA3FF' },
  { metric: 'Accuracy', value: 96, target: 95, color: '#B8B5FF' },
  { metric: 'Satisfaction', value: 88, target: 90, color: '#5B47FF' }
];

const PerformanceMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  status = 'normal'
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: any;
  status?: 'normal' | 'good' | 'warning';
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5B47FF]/20 to-[#7B6CFF]/20 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#5B47FF]" />
          </div>
          <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
            {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StatisticsPerformance({ compareEnabled }: StatisticsPerformanceProps) {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PerformanceMetricCard
          title="Order Efficiency"
          value="78.5%"
          change="+5.2%"
          changeType="up"
          icon={Target}
          status="good"
        />
        
        <PerformanceMetricCard
          title="Avg Prep Time"
          value="24.3 min"
          change="-8.1%"
          changeType="down"
          icon={Clock}
          status="good"
        />
        
        <PerformanceMetricCard
          title="Table Turnover"
          value="3.8x"
          change="+12.3%"
          changeType="up"
          icon={Users}
          status="good"
        />
        
        <PerformanceMetricCard
          title="Customer Rating"
          value="4.6/5"
          change="+0.3"
          changeType="up"
          icon={Activity}
          status="good"
        />
      </div>

      {/* Efficiency Trends */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Hourly Performance Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData}>
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B47FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B47FF" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#5B47FF" 
                  strokeWidth={3}
                  fill="url(#efficiencyGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Table Performance */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5B47FF]" />
              Table Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="table" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="turnover" 
                    fill="#5B47FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#5B47FF]" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="metric" stroke="#6B7280" />
                  <PolarRadiusAxis stroke="#6B7280" />
                  <Radar
                    name="Current"
                    dataKey="value"
                    stroke="#5B47FF"
                    fill="#5B47FF"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#EF4444"
                    fill="none"
                    strokeDasharray="5 5"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#5B47FF]" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Insights */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Insights</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Peak Efficiency: 12PM-2PM</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Best performance during lunch rush</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Dinner Rush Challenge</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">6PM-8PM needs optimization</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Table T3 Leading</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">4.5x turnover rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Targets */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Targets</h4>
              <div className="space-y-3">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-[#5B47FF]">{metric.value}%</span>
                      <span className="text-sm text-gray-500">/ {metric.target}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
