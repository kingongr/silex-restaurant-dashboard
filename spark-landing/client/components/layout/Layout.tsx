import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleDesktopSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleDesktopSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* TopBar */}
      <TopBar
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleMobileSidebar}
        title={title}
      />

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300 min-h-screen",
          // Mobile: no left margin
          "ml-0",
          // Desktop: adjust for sidebar
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <div className="p-4 lg:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
