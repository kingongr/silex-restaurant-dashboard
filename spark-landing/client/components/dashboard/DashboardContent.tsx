import React, { useState, useRef } from 'react';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  Menu,
  Star,
  Plus,
  TrendingUp,
  Activity,
  MoreHorizontal,
  Edit,
  Trash2,
  Move,
  Database
} from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
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


    </div>
  );
}
