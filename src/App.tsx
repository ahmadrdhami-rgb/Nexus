import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';
import PaymentsPage from './pages/payments/PaymentsPage';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';
import VideoCallPage from './pages/video-call/VideoCallPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >
            <Route
              path="entrepreneur"
              element={
                <ProtectedRoute>
                  <EntrepreneurDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="investor"
              element={
                <ProtectedRoute>
                  <InvestorDashboard />
                </ProtectedRoute>
              }
            />
            {/* Remove /payments from here - it's now a separate route */}
          </Route>
          
          {/* Payments Route - Fixed to root level with DashboardLayout */}
          <Route path="/payments" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Profile Routes */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route
              path="entrepreneur/:id"
              element={
                <ProtectedRoute>
                  <EntrepreneurProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="investor/:id"
              element={
                <ProtectedRoute>
                  <InvestorProfile />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Feature Routes */}
          <Route path="/investors" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <InvestorsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/entrepreneurs" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <EntrepreneursPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/messages" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/notifications" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/documents" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/settings" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/help" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <HelpPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/deals" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <DealsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Video Call Route */}
          <Route path="/video-call" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <VideoCallPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Chat Routes */}
          <Route path="/chat" element={<DashboardLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;