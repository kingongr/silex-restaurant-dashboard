import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AccountPreferencesModal from '@/components/modals/AccountPreferencesModal';

interface TopBarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  title: string;
}

export function TopBar({ collapsed, onToggleSidebar, title }: TopBarProps) {
  const [isDark, setIsDark] = useState(false);
  const [isAccountPreferencesOpen, setIsAccountPreferencesOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border z-40 transition-all duration-300",
        // Desktop: adjust for sidebar
        "lg:left-0",
        collapsed ? "lg:left-16" : "lg:left-64",
        // Mobile: full width
        "left-0"
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Page Title */}
          <h1 className="text-heading-2 font-semibold text-foreground">
            {title}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2">
                <div className="w-8 h-8 aurora-gradient rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-body-small font-medium text-foreground">
                    {user?.full_name || user?.email || 'User'}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                View Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAccountPreferencesOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Account Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Crown className="w-4 h-4 mr-2" />
                Restaurant Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Account Preferences Modal */}
      <AccountPreferencesModal
        isOpen={isAccountPreferencesOpen}
        onClose={() => setIsAccountPreferencesOpen(false)}
      />
    </header>
  );
}
