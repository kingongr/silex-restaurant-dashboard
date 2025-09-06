import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardContent from "./components/dashboard/DashboardContent";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Tables from "./pages/Tables";
import Statistics from "./pages/Statistics";
import Dashboard from "./pages/Dashboard";
import AccountPreferencesDemo from "./pages/AccountPreferencesDemo";
import SupabaseTest from "./pages/SupabaseTest";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to use useLocation hook
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user] = useState({
    name: 'Admin User',
    email: 'admin@silex.com',
    role: 'admin' as const,
    restaurant: {
      name: 'Silex Restaurant',
      code: 'SLX001'
    }
  });

  // Update currentPage when route changes
  useEffect(() => {
    let path = window.location.pathname.substring(1); // Remove leading slash
    if (path === '') path = 'dashboard';
    setCurrentPage(path);
  }, []);

  // Function to handle page changes and update currentPage state
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // In a real app, this would handle authentication logout
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Public Routes - Login System (Separate from Dashboard) */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Dashboard Routes - No Authentication Required for Now */}
              <Route path="/" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <DashboardContent user={user} />
                </DashboardLayout>
              } />

              <Route path="/menu" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <Menu />
                </DashboardLayout>
              } />
              <Route path="/orders" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <Orders />
                </DashboardLayout>
              } />
              <Route path="/reservations" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <Reservations />
                </DashboardLayout>
              } />
              <Route path="/tables" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <Tables />
                </DashboardLayout>
              } />
              <Route path="/statistics" element={
                <DashboardLayout 
                  currentPage={currentPage} 
                  onPageChange={handlePageChange}
                  user={user}
                  onLogout={handleLogout}
                >
                  <Statistics />
                </DashboardLayout>
              } />
              <Route path="/account-preferences" element={<AccountPreferencesDemo />} />
              <Route path="/supabase-test" element={<SupabaseTest />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<AppContent />);
