import React, { useState, useEffect } from 'react';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ProjectModal } from './ProjectModal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, Search, Calendar, Edit3, Trash2, FolderKanban } from 'lucide-react';

export function ProjectListView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { canManageProjects } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAll();
      setProjects(data || []);
    } catch (err) {
      notifyError('Failed to fetch projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    try {
      if (editingProject) {
        await projectApi.update(editingProject.pro_id, formData);
        notifySuccess('Project updated successfully!');
      } else {
        await projectApi.create(formData);
        notifySuccess('Project created successfully!');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      notifyError(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (proId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectApi.delete(proId);
      notifySuccess('Project deleted');
      fetchProjects();
    } catch (err) {
      notifyError(err.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.pro_title.toLowerCase().includes(search.toLowerCase()) ||
      p.pro_desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search projects by title or description..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {canManageProjects && (
          <Button
            icon={Plus}
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching projects..." />
      ) : filteredProjects.length === 0 ? (
        <Card className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search ? 'Try adjusting your search criteria.' : 'No project initiatives found for your account.'}
          </p>
          {!search && canManageProjects && (
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
              }}
            >
              Create Project
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.pro_id}
              className="flex flex-col justify-between"
              header={
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1">
                    {project.pro_title}
                  </h3>
                  {canManageProjects && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.pro_id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              }
            >
              <p className="text-sm text-slate-600 line-clamp-3 mb-6">{project.pro_desc}</p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start: {project.start_date}</span>
                </div>
                <div className="font-medium text-slate-700">
                  <span>Due: {project.deadline}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        project={editingProject}
        isLoading={isSaving}
      />
    </div>
  );
}
