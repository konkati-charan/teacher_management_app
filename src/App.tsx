
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import RadiusVerificationPage from "@/pages/RadiusVerificationPage";
import AttendancePage from "@/pages/AttendancePage";
import TimetablePage from "@/pages/TimetablePage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/radius-verification" element={
              <ProtectedRoute>
                <RadiusVerificationPage />
              </ProtectedRoute>
            } />
            
            <Route path="/attendance" element={
              <ProtectedRoute requireRadius>
                <AttendancePage />
              </ProtectedRoute>
            } />
            
            <Route path="/timetable" element={
              <ProtectedRoute requireRadius>
                <TimetablePage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Default Route - Redirect to register */}
            <Route path="/" element={<Navigate to="/register" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
