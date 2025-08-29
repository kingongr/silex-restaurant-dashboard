import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Clock, 
  MenuIcon as Menu, 
  Star,
  Plus,
  TrendingUp,
  Activity,
  MoreHorizontal,
  Edit,
  Settings,
  Trash2,
  Move,
  AlertCircle,
  Database,
  Bell
} from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useScrollY } from '../../hooks/useScrollY';
import EnhancedKPICard from './EnhancedKPICard';
import AddMenuItemModal from '../modals/AddMenuItemModal';
import AddOrderModal from '../modals/AddOrderModal';
import BookTableModal from '../modals/BookTableModal';
import AddTableModal from '../modals/AddTableModal';

interface User {
  email: string;
  name: string;
  role?: 'admin' | 'manager' | 'staff';
  restaurant?: {
    code: string;
    name?: string;
    [key: string]: any;
  };
}

interface DashboardContentProps {
  user?: User | null;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isEditKPIModalOpen, setIsEditKPIModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Mock notifications data for dashboard
  const mockDashboardNotifications = [
    {
      id: '1',
      type: 'system_update',
      title: 'System Update Available 🔧',
      message: 'New dashboard features have been added. Refresh to see the latest updates.',
      time: '5 minutes ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'performance_alert',
      title: 'Performance Alert 📊',
      message: 'Your restaurant is performing above average today! Great job team.',
      time: '1 hour ago',
      isRead: false,
      priority: 'low'
    },
    {
      id: '3',
      type: 'maintenance_reminder',
      title: 'Maintenance Reminder ⏰',
      message: 'Scheduled system maintenance will begin at 2:00 AM tonight.',
      time: '3 hours ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'new_feature',
      title: 'New Feature Available ✨',
      message: 'Advanced analytics dashboard is now available for premium users.',
      time: '1 day ago',
      isRead: true,
      priority: 'low'
    }
  ];

  const unreadCount = mockDashboardNotifications.filter(n => !n.isRead).length;

  // Scroll behavior for floating notification bell
  const bellRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();

  const quickActions = [
    {
      label: 'Add Menu Item',
      onClick: () => setIsMenuModalOpen(true),
      color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
    },
    {
      label: 'Add Order',
      onClick: () => setIsOrderModalOpen(true),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
    },
    {
      label: 'Book Table',
      onClick: () => setIsReservationModalOpen(true),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30'
    },
    {
      label: 'Add Table',
      onClick: () => setIsTableModalOpen(true),
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
    }
  ];

  // Empty State Component
  const EmptyState = ({ 
    title, 
    description, 
    icon: Icon, 
    actionLabel, 
    onAction 
  }: {
    title: string;
    description: string;
    icon: any;
    actionLabel?: string;
    onAction?: () => void;
  }) => (
    <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">{description}</p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-8 border border-purple-100 dark:border-purple-800/30">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Silex, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's get your restaurant set up and start tracking your operations
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className={`${action.color} rounded-full px-4 py-2 transition-colors duration-200 hover:scale-105`}
              >
                <Plus className="w-3 h-3 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Aurora Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B47FF]/5 via-[#7B6CFF]/3 to-purple-500/5 dark:from-[#5B47FF]/10 dark:via-[#7B6CFF]/8 dark:to-purple-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7B6CFF]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#5B47FF]/10 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Primary KPI Cards - All Empty States */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Today's Performance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Key metrics for your restaurant's daily operations</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditKPIModalOpen(true)} className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                Customize Cards
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Move className="w-4 h-4 mr-2" />
                Reorder Cards
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedKPICard
            title="Today's Revenue"
            value="$0.00"
            subtitle="No revenue data available"
            icon={DollarSign}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            size="large"
          />
          
          <EnhancedKPICard
            title="Orders Today"
            value="0"
            subtitle="No orders placed today"
            icon={ShoppingCart}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            size="large"
          />
          
          <EnhancedKPICard
            title="Reservations"
            value="0"
            subtitle="No reservations today"
            icon={Users}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            size="large"
          />
          
          <EnhancedKPICard
            title="Table Occupancy"
            value="0%"
            subtitle="No table data available"
            icon={Star}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            size="large"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <EnhancedKPICard
            title="Pending Orders"
            value="0"
            subtitle="No pending orders"
            icon={Clock}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            layout="horizontal"
          />
          
          <EnhancedKPICard
            title="Total Menu Items"
            value="0"
            subtitle="No menu items added"
            icon={Menu}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            layout="horizontal"
          />

          <EnhancedKPICard
            title="Kitchen Efficiency"
            value="--"
            subtitle="No data available"
            icon={Activity}
            iconColor="text-gray-400"
            iconBg="bg-gray-100 dark:bg-gray-800"
            layout="horizontal"
          />
        </div>
      </div>

      {/* Charts Grid - All Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmptyState
          title="No Revenue Data"
          description="Start taking orders to see your revenue trends and analytics"
          icon={TrendingUp}
          actionLabel="Add First Order"
          onAction={() => setIsOrderModalOpen(true)}
        />
        <EmptyState
          title="No Order History"
          description="Your order status distribution will appear here once you start processing orders"
          icon={ShoppingCart}
          actionLabel="Add First Order"
          onAction={() => setIsOrderModalOpen(true)}
        />
      </div>

      {/* Recent Orders Table - Empty State */}
      <div>
        <EmptyState
          title="No Recent Orders"
          description="Your recent orders will be displayed here. Start by adding your first order to see order management in action."
          icon={Database}
          actionLabel="Add First Order"
          onAction={() => setIsOrderModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <AddMenuItemModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
      <AddOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />
      <BookTableModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)} 
      />
      <AddTableModal 
        isOpen={isTableModalOpen} 
        onClose={() => setIsTableModalOpen(false)} 
      />

      {/* Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Dashboard Notifications Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mockDashboardNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You'll see important dashboard updates here</p>
              </div>
            ) : (
              mockDashboardNotifications.map((notification) => {
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
          transform: `translateY(${Math.min(scrollY * 1.2, 800)}px)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <Button
          onClick={() => setIsNotificationsModalOpen(true)}
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}
