import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Utensils, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  DollarSign,
  ChefHat,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface StatisticsMenuAnalysisProps {
  compareEnabled: boolean;
}

// Sample menu performance data
const topItems = [
  { name: 'Grilled Salmon', orders: 89, revenue: 1247, margin: 68, rating: 4.8, trend: '+15%' },
  { name: 'Ribeye Steak', orders: 76, revenue: 2128, margin: 72, rating: 4.9, trend: '+8%' },
  { name: 'Caesar Salad', orders: 124, revenue: 868, margin: 75, rating: 4.6, trend: '+22%' },
  { name: 'Chocolate Cake', orders: 67, revenue: 469, margin: 80, rating: 4.7, trend: '+5%' },
  { name: 'Pasta Carbonara', orders: 92, revenue: 1012, margin: 70, rating: 4.5, trend: '+12%' }
];

const categoryPerformance = [
  { category: 'Main Courses', orders: 45, revenue: 58, margin: 70, growth: '+18%' },
  { category: 'Appetizers', orders: 25, revenue: 22, margin: 75, growth: '+12%' },
  { category: 'Desserts', orders: 20, revenue: 15, margin: 80, growth: '+8%' },
  { category: 'Beverages', orders: 10, revenue: 5, margin: 85, growth: '+5%' }
];

const menuTrends = [
  { month: 'Jan', totalOrders: 156, avgRating: 4.6, avgPrepTime: 22 },
  { month: 'Feb', totalOrders: 142, avgRating: 4.7, avgPrepTime: 21 },
  { month: 'Mar', totalOrders: 168, avgRating: 4.8, avgPrepTime: 20 },
  { month: 'Apr', totalOrders: 175, avgRating: 4.7, avgPrepTime: 21 },
  { month: 'May', totalOrders: 172, avgRating: 4.8, avgPrepTime: 20 },
  { month: 'Jun', totalOrders: 189, avgRating: 4.9, avgPrepTime: 19 },
  { month: 'Jul', totalOrders: 210, avgRating: 4.8, avgPrepTime: 20 },
  { month: 'Aug', totalOrders: 218, avgRating: 4.9, avgPrepTime: 19 }
];

const MenuMetricCard = ({ 
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

export default function StatisticsMenuAnalysis({ compareEnabled }: StatisticsMenuAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Menu Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MenuMetricCard
          title="Total Menu Items"
          value="47"
          change="+3"
          changeType="up"
          icon={Utensils}
          status="good"
        />
        
        <MenuMetricCard
          title="Avg Rating"
          value="4.8/5"
          change="+0.2"
          changeType="up"
          icon={Star}
          status="good"
        />
        
        <MenuMetricCard
          title="Avg Prep Time"
          value="20.3 min"
          change="-8.1%"
          changeType="down"
          icon={Clock}
          status="good"
        />
        
        <MenuMetricCard
          title="Menu Margin"
          value="72.5%"
          change="+2.3%"
          changeType="up"
          icon={DollarSign}
          status="good"
        />
      </div>

      {/* Top Performing Items */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#5B47FF]" />
            Top Performing Menu Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{item.orders} orders</span>
                      <span>⭐ {item.rating}</span>
                      <span>{item.margin}% margin</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${item.revenue}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  </div>
                  <Badge className={`${
                    item.trend.startsWith('+') 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {item.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu Trends */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Menu Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={menuTrends}>
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B47FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B47FF" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis yAxisId="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#EF4444" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="totalOrders" 
                  stroke="#5B47FF" 
                  strokeWidth={3}
                  fill="url(#ordersGradient)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgRating" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgPrepTime" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance & Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#5B47FF]" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#5B47FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{category.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.orders}% of orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#5B47FF]">{category.growth}</p>
                    <p className="text-sm text-gray-500">{category.margin}% margin</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Menu Insights */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#5B47FF]" />
              Menu Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Main Courses Lead</p>
                  <p className="text-sm text-green-600 dark:text-green-400">45% of orders, highest revenue</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Quality Improvement</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Avg rating increased to 4.8/5</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Prep Time Optimization</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">8.1% reduction in prep time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">Margin Growth</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">2.3% increase in overall margin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Recommendations */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5B47FF]" />
            Menu Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Expand Main Courses</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">High demand and margin, consider seasonal additions</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Optimize Appetizers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Good margin potential, focus on quick prep items</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Dessert Innovation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Highest margin category, room for premium items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
