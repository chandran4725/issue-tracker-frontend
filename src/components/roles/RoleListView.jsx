import React, { useState, useEffect } from 'react';
import { roleApi } from '../../api/roleApi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { RoleModal } from './RoleModal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, Shield, Edit3, Trash2 } from 'lucide-react';

export function RoleListView() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { isAdmin } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await roleApi.getAll();
      setRoles(data || []);
    } catch (err) {
      notifyError('Failed to fetch roles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    try {
      if (editingRole) {
        await roleApi.update(editingRole.role_id, formData);
        notifySuccess('Role updated');
      } else {
        await roleApi.create(formData);
        notifySuccess('Role created');
      }
      setIsModalOpen(false);
      setEditingRole(null);
      fetchRoles();
    } catch (err) {
      notifyError(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await roleApi.delete(roleId);
      notifySuccess('Role deleted');
      fetchRoles();
    } catch (err) {
      notifyError(err.message || 'Failed to delete role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">User Roles</h2>
          <p className="text-xs text-slate-500">Manage authorization roles and system permission scopes</p>
        </div>
        {isAdmin && (
          <Button
            icon={Plus}
            onClick={() => {
              setEditingRole(null);
              setIsModalOpen(true);
            }}
          >
            Add Role
          </Button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching role system..." />
      ) : roles.length === 0 ? (
        <Card className="text-center py-12">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Roles Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            System roles configured in backend.
          </p>
          {isAdmin && (
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingRole(null);
                setIsModalOpen(true);
              }}
            >
              Add Role
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.role_id} className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{role.role_name}</h3>
                    <p className="text-xs text-slate-400">ID: #{role.role_id}</p>
                  </div>
                </div>
                <Badge variant={role.role_name}>{role.role_name}</Badge>
              </div>

              {isAdmin && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(role.role_id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isAdmin && (
        <RoleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRole(null);
          }}
          onSubmit={handleCreateOrUpdate}
          role={editingRole}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
