import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  Users,
  Shield,
  UserCheck,
  X,
  Layers,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'issues', label: 'Issues', icon: Bug },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'roles', label: 'Roles', icon: Shield, requiresRole: 'canManageRoles' },
  { id: 'assignments', label: 'Assignments', icon: UserCheck, requiresRole: 'canManageAssignments' },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const auth = useAuth();

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.requiresRole) return true;
    return Boolean(auth[item.requiresRole]);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col border-r border-slate-800 shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight leading-none text-base">Tracker App</h2>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Issue Management</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}

      </aside>
    </>
  );
}
