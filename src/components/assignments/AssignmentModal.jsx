import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  employees = [],
  projects = [],
  isLoading,
}) {
  const [formData, setFormData] = useState({
    emp_id: '',
    pro_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        emp_id: employees[0]?.emp_id ? String(employees[0].emp_id) : '',
        pro_id: projects[0]?.pro_id ? String(projects[0].pro_id) : '',
      });
    }
  }, [isOpen, employees, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      emp_id: parseInt(formData.emp_id, 10),
      pro_id: parseInt(formData.pro_id, 10),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Employee to Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Employee"
          name="emp_id"
          value={formData.emp_id}
          onChange={handleChange}
          required
          placeholder="Select employee..."
          options={employees.map((e) => ({ value: e.emp_id, label: `${e.name} (${e.email})` }))}
        />

        <Select
          label="Select Project"
          name="pro_id"
          value={formData.pro_id}
          onChange={handleChange}
          required
          placeholder="Select project..."
          options={projects.map((p) => ({ value: p.pro_id, label: p.pro_title }))}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Assign Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
