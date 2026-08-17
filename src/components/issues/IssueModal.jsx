import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function IssueModal({
  isOpen,
  onClose,
  onSubmit,
  issue,
  projects = [],
  employees = [],
  isLoading,
}) {
  const [formData, setFormData] = useState({
    issue_title: '',
    issue_desc: '',
    pro_id: '',
    emp_id: '',
    status: 'PENDING',
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        issue_title: issue.issue_title || '',
        issue_desc: issue.issue_desc || '',
        pro_id: issue.pro_id || (projects[0]?.pro_id ?? ''),
        emp_id: issue.emp_id || (employees[0]?.emp_id ?? ''),
        status: issue.status || 'PENDING',
      });
    } else {
      setFormData({
        issue_title: '',
        issue_desc: '',
        pro_id: projects[0]?.pro_id ? String(projects[0].pro_id) : '',
        emp_id: employees[0]?.emp_id ? String(employees[0].emp_id) : '',
        status: 'PENDING',
      });
    }
  }, [issue, isOpen, projects, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pro_id: parseInt(formData.pro_id, 10),
      emp_id: parseInt(formData.emp_id, 10),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={issue ? 'Edit Issue' : 'Create New Issue'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Issue Title"
          name="issue_title"
          placeholder="e.g. Fix authentication timeout bug"
          value={formData.issue_title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Issue Description
          </label>
          <textarea
            name="issue_desc"
            rows={3}
            placeholder="Detailed description of bug or feature task..."
            value={formData.issue_desc}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project"
            name="pro_id"
            value={formData.pro_id}
            onChange={handleChange}
            required
            placeholder="Select project..."
            options={projects.map((p) => ({ value: p.pro_id, label: p.pro_title }))}
          />

          <Select
            label="Assigned Employee"
            name="emp_id"
            value={formData.emp_id}
            onChange={handleChange}
            required
            placeholder="Select assignee..."
            options={employees.map((e) => ({ value: e.emp_id, label: `${e.name} (${e.email})` }))}
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder=""
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {issue ? 'Update Issue' : 'Create Issue'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
