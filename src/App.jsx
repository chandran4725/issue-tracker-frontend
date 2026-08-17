import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { CustomLoginForm } from './components/auth/CustomLoginForm';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectListView } from './components/projects/ProjectListView';
import { IssueListView } from './components/issues/IssueListView';
import { EmployeeListView } from './components/employees/EmployeeListView';
import { RoleListView } from './components/roles/RoleListView';
import { AssignmentListView } from './components/assignments/AssignmentListView';
import { LoadingSpinner } from './components/common/LoadingSpinner';

export function AppContent() {
  const { isLoaded, isAuthenticated, canManageRoles, canManageAssignments } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CustomLoginForm />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'projects':
        return <ProjectListView />;
      case 'issues':
        return <IssueListView />;
      case 'employees':
        return <EmployeeListView />;
      case 'roles':
        return canManageRoles ? <RoleListView /> : <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'assignments':
        return canManageAssignments ? <AssignmentListView /> : <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveView()}
    </AppLayout>
  );
}
