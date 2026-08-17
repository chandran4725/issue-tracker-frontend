import React, { useState, useEffect } from 'react';
import { issueApi } from '../../api/issueApi';
import { projectApi } from '../../api/projectApi';
import { employeeApi } from '../../api/employeeApi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { IssueModal } from './IssueModal';
import { IssueKanbanView } from './IssueKanbanView';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, Search, LayoutGrid, List, Edit3, Trash2, Bug } from 'lucide-react';

export function IssueListView() {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { canCreateIssues, canUpdateIssues, canDeleteIssues } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [issueData, projData, empData] = await Promise.all([
        issueApi.getAll(),
        projectApi.getAll().catch(() => []),
        employeeApi.getAll().catch(() => []),
      ]);
      setIssues(issueData || []);
      setProjects(projData || []);
      setEmployees(empData || []);
    } catch (err) {
      notifyError('Failed to fetch issues: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    try {
      if (editingIssue) {
        await issueApi.update(editingIssue.issue_id, formData);
        notifySuccess('Issue updated successfully');
      } else {
        await issueApi.create(formData);
        notifySuccess('Issue reported successfully');
      }
      setIsModalOpen(false);
      setEditingIssue(null);
      fetchInitialData();
    } catch (err) {
      notifyError(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await issueApi.delete(issueId);
      notifySuccess('Issue deleted');
      fetchInitialData();
    } catch (err) {
      notifyError(err.message || 'Failed to delete issue');
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.issue_title.toLowerCase().includes(search.toLowerCase()) ||
      issue.issue_desc.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesProject = !projectFilter || String(issue.pro_id) === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <div className="space-y-6">
      {/* Search, Filters & View Toggle Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <Input
            placeholder="Search issues..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Statuses"
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CLOSED', label: 'Closed' },
            ]}
          />

          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            placeholder="All Projects"
            options={projects.map((p) => ({ value: p.pro_id, label: p.pro_title }))}
          />
        </div>

        {/* Right Action buttons & View mode toggle */}
        <div className="flex items-center gap-3 justify-end shrink-0">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 border border-slate-300/50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>

          {canCreateIssues && (
            <Button
              icon={Plus}
              onClick={() => {
                setEditingIssue(null);
                setIsModalOpen(true);
              }}
            >
              Report Issue
            </Button>
          )}
        </div>
      </div>

      {/* Main View Content */}
      {loading ? (
        <LoadingSpinner message="Fetching issue tracking list..." />
      ) : filteredIssues.length === 0 ? (
        <Card className="text-center py-12">
          <Bug className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Issues Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search || statusFilter || projectFilter
              ? 'No issues match your current filters.'
              : 'No issues logged for your assigned projects.'}
          </p>
          {canCreateIssues && (
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingIssue(null);
                setIsModalOpen(true);
              }}
            >
              Report Issue
            </Button>
          )}
        </Card>
      ) : viewMode === 'kanban' ? (
        <IssueKanbanView
          issues={filteredIssues}
          canUpdate={canUpdateIssues}
          canDelete={canDeleteIssues}
          onEdit={(issue) => {
            setEditingIssue(issue);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      ) : (
        /* Table View */
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Status</th>
                  {(canUpdateIssues || canDeleteIssues) && (
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{issue.issue_title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{issue.issue_desc}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {issue.project?.pro_title || `Project #${issue.pro_id}`}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {issue.employee?.name || `Employee #${issue.emp_id}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={issue.status}>{issue.status}</Badge>
                    </td>
                    {(canUpdateIssues || canDeleteIssues) && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canUpdateIssues && (
                            <button
                              onClick={() => {
                                setEditingIssue(issue);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md transition-colors"
                              title="Edit / Update Status"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDeleteIssues && (
                            <button
                              onClick={() => handleDelete(issue.issue_id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIssue(null);
        }}
        onSubmit={handleCreateOrUpdate}
        issue={editingIssue}
        projects={projects}
        employees={employees}
        isLoading={isSaving}
      />
    </div>
  );
}
