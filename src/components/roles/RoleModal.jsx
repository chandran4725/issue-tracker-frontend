import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function RoleModal({ isOpen, onClose, onSubmit, role, isLoading }) {
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    if (role) {
      setRoleName(role.role_name || '');
    } else {
      setRoleName('');
    }
  }, [role, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ role_name: roleName });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Edit Role' : 'Create New Role'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Role Name"
          placeholder="e.g. ADMIN, MANAGER, DEVELOPER, QA_LEAD"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
          helperText="Role names are capitalized identifiers used for RBAC security permissions."
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {role ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
