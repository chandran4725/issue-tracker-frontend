import React, { useState, useEffect } from 'react';
import { assignmentApi } from '../../api/assignmentApi';
import { employeeApi } from '../../api/employeeApi';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AssignmentModal } from './AssignmentModal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, UserCheck, Trash2, FolderKanban, User } from 'lucide-react';

export function AssignmentListView() {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { canManageProjects } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignData, empData, projData] = await Promise.all([
        assignmentApi.getAll(),
        employeeApi.getAll().catch(() => []),
        projectApi.getAll().catch(() => []),
      ]);
      setAssignments(assignData || []);
      setEmployees(empData || []);
      setProjects(projData || []);
    } catch (err) {
      notifyError('Failed to fetch assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (formData) => {
    setIsSaving(true);
    try {
      await assignmentApi.create(formData);
      notifySuccess('Employee assigned to project!');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      notifyError(err.message || 'Failed to assign employee to project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAssignment = async (empId, proId) => {
    if (!window.confirm('Remove this employee assignment from the project?')) return;
    try {
      await assignmentApi.delete(empId, proId);
      notifySuccess('Assignment removed');
      fetchData();
    } catch (err) {
      notifyError(err.message || 'Failed to remove assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Project Assignments</h2>
          <p className="text-xs text-slate-500">Manage Many-to-Many employee team allocations across projects</p>
        </div>
        {canManageProjects && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Assignment
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching team assignment mapping..." />
      ) : assignments.length === 0 ? (
        <Card className="text-center py-12">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Assignments Created</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Assign team members to active project initiatives.
          </p>
          {canManageProjects && (
            <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
              Assign Employee
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Assigned Employee</th>
                  <th className="py-3.5 px-4">Project Title</th>
                  {canManageProjects && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((item) => (
                  <tr key={`${item.emp_id}-${item.pro_id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.employee?.name || `Employee #${item.emp_id}`}
                          </p>
                          <p className="text-xs text-slate-400">{item.employee?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <FolderKanban className="w-4 h-4 text-brand-500" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.project?.pro_title || `Project #${item.pro_id}`}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">{item.project?.pro_desc}</p>
                        </div>
                      </div>
                    </td>
                    {canManageProjects && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAssignment(item.emp_id, item.pro_id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Unassign</span>
                        </button>
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
      {canManageProjects && (
        <AssignmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAssignment}
          employees={employees}
          projects={projects}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
