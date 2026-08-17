import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function ProjectModal({ isOpen, onClose, onSubmit, project, isLoading }) {
  const [formData, setFormData] = useState({
    pro_title: '',
    pro_desc: '',
    start_date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        pro_title: project.pro_title || '',
        pro_desc: project.pro_desc || '',
        start_date: project.start_date || '',
        deadline: project.deadline || '',
      });
    } else {
      setFormData({
        pro_title: '',
        pro_desc: '',
        start_date: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Title"
          name="pro_title"
          placeholder="e.g. Mobile Application V2"
          value={formData.pro_title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Project Description
          </label>
          <textarea
            name="pro_desc"
            rows={3}
            placeholder="Describe project objectives and scope..."
            value={formData.pro_desc}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />

          <Input
            label="Deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
