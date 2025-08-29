import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatisticsRevenueProps {
  compareEnabled: boolean;
}

// Sample revenue data
const revenueData = [
  { month: 'Jan', revenue: 12500, orders: 156, avgOrder: 80.1 },
  { month: 'Feb', revenue: 11800, orders: 142, avgOrder: 83.1 },
  { month: 'Mar', revenue: 13200, orders: 168, avgOrder: 78.6 },
  { month: 'Apr', revenue: 14100, orders: 175, avgOrder: 80.6 },
  { month: 'May', revenue: 13800, orders: 172, avgOrder: 80.2 },
  { month: 'Jun', revenue: 15200, orders: 189, avgOrder: 80.4 },
  { month: 'Jul', revenue: 16800, orders: 210, avgOrder: 80.0 },
  { month: 'Aug', revenue: 17500, orders: 218, avgOrder: 80.3 }
];

const revenueByCategory = [
  { name: 'Main Courses', value: 45, color: '#5B47FF' },
  { name: 'Appetizers', value: 25, color: '#7B6CFF' },
  { name: 'Desserts', value: 20, color: '#9CA3FF' },
  { name: 'Beverages', value: 10, color: '#B8B5FF' }
];

const dailyRevenue = [
  { day: 'Mon', revenue: 2400, orders: 30 },
  { day: 'Tue', revenue: 1398, orders: 18 },
  { day: 'Wed', revenue: 9800, orders: 122 },
  { day: 'Thu', revenue: 3908, orders: 49 },
  { day: 'Fri', revenue: 4800, orders: 60 },
  { day: 'Sat', revenue: 3800, orders: 48 },
  { day: 'Sun', revenue: 4300, orders: 54 }
];

const RevenueMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon 
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: any;
}) => (
  <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-[#5B47FF]/20 to-[#7B6CFF]/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#5B47FF]" />
        </div>
        <Badge className={`flex items-center gap-1 ${
          changeType === 'up' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }`}>
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

export default function StatisticsRevenue({ compareEnabled }: StatisticsRevenueProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueMetricCard
          title="Total Revenue"
          value="$140,900"
          change="+12.5%"
          changeType="up"
          icon={DollarSign}
        />
        
        <RevenueMetricCard
          title="Monthly Average"
          value="$17,613"
          change="+8.3%"
          changeType="up"
          icon={Calendar}
        />
        
        <RevenueMetricCard
          title="Total Orders"
          value="1,330"
          change="+15.2%"
          changeType="up"
          icon={ShoppingCart}
        />
        
        <RevenueMetricCard
          title="Avg Order Value"
          value="$80.23"
          change="-2.1%"
          changeType="down"
          icon={Users}
        />
      </div>

      {/* Revenue Trends Chart */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Revenue Trends (8 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B47FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B47FF" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
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
                  dataKey="revenue" 
                  stroke="#5B47FF" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Category */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#5B47FF]" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {revenueByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Revenue Pattern */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5B47FF]" />
              Weekly Revenue Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#revenueGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Insights */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Revenue Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg">
              <div className="text-2xl font-bold text-[#5B47FF] mb-2">Wednesday</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Peak Revenue Day</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">$9,800</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg">
              <div className="text-2xl font-bold text-[#5B47FF] mb-2">July</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">$16,800</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg">
              <div className="text-2xl font-bold text-[#5B47FF] mb-2">$80.23</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">+2.3% vs LY</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
