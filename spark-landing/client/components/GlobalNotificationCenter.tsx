import React, { useState, useRef } from 'react';
import { Bell, MessageSquare, AlertCircle, CheckCircle, Search, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DashboardDialog, DashboardDialogContent, DashboardDialogHeader, DashboardDialogTitle } from '@/components/ui/dashboard-dialog';

interface Notification {
  id: string;
  type: 'reservation_confirmed' | 'table_ready' | 'special_offer' | 'reminder' | 'system_update' | 'performance_alert' | 'maintenance_reminder' | 'new_feature';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: any;
  color: string;
  priority?: 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reservation_confirmed',
    title: 'Reservation Confirmed! 🎉',
    message: 'Your table for 4 people on August 26th at 7:00 PM has been confirmed.',
    time: '2 hours ago',
    isRead: false,
    icon: CheckCircle,
    color: 'text-green-600',
    priority: 'high'
  },
  {
    id: '2',
    type: 'table_ready',
    title: 'Table Ready! 🍽️',
    message: 'Your table is now ready. Please proceed to the host stand.',
    time: '5 minutes ago',
    isRead: false,
    icon: CheckCircle,
    color: 'text-blue-600',
    priority: 'high'
  },
  {
    id: '3',
    type: 'special_offer',
    title: 'Special Offer! 💝',
    message: 'Happy Birthday! Enjoy 20% off your meal today.',
    time: '1 day ago',
    isRead: true,
    icon: MessageSquare,
    color: 'text-purple-600',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Upcoming Reservation ⏰',
    message: 'Reminder: Your reservation is tomorrow at 7:00 PM.',
    time: '2 days ago',
    isRead: true,
    icon: AlertCircle,
    color: 'text-orange-600',
    priority: 'medium'
  },
  {
    id: '5',
    type: 'system_update',
    title: 'System Update Available 🔧',
    message: 'New dashboard features have been added. Refresh to see the latest updates.',
    time: '5 minutes ago',
    isRead: false,
    icon: AlertCircle,
    color: 'text-blue-600',
    priority: 'low'
  },
  {
    id: '6',
    type: 'performance_alert',
    title: 'Performance Alert 📊',
    message: 'Your restaurant is performing above average today! Great job team.',
    time: '1 hour ago',
    isRead: false,
    icon: CheckCircle,
    color: 'text-green-600',
    priority: 'medium'
  },
  {
    id: '7',
    type: 'maintenance_reminder',
    title: 'Maintenance Reminder ⏰',
    message: 'Scheduled system maintenance will begin at 2:00 AM tonight.',
    time: '3 hours ago',
    isRead: true,
    icon: AlertCircle,
    color: 'text-yellow-600',
    priority: 'medium'
  },
  {
    id: '8',
    type: 'new_feature',
    title: 'New Feature Available ✨',
    message: 'Advanced analytics dashboard is now available for premium users.',
    time: '1 day ago',
    isRead: true,
    icon: MessageSquare,
    color: 'text-purple-600',
    priority: 'low'
  }
];

export default function GlobalNotificationCenter() {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterReadStatus, setFilterReadStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Reference for the floating button
  const bellRef = useRef<HTMLDivElement>(null);


  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = filterReadStatus === 'all' ||
                             (filterReadStatus === 'read' && notification.isRead) ||
                             (filterReadStatus === 'unread' && !notification.isRead);
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;

    return matchesSearch && matchesType && matchesReadStatus && matchesPriority;
  });

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true);
  };

  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '🔵';
    }
  };

  return (
    <>
      {/* Floating Notification Bell Button */}
      <div
        ref={bellRef}
        className="fixed bottom-6 right-6 z-[10000]"
      >
        <Button
          onClick={handleBellClick}
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 group"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Notifications
              {/* Tooltip arrow */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 translate-x-1 w-0 h-0 border-l-4 border-l-gray-900 dark:border-l-gray-100 border-y-4 border-y-transparent"></div>
            </div>
          </div>
        </Button>
      </div>

      {/* Notification Center Modal */}
      <DashboardDialog open={isNotificationCenterOpen} onOpenChange={setIsNotificationCenterOpen}>
        <DashboardDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DashboardDialogHeader className="pb-4">
            <DashboardDialogTitle className="flex items-center gap-2 text-xl">
              <Bell className="w-6 h-6" />
              Notifications Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DashboardDialogTitle>
          </DashboardDialogHeader>

          {/* Filters and Search */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Types</option>
                  <option value="reservation_confirmed">Reservation Confirmed</option>
                  <option value="reservation_cancelled">Reservation Cancelled</option>
                  <option value="table_ready">Table Ready</option>
                  <option value="reservation_reminder">Reservation Reminder</option>
                  <option value="special_offer">Special Offers</option>
                  <option value="promotion">Promotions</option>
                  <option value="new_message">New Messages</option>
                  <option value="system_update">System Updates</option>
                  <option value="performance_alert">Performance Alerts</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="maintenance_reminder">Maintenance Reminder</option>
                  <option value="security_alert">Security Alerts</option>
                  <option value="feedback_request">Feedback Requests</option>
                  <option value="new_feature">New Features</option>
                  <option value="reminder">Reminders</option>
                </select>
                <select 
                  value={filterReadStatus} 
                  onChange={(e) => setFilterReadStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filters'}
                </h3>
                <p className="text-sm">
                  {notifications.length === 0
                    ? "You'll see important updates here"
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${
                        !notification.isRead ? getPriorityColor(notification.priority) : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${notification.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <span className="text-lg">
                                  {getPriorityIcon(notification.priority)}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.priority} priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {notification.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 px-2 text-xs"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              <Button
                                aria-label="Delete notification"
                                title="Delete notification"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} • {notifications.length} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </DashboardDialogContent>
      </DashboardDialog>
    </>
  );
}
