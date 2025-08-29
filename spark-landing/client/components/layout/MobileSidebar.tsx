import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MenuIcon,
  ShoppingCart,
  Calendar,
  Users,
  BarChart3,
  X,
  Crown
} from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { id: 'menu', icon: MenuIcon, label: 'Menu', path: '/menu' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { id: 'reservations', icon: Calendar, label: 'Reservations', path: '/reservations' },
  { id: 'tables', icon: Users, label: 'Table Management', path: '/tables' },
  { id: 'statistics', icon: BarChart3, label: 'Statistics', path: '/statistics' }
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-border z-50 flex flex-col transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 aurora-gradient rounded-xl shadow-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-heading-3 font-semibold text-foreground">Silex</h1>
              <p className="text-caption text-muted-foreground">Restaurant</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left w-full",
                  isActive
                    ? "aurora-gradient text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={onClose}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-white" : "text-sidebar-foreground"
                  )} 
                />
                <span className="text-body font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="text-body-small text-muted-foreground">
              Silex Restaurant Management
            </p>
            <p className="text-caption text-muted-foreground">
              © 2024 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
