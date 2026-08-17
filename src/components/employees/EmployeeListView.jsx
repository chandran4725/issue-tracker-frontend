import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../api/employeeApi';
import { roleApi } from '../../api/roleApi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { EmployeeModal } from './EmployeeModal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, Search, Edit3, Trash2, Users, Mail, Shield } from 'lucide-react';

export function EmployeeListView() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { canManageEmployees } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empData, roleData] = await Promise.all([
        employeeApi.getAll(),
        roleApi.getAll().catch(() => []),
      ]);
      setEmployees(empData || []);
      setRoles(roleData || []);
    } catch (err) {
      notifyError('Failed to fetch employees: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    try {
      if (editingEmployee) {
        await employeeApi.update(editingEmployee.emp_id, formData);
        notifySuccess('Employee updated');
      } else {
        await employeeApi.create(formData);
        notifySuccess('Employee added');
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchData();
    } catch (err) {
      notifyError(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (empId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeApi.delete(empId);
      notifySuccess('Employee deleted');
      fetchData();
    } catch (err) {
      notifyError(err.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search employees by name or email..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {canManageEmployees && (
          <Button
            icon={Plus}
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
          >
            Add Employee
          </Button>
        )}
      </div>

      {/* Employee List Table */}
      {loading ? (
        <LoadingSpinner message="Fetching team directory..." />
      ) : filteredEmployees.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Employees Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search ? 'Try adjusting your search criteria.' : 'No team members registered yet.'}
          </p>
          {canManageEmployees && (
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
            >
              Add Employee
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  {canManageEmployees && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.emp_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-400">ID: #{emp.emp_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <Badge variant={emp.role?.role_name || 'default'}>
                          {emp.role?.role_name || 'No Role'}
                        </Badge>
                      </div>
                    </td>
                    {canManageEmployees && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.emp_id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
      {canManageEmployees && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          onSubmit={handleCreateOrUpdate}
          employee={editingEmployee}
          roles={roles}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
