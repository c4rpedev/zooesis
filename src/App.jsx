
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import Layout from '@/components/layout/Layout.jsx'; 
    import HomePage from '@/pages/HomePage.jsx';
    import NewAnalysisPage from '@/pages/NewAnalysisPage.jsx';
    import ReviewPage from '@/pages/ReviewPage.jsx';
    import ReportPage from '@/pages/ReportPage.jsx';
    import HistoryPage from '@/pages/HistoryPage.jsx';
    import LoginPage from '@/pages/LoginPage.jsx';
    import SignUpPage from '@/pages/SignUpPage.jsx';
    import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
    import SubscriptionPage from '@/pages/SubscriptionPage.jsx';
    import ProfilePage from '@/pages/ProfilePage.jsx';
    import LandingPage from '@/pages/LandingPage.jsx';
    import { Toaster } from '@/components/ui/toaster.jsx';
    import { TooltipProvider } from '@/components/ui/tooltip.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import PageNotFound from '@/pages/PageNotFound.jsx';
    import AdminLayout from '@/components/admin/AdminLayout.jsx';
    import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.jsx';
    import AdminUserManagementPage from '@/pages/admin/AdminUserManagementPage.jsx';
    import AdminPromptManagementPage from '@/pages/admin/AdminPromptManagementPage.jsx';
    import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage.jsx';
    import { Loader2 } from 'lucide-react';
    import HomeRedirect from '@/components/auth/HomeRedirect.jsx';


    const LoadingFallback = () => (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );

    const ProtectedRoute = ({ children }) => {
      const { user, loading } = useAuth();
    
      if (loading) {
        return <LoadingFallback />;
      }
    
      if (!user) {
        return <Navigate to="/login" replace />;
      }
    
      return children;
    };

    const AdminRoute = ({ children }) => {
      const { user, loading, isAdmin } = useAuth();

      if (loading) {
        return <LoadingFallback />;
      }

      if (!user) {
        return <Navigate to="/login" replace />;
      }
      
      if (!isAdmin) {
        return <Navigate to="/dashboard" replace />; 
      }
      return children;
    };

    const PublicRoute = ({ children }) => {
      const { user, loading, isAdmin } = useAuth();

      if (loading) {
        return <LoadingFallback />;
      }

      if (user) {
        return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />;
      }
      return children;
    }

    function App() {
      const { loading } = useAuth();

      if (loading) {                                
        return <LoadingFallback />;
      }


      return (
        <TooltipProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route 
                  path="/" 
                  element={<HomeRedirect />} 
                />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                
                <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/new-analysis" element={<ProtectedRoute><NewAnalysisPage /></ProtectedRoute>} />
                <Route path="/review/:analysisType/:analysisId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
                <Route path="/report/:analysisType/:analysisId" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                
                <Route path="*" element={<PageNotFound />} />
              </Route>

              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} /> 
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUserManagementPage />} />
                <Route path="prompts" element={<AdminPromptManagementPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      );
    }

    export default App;
  