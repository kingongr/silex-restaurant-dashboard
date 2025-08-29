import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface StatisticsReservationsProps {
  compareEnabled: boolean;
}

// Sample reservation data
const reservationTrends = [
  { month: 'Jan', bookings: 156, noShows: 8, cancellations: 12 },
  { month: 'Feb', bookings: 142, noShows: 6, cancellations: 10 },
  { month: 'Mar', bookings: 168, noShows: 9, cancellations: 15 },
  { month: 'Apr', bookings: 175, noShows: 7, cancellations: 13 },
  { month: 'May', bookings: 172, noShows: 8, cancellations: 11 },
  { month: 'Jun', bookings: 189, noShows: 10, cancellations: 14 },
  { month: 'Jul', bookings: 210, noShows: 12, cancellations: 18 },
  { month: 'Aug', bookings: 218, noShows: 11, cancellations: 16 }
];

const weeklyPattern = [
  { day: 'Mon', bookings: 28, avgParty: 3.2, peakTime: '7PM' },
  { day: 'Tue', bookings: 32, avgParty: 3.4, peakTime: '7PM' },
  { day: 'Wed', bookings: 45, avgParty: 3.1, peakTime: '8PM' },
  { day: 'Thu', bookings: 52, avgParty: 3.6, peakTime: '8PM' },
  { day: 'Fri', bookings: 78, avgParty: 4.2, peakTime: '7PM' },
  { day: 'Sat', bookings: 89, avgParty: 4.8, peakTime: '8PM' },
  { day: 'Sun', bookings: 65, avgParty: 3.9, peakTime: '6PM' }
];

const partySizeDistribution = [
  { size: '2 people', count: 45, percentage: 25 },
  { size: '3-4 people', count: 72, percentage: 40 },
  { size: '5-6 people', count: 36, percentage: 20 },
  { size: '7+ people', count: 27, percentage: 15 }
];

const ReservationMetricCard = ({ 
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

export default function StatisticsReservations({ compareEnabled }: StatisticsReservationsProps) {
  return (
    <div className="space-y-6">
      {/* Reservation Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ReservationMetricCard
          title="Total Bookings"
          value="1,330"
          change="+15.2%"
          changeType="up"
          icon={Calendar}
          status="good"
        />
        
        <ReservationMetricCard
          title="Avg Party Size"
          value="3.6"
          change="+8.3%"
          changeType="up"
          icon={Users}
          status="good"
        />
        
        <ReservationMetricCard
          title="No-Show Rate"
          value="5.2%"
          change="-12.1%"
          changeType="down"
          icon={AlertTriangle}
          status="good"
        />
        
        <ReservationMetricCard
          title="Cancellation Rate"
          value="8.7%"
          change="-5.3%"
          changeType="down"
          icon={Clock}
          status="good"
        />
      </div>

      {/* Reservation Trends */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5B47FF]" />
            Monthly Reservation Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reservationTrends}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="bookings" 
                  stroke="#5B47FF" 
                  strokeWidth={3}
                  fill="url(#bookingsGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="noShows" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cancellations" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Patterns & Party Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Pattern */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5B47FF]" />
              Weekly Booking Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPattern}>
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
                    dataKey="bookings" 
                    fill="#5B47FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">Peak Day</p>
                <p className="text-[#5B47FF] font-semibold">Saturday</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">Peak Time</p>
                <p className="text-[#5B47FF] font-semibold">8:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Party Size Distribution */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5B47FF]" />
              Party Size Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={partySizeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {partySizeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#5B47FF', '#7B6CFF', '#9CA3FF', '#B8B5FF'][index]} />
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
              {partySizeDistribution.map((party, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{party.size}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#5B47FF] font-semibold">{party.percentage}%</span>
                    <span className="text-gray-500">({party.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservation Insights */}
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#5B47FF]" />
            Reservation Insights & Recommendations
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
                    <p className="font-medium text-green-800 dark:text-green-200">Weekend Dominance</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Friday-Sunday account for 65% of bookings</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Growing Demand</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">15.2% increase in total bookings</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">No-Show Improvement</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">12.1% reduction in no-shows</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[#5B47FF]/5 rounded-lg border border-[#5B47FF]/20">
                  <p className="font-medium text-[#5B47FF] mb-1">Optimize Weekend Capacity</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consider adding more tables for weekend service</p>
                </div>
                
                <div className="p-3 bg-[#5B47FF]/5 rounded-lg border border-[#5B47FF]/20">
                  <p className="font-medium text-[#5B47FF] mb-1">Party Size Management</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Focus on 3-4 person tables (40% of bookings)</p>
                </div>
                
                <div className="p-3 bg-[#5B47FF]/5 rounded-lg border border-[#5B47FF]/20">
                  <p className="font-medium text-[#5B47FF] mb-1">Peak Time Preparation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Staff up for 7-8 PM rush hours</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
