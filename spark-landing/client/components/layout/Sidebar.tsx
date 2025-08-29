import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MenuIcon,
  ShoppingCart,
  Calendar,
  Users,
  BarChart3,
  ChevronLeft,
  Crown
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const navigationItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { id: 'menu', icon: MenuIcon, label: 'Menu', path: '/menu' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { id: 'reservations', icon: Calendar, label: 'Reservations', path: '/reservations' },
  { id: 'tables', icon: Users, label: 'Table Management', path: '/tables' },
  { id: 'statistics', icon: BarChart3, label: 'Statistics', path: '/statistics' }
];

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-border z-50 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="px-6 py-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 aurora-gradient rounded-xl shadow-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-heading-3 font-semibold text-foreground">Silex</h1>
              <p className="text-caption text-muted-foreground">Restaurant</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group",
                isActive
                  ? "aurora-gradient text-white border-r-2 border-aurora-600"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 hover:translate-x-1"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-white" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                )} 
              />
              {!collapsed && (
                <span className="text-body font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onToggleCollapsed}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-lg transition-all duration-300",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft 
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              collapsed && "rotate-180"
            )} 
          />
          {!collapsed && (
            <span className="ml-2 text-body-small">Collapse</span>
          )}
        </button>
      </div>
    </div>
  );
}
