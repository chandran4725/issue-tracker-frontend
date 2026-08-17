import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Menu, LogOut, User } from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  projects: 'Projects Directory',
  issues: 'Issue Tracking',
  employees: 'Team Members',
  roles: 'Role & Permission System',
  assignments: 'Project Assignments',
};

export function Header({ activeTab, onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {TAB_TITLES[activeTab] || 'Issue Tracker'}
        </h1>
      </div>

      {/* Right: Active User & Sign Out */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 py-1.5 px-3 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>

              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
