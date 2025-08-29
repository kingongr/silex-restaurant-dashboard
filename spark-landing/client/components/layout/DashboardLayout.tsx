import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  ShoppingCart, 
  Calendar, 
  Users, 
  BarChart3, 
  ChevronLeft, 
  Sun, 
  Moon,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Eye,
  X,
  Store
} from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import AccountPreferencesModal from '../modals/AccountPreferencesModal';
import ViewAccountModal from '../modals/ViewAccountModal';
import RestaurantPreferencesModal from '../modals/RestaurantPreferencesModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  user?: { 
    email: string; 
    name: string;
    role?: 'admin' | 'manager' | 'staff';
    restaurant?: {
      code: string;
      name?: string;
      [key: string]: any;
    };
  } | null;
  onLogout?: () => void;
}

export default function DashboardLayout({ children, currentPage = 'dashboard', onPageChange, user, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAccountPreferencesOpen, setIsAccountPreferencesOpen] = useState(false);
  const [isViewAccountOpen, setIsViewAccountOpen] = useState(false);
  const [isRestaurantPreferencesOpen, setIsRestaurantPreferencesOpen] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const previousPageRef = useRef(currentPage);



  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(false); // Don't collapse on mobile, hide instead
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile, isMobileMenuOpen]);

  // Page transition animation
  useEffect(() => {
    if (previousPageRef.current !== currentPage && contentRef.current) {
      const content = contentRef.current;
      
      // Page transition effect
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px) scale(0.98)';
      
      setTimeout(() => {
        content.style.transition = 'all 0.6s ease-out';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0) scale(1)';
      }, 50);
      
      previousPageRef.current = currentPage;
    }
  }, [currentPage]);

  // Sidebar animation
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = 'width 0.3s ease-out';
      sidebarRef.current.style.width = isCollapsed ? '64px' : '264px';

      // Animate nav items
      if (navItemsRef.current) {
        const navItems = navItemsRef.current.children;
        Array.from(navItems).forEach((item, index) => {
          const element = item as HTMLElement;
          if (isCollapsed) {
            element.style.transform = 'translateX(-10px)';
          } else {
            element.style.transform = 'translateX(0)';
          }
        });
      }

      // Update body class for modal positioning
      if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    }
  }, [isCollapsed]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    
    // Theme transition animation
    if (contentRef.current) {
      contentRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'transform 0.3s ease-out';
          contentRef.current.style.transform = 'scale(1)';
        }
      }, 50);
    }
  };

  const handleLogOut = () => {
    // Logout animation
    if (contentRef.current) {
      contentRef.current.style.transform = 'scale(0.95)';
      contentRef.current.style.opacity = '0.7';
      contentRef.current.style.transition = 'all 0.3s ease-in';
      
      setTimeout(() => {
        onLogout?.();
      }, 300);
    } else {
      onLogout?.();
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'menu', icon: MenuIcon, label: 'Menu' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'reservations', icon: Calendar, label: 'Reservations' },
    { id: 'tables', icon: Users, label: 'Table Management' },
    { id: 'statistics', icon: BarChart3, label: 'Statistics' },
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => item.id === currentPage);
    return item?.label || 'Dashboard';
  };

  return (
    <div 
      data-component="dashboard-layout"
      className="h-screen overflow-hidden bg-[#F7F7FB] dark:bg-[#0F1116] transition-colors duration-300"
    >
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-[9990] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        data-component="dashboard-sidebar"
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-[#161A22] border-r border-gray-200 dark:border-gray-800 
          transition-transform duration-300 z-[9999] shadow-xl
          ${isMobile 
            ? `w-[264px] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${isCollapsed ? 'w-16' : 'w-[264px]'} translate-x-0`
          }
        `}
      >
        {/* Logo */}
        <div className="relative group/logo flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B47FF] to-[#7B6CFF] rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#5B47FF] font-bold text-lg">S</span>
              </div>
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Silex</span>
            )}
          </div>

          {/* Mobile Close Button */}
          {isMobile && isMobileMenuOpen && (
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {/* Logo tooltip for collapsed state - desktop only */}
          {!isMobile && isCollapsed && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-300 z-[10000]">
              Silex Restaurant
              {/* Tooltip arrow */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 border-l border-b border-gray-700 dark:border-gray-300"></div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav ref={navItemsRef} className="mt-6 px-3 h-[calc(100vh-8rem)] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.id} className="relative group/nav">
              <button
                onClick={() => {
                  onPageChange?.(item.id);
                  // Navigate to the route
                  navigate(`/${item.id === 'dashboard' ? '' : item.id}`);
                  // Close mobile menu when navigating
                  if (isMobile) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02) translateX(2px)';
                  e.currentTarget.style.transition = 'all 0.2s ease-out';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateX(0)';
                  e.currentTarget.style.transition = 'all 0.2s ease-out';
                }}
                className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-[#5B47FF]/10 to-[#7B6CFF]/10 text-[#5B47FF] dark:text-[#7B6CFF] border-r-2 border-[#5B47FF] dark:border-[#7B6CFF]' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                } ${!isMobile && isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <item.icon className={`w-5 h-5 ${!isMobile && isCollapsed ? '' : 'flex-shrink-0'}`} />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
              
              {/* Tooltip for collapsed state - desktop only */}
              {!isMobile && isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-300 z-[10000]">
                  {item.label}
                  {/* Tooltip arrow */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 border-l border-b border-gray-700 dark:border-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse Button - Desktop Only */}
        {!isMobile && (
          <div className="absolute bottom-6 left-3 right-3">
            <div className="relative group/collapse">
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                variant="ghost"
                size="sm"
                className={`w-full hover:scale-105 transition-transform duration-200 ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                }`}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                {!isCollapsed && (
                  <span className="ml-2">
                    Collapse
                  </span>
                )}
              </Button>
              
              {/* Collapse button tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover/collapse:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-300 z-[10000]">
                  Expand Sidebar
                  {/* Tooltip arrow */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 border-l border-b border-gray-700 dark:border-gray-300"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div 
        className={`
          fixed top-0 h-16 bg-white dark:bg-[#161A22] border-b border-gray-200 dark:border-gray-800 
          flex items-center justify-between px-6 z-[9998] shadow-sm backdrop-blur-sm
          transition-all duration-300
          ${isMobile ? 'left-0 right-0' : isCollapsed ? 'left-16 right-0' : 'left-[264px] right-0'}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              onClick={() => setIsMobileMenuOpen(true)}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="hover:scale-110 transition-transform duration-200 group relative"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                isMobile ? 'p-2' : 'gap-3 pl-2 pr-4 py-2 min-w-0'
              }`}>
                <div className="w-8 h-8 bg-gradient-to-br from-[#5B47FF] to-[#7B6CFF] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!isMobile && (
                  <>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm leading-tight">{user?.name || 'Admin User'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{user?.restaurant?.name || 'Silex Restaurant'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsViewAccountOpen(true)} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                View Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAccountPreferencesOpen(true)} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Account Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRestaurantPreferencesOpen(true)} className="cursor-pointer">
                <Store className="w-4 h-4 mr-2" />
                Restaurant Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer text-red-600 dark:text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div 
        className={`
          transition-all duration-300 h-screen
          ${isMobile ? 'ml-0' : isCollapsed ? 'ml-16' : 'ml-[264px]'}
        `}
      >
        <div 
          ref={contentRef} 
          className="h-full pt-16 overflow-y-auto"
          style={{
            height: '100vh',
            paddingTop: '64px', // Height of top bar
          }}
        >
          <div className={`${isMobile ? 'p-4' : 'p-6'} min-h-full`}>
            {children}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AccountPreferencesModal isOpen={isAccountPreferencesOpen} onClose={() => setIsAccountPreferencesOpen(false)} />
      <ViewAccountModal isOpen={isViewAccountOpen} onClose={() => setIsViewAccountOpen(false)} />
      <RestaurantPreferencesModal isOpen={isRestaurantPreferencesOpen} onClose={() => setIsRestaurantPreferencesOpen(false)} />
    </div>
  );
}
