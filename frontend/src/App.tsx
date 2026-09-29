import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CrisisProvider, useCrisis } from './context/CrisisContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { DecisionCenterPage } from './components/decision-center/DecisionCenterPage';
import { DecisionEvidenceModal } from './components/decision-center/DecisionEvidenceModal';
import { DecisionMemoryModal } from './components/decision-memory/DecisionMemoryModal';
import { OrganizationalMemoryPage } from './components/memory/OrganizationalMemoryPage';
import { InsightsPage } from './components/insights/InsightsPage';
import { SimulatorPage } from './components/simulations/SimulatorPage';
import { PastCasesPage } from './components/past-cases/PastCasesPage';
import { InventoryAnalyticsPage } from './components/inventory/InventoryAnalyticsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { NewCrisisWizard } from './components/new-crisis/NewCrisisWizard';
import { HelpPage } from './components/help/HelpPage';
import { FloatingAIChat } from './components/ai-chat/FloatingAIChat';

const MainLayout: React.FC = () => {
  const { setChatOpen } = useCrisis();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row relative text-[#17213D] selection:bg-[#E8E6FA] selection:text-[#6455D8]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer />

      {/* Decision Evidence Timeline Modal */}
      <DecisionEvidenceModal />

      {/* HindSight Precedent Post-Mortem Modal */}
      <DecisionMemoryModal />

      {/* Left Minimal Enterprise Sidebar */}
      <Sidebar onOpenChat={() => setChatOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header />

        <main className="flex-1 overflow-y-auto pb-16">
          <Routes>
            <Route path="/overview" element={<HomeDashboard />} />
            <Route path="/crisis/new" element={<NewCrisisWizard />} />
            <Route path="/decision-center" element={<DecisionCenterPage />} />
            <Route path="/decision-center/:id" element={<DecisionCenterPage />} />
            <Route path="/inventory" element={<InventoryAnalyticsPage />} />
            <Route path="/simulations" element={<SimulatorPage />} />
            <Route path="/past-decisions" element={<PastCasesPage />} />
            <Route path="/memory" element={<OrganizationalMemoryPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>

      {/* Professional AI Assistant Panel */}
      <FloatingAIChat />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CrisisProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected SaaS Application Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CrisisProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
