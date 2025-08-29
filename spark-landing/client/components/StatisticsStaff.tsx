import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  DollarSign,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Award
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface StatisticsStaffProps {
  compareEnabled: boolean;
}

// Sample staff performance data
const staffPerformance = [
  { name: 'Alice Johnson', role: 'Server', orders: 45, rating: 4.9, efficiency: 92, revenue: 2847 },
  { name: 'Bob Smith', role: 'Server', orders: 38, rating: 4.7, efficiency: 88, revenue: 2412 },
  { name: 'Carol Davis', role: 'Server', orders: 42, rating: 4.8, efficiency: 90, revenue: 2658 },
  { name: 'David Wilson', role: 'Bartender', orders: 28, rating: 4.6, efficiency: 85, revenue: 1890 },
  { name: 'Emma Brown', role: 'Host', orders: 0, rating: 4.8, efficiency: 95, revenue: 0 },
  { name: 'Frank Miller', role: 'Kitchen', orders: 0, rating: 4.7, efficiency: 89, revenue: 0 }
];

const roleDistribution = [
  { role: 'Servers', count: 8, percentage: 40, avgRating: 4.8 },
  { role: 'Kitchen Staff', count: 6, percentage: 30, avgRating: 4.7 },
  { role: 'Bartenders', count: 3, percentage: 15, avgRating: 4.6 },
  { role: 'Hosts', count: 2, percentage: 10, avgRating: 4.8 },
  { role: 'Management', count: 1, percentage: 5, avgRating: 4.9 }
];

const staffTrends = [
  { month: 'Jan', avgRating: 4.6, avgEfficiency: 85, totalOrders: 156 },
  { month: 'Feb', avgRating: 4.7, avgEfficiency: 87, totalOrders: 142 },
  { month: 'Mar', avgRating: 4.7, avgEfficiency: 88, totalOrders: 168 },
  { month: 'Apr', avgRating: 4.8, avgEfficiency: 89, totalOrders: 175 },
  { month: 'May', avgRating: 4.8, avgEfficiency: 90, totalOrders: 172 },
  { month: 'Jun', avgRating: 4.8, avgEfficiency: 91, totalOrders: 189 },
  { month: 'Jul', avgRating: 4.9, avgEfficiency: 92, totalOrders: 210 },
  { month: 'Aug', avgRating: 4.9, avgEfficiency: 93, totalOrders: 218 }
];

const StaffMetricCard = ({ 
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

export default function StatisticsStaff({ compareEnabled }: StatisticsStaffProps) {
  return (
    <div className="space-y-6">
      {/* Staff Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaffMetricCard
          title="Total Staff"
          value="20"
          change="+2"
          changeType="up"
          icon={Users}
          status="good"
        />
        
        <StaffMetricCard
          title="Avg Rating"
          value="4.8/5"
          change="+0.2"
          changeType="up"
          icon={Star}
          status="good"
        />
        
        <StaffMetricCard
          title="Avg Efficiency"
          value="91.5%"
          change="+6.5%"
          changeType="up"
          icon={Activity}
          status="good"
        />
        
        <StaffMetricCard
          title="Total Orders"
          value="1,330"
          change="+15.2%"
          changeType="up"
          icon={DollarSign}
          status="good"
        />
      </div>

      {/* Top Performing Staff */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#5B47FF]" />
            Top Performing Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformance.slice(0, 5).map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{staff.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{staff.role}</span>
                      <span>⭐ {staff.rating}</span>
                      <span>{staff.efficiency}% efficiency</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {staff.orders > 0 ? `${staff.orders} orders` : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {staff.revenue > 0 ? `$${staff.revenue}` : 'Support role'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Trends */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Staff Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={staffTrends}>
                <defs>
                  <linearGradient id="staffGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="avgEfficiency" 
                  stroke="#5B47FF" 
                  strokeWidth={3}
                  fill="url(#staffGradient)"
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
                  dataKey="totalOrders" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution & Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Role Distribution */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5B47FF]" />
              Staff Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {roleDistribution.map((role, index) => (
                      <Cell key={`cell-${index}`} fill={['#5B47FF', '#7B6CFF', '#9CA3FF', '#B8B5FF', '#5B47FF'][index]} />
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
            <div className="mt-4 space-y-3">
              {roleDistribution.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{role.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{role.count} staff members</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#5B47FF] font-semibold">{role.percentage}%</span>
                    <p className="text-sm text-gray-500">⭐ {role.avgRating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Insights */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#5B47FF]" />
              Staff Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">High Performance</p>
                  <p className="text-sm text-green-600 dark:text-green-400">91.5% average efficiency</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Growing Team</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Added 2 new staff members</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Training Opportunity</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Focus on efficiency improvement</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">Customer Satisfaction</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">4.8/5 average rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Recommendations */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#5B47FF]" />
            Staff Development Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Performance Training</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Focus on efficiency improvement for lower-performing staff</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Recognition Program</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Implement rewards for top performers like Alice Johnson</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 rounded-lg border border-[#5B47FF]/20">
              <h4 className="font-semibold text-[#5B47FF] mb-2">Role Optimization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consider cross-training for flexible staff deployment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
