import React from 'react';
import { Badge } from '../common/Badge';
import { Edit3, Trash2, User, Folder } from 'lucide-react';

const COLUMNS = [
  { id: 'PENDING', title: 'Pending', bg: 'bg-amber-500/10 text-amber-800 border-amber-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', bg: 'bg-blue-500/10 text-blue-800 border-blue-200' },
  { id: 'COMPLETED', title: 'Completed', bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200' },
  { id: 'CLOSED', title: 'Closed', bg: 'bg-slate-500/10 text-slate-800 border-slate-200' },
];

export function IssueKanbanView({ issues = [], onEdit, onDelete, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnIssues = issues.filter((i) => i.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-100/70 rounded-2xl p-4 flex flex-col border border-slate-200/80 min-w-[260px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 border ${col.bg}`}>
              <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
              <span className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold shadow-xs">
                {columnIssues.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {columnIssues.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                  No issues
                </div>
              ) : (
                columnIssues.map((issue) => (
                  <div
                    key={issue.issue_id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
                        {issue.issue_title}
                      </h5>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(issue)}
                          className="p-1 text-slate-400 hover:text-brand-600 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(issue.issue_id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{issue.issue_desc}</p>

                    <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                      {issue.project && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Folder className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{issue.project.pro_title}</span>
                        </div>
                      )}
                      {issue.employee && (
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{issue.employee.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
