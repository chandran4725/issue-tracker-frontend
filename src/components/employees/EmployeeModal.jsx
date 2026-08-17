import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee,
  roles = [],
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        role_id: employee.role_id || (roles[0]?.role_id ?? ''),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role_id: roles[0]?.role_id ? String(roles[0].role_id) : '',
      });
    }
  }, [employee, isOpen, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      role_id: parseInt(formData.role_id, 10),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add New Employee'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Jane Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="jane@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Select
          label="Role"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          required
          placeholder="Select role..."
          options={roles.map((r) => ({ value: r.role_id, label: r.role_name }))}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
