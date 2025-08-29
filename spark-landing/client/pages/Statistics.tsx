// DashboardLayout removed - already wrapped by App.tsx routing
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useScrollY } from '@/hooks/useScrollY';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  DollarSign,
  Users,
  ShoppingCart,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  ChefHat,
  Utensils,
  MapPin,
  PieChart,
  Activity,
  Zap,
  Plus,
  Database,
  ChevronUp,
  ChevronDown,
  Star,
  Bell
} from 'lucide-react';

// Import statistics components
import StatisticsOverview from '../components/StatisticsOverview';
import StatisticsRevenue from '../components/StatisticsRevenue';
import StatisticsPerformance from '../components/StatisticsPerformance';
import StatisticsReservations from '../components/StatisticsReservations';
import StatisticsMenuAnalysis from '../components/StatisticsMenuAnalysis';
import StatisticsStaff from '../components/StatisticsStaff';

export default function Statistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  
  // Filter states
  const [orderTypeFilter, setOrderTypeFilter] = useState<string | null>(null);
  const [daypartFilter, setDaypartFilter] = useState<string | null>(null);
  
  // Scroll behavior for floating notification bell
  const bellRef = useRef<HTMLDivElement>(null);
  const { scrollY, getAdaptiveScrollTransform } = useScrollY();
  
  // Dynamic data based on period and filters
  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'custom': return 'Custom Range';
      default: return 'This Month';
    }
  };

  const getPeriodComparison = (period: string) => {
    switch (period) {
      case 'today': return 'vs yesterday';
      case 'week': return 'vs last week';
      case 'month': return 'vs last month';
      case 'year': return 'vs last year';
      case 'custom': return 'vs previous period';
      default: return 'vs last month';
    }
  };

  // Mock notifications data for statistics
  const mockStatisticsNotifications = [
    {
      id: '1',
      type: 'performance_alert',
      title: 'Performance Alert 📊',
      message: 'Your restaurant efficiency has improved by 8% this month. Great job team!',
      time: '2 hours ago',
      isRead: false,
      priority: 'low'
    },
    {
      id: '2',
      type: 'revenue_milestone',
      title: 'Revenue Milestone! 🎉',
      message: 'Congratulations! You\'ve reached $45K monthly revenue for the first time.',
      time: '1 day ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'trend_analysis',
      title: 'Trend Analysis 📈',
      message: 'Weekend orders are up 22% compared to last month. Consider increasing weekend staff.',
      time: '3 days ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'customer_feedback',
      title: 'Customer Feedback Update ⭐',
      message: 'Average customer rating improved to 4.8/5. Keep up the excellent service!',
      time: '1 week ago',
      isRead: true,
      priority: 'low'
    }
  ];

  const unreadCount = mockStatisticsNotifications.filter(n => !n.isRead).length;

  // Comprehensive data structure that updates based on period and filters
  const getInsightsData = () => {
    const baseData: Record<string, Record<string, { value: string; growth: number; period: string }>> = {
      overview: {
        totalRevenue: { value: '$45.2K', growth: 18, period: selectedPeriod },
        totalOrders: { value: '1,247', growth: 12, period: selectedPeriod },
        customerRating: { value: '4.8/5', growth: 5, period: selectedPeriod }
      },
      revenue: {
        monthlyRevenue: { value: '$45.2K', growth: 18, period: selectedPeriod },
        avgOrderValue: { value: '$36.30', growth: 8, period: selectedPeriod },
        topCategory: { value: 'Main Course', growth: 22, period: selectedPeriod },
        peakHours: { value: '7-9 PM', growth: 15, period: selectedPeriod }
      },
      performance: {
        tableTurnover: { value: '2.3x', growth: 15, period: selectedPeriod },
        efficiency: { value: '87%', growth: 8, period: selectedPeriod },
        avgServiceTime: { value: '18 min', growth: -12, period: selectedPeriod }
      },
      reservations: {
        todaysBookings: { value: '47', growth: 22, period: selectedPeriod },
        capacity: { value: '78%', growth: 8, period: selectedPeriod },
        avgPartySize: { value: '3.2', growth: 5, period: selectedPeriod },
        peakDay: { value: 'Saturday', growth: 18, period: selectedPeriod }
      },
      menu: {
        topItem: { value: 'Grilled Salmon', growth: 15, period: selectedPeriod },
        totalItems: { value: '89', growth: 8, period: selectedPeriod },
        categories: { value: '12', growth: 3, period: selectedPeriod }
      },
      staff: {
        activeStaff: { value: '12', growth: 14, period: selectedPeriod },
        avgRating: { value: '4.7/5', growth: 6, period: selectedPeriod },
        productivity: { value: '92%', growth: 11, period: selectedPeriod }
      }
    };

    // Apply filters if they exist
    if (orderTypeFilter || daypartFilter) {
      // In a real implementation, this would filter data from the database
      // For now, we'll simulate filter effects
      const filterMultiplier = (orderTypeFilter && daypartFilter) ? 1.2 : 1.1;
      
      Object.keys(baseData).forEach(section => {
        Object.keys(baseData[section as keyof typeof baseData]).forEach(metric => {
          const metricData = baseData[section as keyof typeof baseData][metric as keyof typeof baseData[typeof section]];
          if (typeof metricData.growth === 'number') {
            metricData.growth = Math.round(metricData.growth * filterMultiplier);
          }
        });
      });
    }

    return baseData;
  };

  const insightsData = getInsightsData();

  // Log data changes for debugging (would be replaced with database calls)
  useEffect(() => {
    console.log('Data updated:', {
      period: selectedPeriod,
      filters: { orderTypeFilter, daypartFilter },
      insightsData
    });
    
    // In a real implementation, this would trigger:
    // 1. Database queries with new period and filters
    // 2. API calls to fetch updated statistics
    // 3. Real-time data updates
    // 4. Cache invalidation and refresh
  }, [selectedPeriod, orderTypeFilter, daypartFilter, insightsData]);

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format.toUpperCase()}`);
    // Export functionality would be implemented here
  };

  const handleRefresh = () => {
    console.log('Refreshing statistics data...');
    // Refresh functionality would be implemented here
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
    
    if (filterType === 'orderType') {
      setOrderTypeFilter(orderTypeFilter === value ? null : value);
    } else if (filterType === 'daypart') {
      setDaypartFilter(daypartFilter === value ? null : value);
    }
    
    // In a real implementation, this would trigger a database query
    // For now, the insightsData will automatically update due to state change
  };

  const clearAllFilters = () => {
    setOrderTypeFilter(null);
    setDaypartFilter(null);
    console.log('All filters cleared');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 The Ledger
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Export it, share it, act on it.
          </p>
        </div>

        {/* Aurora Header Wash */}
        <div className="bg-gradient-to-r from-[#5B47FF]/10 to-[#7B6CFF]/10 dark:from-[#5B47FF]/20 dark:to-[#7B6CFF]/20 border border-[#7B6CFF]/20 dark:border-[#7B6CFF]/30 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNotificationsModalOpen(true)}
                className="gap-2"
              >
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 last:rounded-b-lg"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Period Selector */}
            <Card className="border-[#7B6CFF]/20 dark:border-[#7B6CFF]/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-4 h-4 text-[#5B47FF]" />
                  <Label className="font-medium">Time Period</Label>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card className="border-[#7B6CFF]/20 dark:border-[#7B6CFF]/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Filter className="w-4 h-4 text-[#5B47FF]" />
                  <Label className="font-medium">Quick Filters</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={orderTypeFilter === 'dine-in' ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      orderTypeFilter === 'dine-in' 
                        ? 'bg-[#7B6CFF] text-white' 
                        : 'hover:bg-[#7B6CFF]/10'
                    }`}
                    onClick={() => handleFilterChange('orderType', 'dine-in')}
                  >
                    Dine-in
                  </Badge>
                  <Badge 
                    variant={orderTypeFilter === 'pickup' ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      orderTypeFilter === 'pickup' 
                        ? 'bg-[#7B6CFF] text-white' 
                        : 'hover:bg-[#7B6CFF]/10'
                    }`}
                    onClick={() => handleFilterChange('orderType', 'pickup')}
                  >
                    Pickup
                  </Badge>
                  <Badge 
                    variant={orderTypeFilter === 'delivery' ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      orderTypeFilter === 'delivery' 
                        ? 'bg-[#7B6CFF] text-white' 
                        : 'hover:bg-[#7B6CFF]/10'
                    }`}
                    onClick={() => handleFilterChange('orderType', 'delivery')}
                  >
                    Delivery
                  </Badge>
                                      <Badge 
                      variant={daypartFilter === 'weekend' ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        daypartFilter === 'weekend' 
                          ? 'bg-[#7B6CFF] text-white' 
                          : 'hover:bg-[#7B6CFF]/10'
                      }`}
                      onClick={() => handleFilterChange('daypart', 'weekend')}
                    >
                      Weekends
                    </Badge>
                    
                    {(orderTypeFilter || daypartFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Collapsible Insights Cards */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Quick Insights Overview</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Key metrics for {getPeriodLabel(selectedPeriod).toLowerCase()}
                        {orderTypeFilter && ` • ${orderTypeFilter}`}
                        {daypartFilter && ` • ${daypartFilter}`}
                      </p>
                    </div>
                  </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
                className="gap-2"
              >
                {isInsightsExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          {isInsightsExpanded && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline" className="text-xs">+12%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Overall performance metrics and key insights
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg Rating</span>
                  <span className="font-medium">4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="outline" className="text-xs text-green-600">+18%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Revenue</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Financial performance and growth trends
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Revenue</span>
                  <span className="font-medium">$45.2K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Growth</span>
                  <span className="font-medium text-green-600">+18%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="outline" className="text-xs text-purple-600">+15%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Operational efficiency and productivity metrics
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Table Turnover</span>
                  <span className="font-medium">2.3x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Efficiency</span>
                  <span className="font-medium text-purple-600">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge variant="outline" className="text-xs text-orange-600">+22%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Reservations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Booking patterns and capacity management
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bookings Today</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-orange-600">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500 hover:border-l-red-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Utensils className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <Badge variant="outline" className="text-xs text-red-600">+8%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Menu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Menu performance and item popularity
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Top Item</span>
                  <span className="font-medium">Grilled Salmon</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Orders</span>
                  <span className="font-medium text-red-600">89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 hover:border-l-indigo-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <Badge variant="outline" className="text-xs text-indigo-600">+14%</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Staff</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Team performance and productivity metrics
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active Staff</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg Rating</span>
                  <span className="font-medium text-indigo-600">4.7/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Redesigned Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 shadow-lg backdrop-blur-sm">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'overview'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'overview' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium text-sm">Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('revenue')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'revenue'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'revenue' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium text-sm">Revenue</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'performance'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'performance' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <Target className="w-4 h-4" />
                  <span className="font-medium text-sm">Performance</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'reservations'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'reservations' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium text-sm">Reservations</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'menu'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'menu' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <Utensils className="w-4 h-4" />
                  <span className="font-medium text-sm">Menu</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('staff')}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2.5 ${
                  activeTab === 'staff'
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Active Background */}
                {activeTab === 'staff' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl shadow-md"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Staff</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">

          <div className="transition-all duration-200 ease-in-out">
            <div className={`${activeTab === 'overview' ? 'block' : 'hidden'}`}>
              {/* Overview Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{insightsData.overview.totalRevenue.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.overview.totalRevenue.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.overview.totalRevenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.overview.totalRevenue.growth > 0 ? '+' : ''}{insightsData.overview.totalRevenue.growth}%
                        </span>
                        <span className="text-blue-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Orders</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.overview.totalOrders.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.overview.totalOrders.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.overview.totalOrders.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.overview.totalOrders.growth > 0 ? '+' : ''}{insightsData.overview.totalOrders.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Customer Rating</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsData.overview.customerRating.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.overview.customerRating.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.overview.customerRating.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.overview.customerRating.growth > 0 ? '+' : ''}{insightsData.overview.customerRating.growth}%
                        </span>
                        <span className="text-purple-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsOverview compareEnabled={compareEnabled} />
            </div>
            
            <div className={`${activeTab === 'revenue' ? 'block' : 'hidden'}`}>
              {/* Revenue Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">{getPeriodLabel(selectedPeriod)} Revenue</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.revenue.monthlyRevenue.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.revenue.monthlyRevenue.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.revenue.monthlyRevenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.revenue.monthlyRevenue.growth > 0 ? '+' : ''}{insightsData.revenue.monthlyRevenue.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Order Value</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{insightsData.revenue.avgOrderValue.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.revenue.avgOrderValue.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.revenue.avgOrderValue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.revenue.avgOrderValue.growth > 0 ? '+' : ''}{insightsData.revenue.avgOrderValue.growth}%
                        </span>
                        <span className="text-blue-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <PieChart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Top Category</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsData.revenue.topCategory.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.revenue.topCategory.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.revenue.topCategory.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.revenue.topCategory.growth > 0 ? '+' : ''}{insightsData.revenue.topCategory.growth}%
                        </span>
                        <span className="text-purple-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Peak Hours</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{insightsData.revenue.peakHours.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.revenue.peakHours.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.revenue.peakHours.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.revenue.peakHours.growth > 0 ? '+' : ''}{insightsData.revenue.peakHours.growth}%
                        </span>
                        <span className="text-orange-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsRevenue compareEnabled={compareEnabled} />
            </div>
            
            <div className={`${activeTab === 'performance' ? 'block' : 'hidden'}`}>
              {/* Performance Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Table Turnover</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsData.performance.tableTurnover.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.performance.tableTurnover.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.performance.tableTurnover.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.performance.tableTurnover.growth > 0 ? '+' : ''}{insightsData.performance.tableTurnover.growth}%
                        </span>
                        <span className="text-purple-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Efficiency</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{insightsData.performance.efficiency.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.performance.efficiency.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.performance.efficiency.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.performance.efficiency.growth > 0 ? '+' : ''}{insightsData.performance.efficiency.growth}%
                        </span>
                        <span className="text-blue-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Service Time</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.performance.avgServiceTime.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.performance.avgServiceTime.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        )}
                        <span className={`font-medium ${insightsData.performance.avgServiceTime.growth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {insightsData.performance.avgServiceTime.growth > 0 ? '+' : ''}{insightsData.performance.avgServiceTime.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsPerformance compareEnabled={compareEnabled} />
            </div>
            
            <div className={`${activeTab === 'reservations' ? 'block' : 'hidden'}`}>
              {/* Reservations Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">{selectedPeriod === 'today' ? "Today's" : getPeriodLabel(selectedPeriod)} Bookings</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{insightsData.reservations.todaysBookings.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.reservations.todaysBookings.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.reservations.todaysBookings.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.reservations.todaysBookings.growth > 0 ? '+' : ''}{insightsData.reservations.todaysBookings.growth}%
                        </span>
                        <span className="text-orange-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Capacity</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{insightsData.reservations.capacity.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.reservations.capacity.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.reservations.capacity.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.reservations.capacity.growth > 0 ? '+' : ''}{insightsData.reservations.capacity.growth}%
                        </span>
                        <span className="text-blue-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Party Size</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.reservations.avgPartySize.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.reservations.avgPartySize.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.reservations.avgPartySize.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.reservations.avgPartySize.growth > 0 ? '+' : ''}{insightsData.reservations.avgPartySize.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Peak Day</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsData.reservations.peakDay.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.reservations.peakDay.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.reservations.peakDay.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.reservations.peakDay.growth > 0 ? '+' : ''}{insightsData.reservations.peakDay.growth}%
                        </span>
                        <span className="text-purple-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsReservations compareEnabled={compareEnabled} />
            </div>
            
            <div className={`${activeTab === 'menu' ? 'block' : 'hidden'}`}>
              {/* Menu Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-700 dark:text-red-300">Top Item</p>
                          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{insightsData.menu.topItem.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.menu.topItem.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.menu.topItem.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.menu.topItem.growth > 0 ? '+' : ''}{insightsData.menu.topItem.growth}%
                        </span>
                        <span className="text-red-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Items</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.menu.totalItems.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.menu.totalItems.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.menu.totalItems.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.menu.totalItems.growth > 0 ? '+' : ''}{insightsData.menu.totalItems.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <PieChart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Categories</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{insightsData.menu.categories.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.menu.categories.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.menu.categories.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.menu.categories.growth > 0 ? '+' : ''}{insightsData.menu.categories.growth}%
                        </span>
                        <span className="text-blue-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsMenuAnalysis compareEnabled={compareEnabled} />
            </div>
            
            <div className={`${activeTab === 'staff' ? 'block' : 'hidden'}`}>
              {/* Staff Section Insights */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Active Staff</p>
                          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{insightsData.staff.activeStaff.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.staff.activeStaff.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.staff.activeStaff.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.staff.activeStaff.growth > 0 ? '+' : ''}{insightsData.staff.activeStaff.growth}%
                        </span>
                        <span className="text-indigo-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Rating</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insightsData.staff.avgRating.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.staff.avgRating.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.staff.avgRating.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.staff.avgRating.growth > 0 ? '+' : ''}{insightsData.staff.avgRating.growth}%
                        </span>
                        <span className="text-green-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Productivity</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsData.staff.productivity.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {insightsData.staff.productivity.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${insightsData.staff.productivity.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insightsData.staff.productivity.growth > 0 ? '+' : ''}{insightsData.staff.productivity.growth}%
                        </span>
                        <span className="text-purple-600">{getPeriodComparison(selectedPeriod)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <StatisticsStaff compareEnabled={compareEnabled} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Statistics Notifications Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mockStatisticsNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You'll see important statistics updates here</p>
              </div>
            ) : (
              mockStatisticsNotifications.map((notification) => {
                const priorityColors = {
                  high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
                  medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
                  low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                };
                
                const priorityIcons = {
                  high: '🔴',
                  medium: '🟡',
                  low: '🔵'
                };
                
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.isRead ? priorityColors[notification.priority as keyof typeof priorityColors] : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-lg">
                        {priorityIcons[notification.priority as keyof typeof priorityIcons]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.priority} priority
                          </Badge>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Mark all as read logic would go here
                console.log('Mark all as read');
              }}
            >
              Mark all as read
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Notification Button */}
      <div 
        ref={bellRef}
        className="fixed bottom-6 right-6 z-50"
        style={{
          transform: `translateY(${getAdaptiveScrollTransform()}px)`,
          transition: 'transform 0.15s ease-out'
        }}
        title={`Scroll Y: ${scrollY}, Adaptive Transform: ${getAdaptiveScrollTransform()}px`}
      >
        {/* Debug indicator */}
        <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Scroll: {scrollY}px
        </div>
        <Button
          onClick={() => setIsNotificationsModalOpen(true)}
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </>
  );
}
