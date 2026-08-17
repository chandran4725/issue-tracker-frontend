import React, { useEffect, useState } from 'react';
import { projectApi } from '../../api/projectApi';
import { issueApi } from '../../api/issueApi';
import { employeeApi } from '../../api/employeeApi';
import { StatCard } from '../common/StatCard';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { FolderKanban, Bug, Users, CheckCircle2, Clock, Plus } from 'lucide-react';

export function DashboardView({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projData, issueData, empData] = await Promise.all([
        projectApi.getAll().catch(() => []),
        issueApi.getAll().catch(() => []),
        employeeApi.getAll().catch(() => []),
      ]);
      setProjects(projData || []);
      setIssues(issueData || []);
      setEmployees(empData || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating dashboard statistics..." />;
  }

  const openIssuesCount = issues.filter((i) => i.status === 'PENDING' || i.status === 'IN_PROGRESS').length;
  const completedIssuesCount = issues.filter((i) => i.status === 'COMPLETED' || i.status === 'CLOSED').length;
  const recentIssues = issues.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          color="blue"
          trend={`${projects.length} active initiatives`}
        />
        <StatCard
          title="Open Issues"
          value={openIssuesCount}
          icon={Clock}
          color="amber"
          trend="Needs resolution"
        />
        <StatCard
          title="Completed Issues"
          value={completedIssuesCount}
          icon={CheckCircle2}
          color="emerald"
          trend="Resolved bugs & tasks"
        />
        <StatCard
          title="Team Members"
          value={employees.length}
          icon={Users}
          color="purple"
          trend="Active employees"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Issues */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-brand-600" />
                  <span>Recent Issues</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigate('issues')}>
                  View All
                </Button>
              </div>
            }
          >
            {recentIssues.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No issues recorded yet. Create your first issue!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentIssues.map((issue) => (
                  <div key={issue.issue_id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{issue.issue_title}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{issue.issue_desc}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={issue.status}>{issue.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Quick Actions & Status Breakdown */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card header="Quick Shortcuts">
            <div className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                icon={Plus}
                onClick={() => onNavigate('issues')}
              >
                Report New Issue
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                icon={Plus}
                onClick={() => onNavigate('projects')}
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                icon={Plus}
                onClick={() => onNavigate('employees')}
              >
                Add Employee
              </Button>
            </div>
          </Card>

          {/* Project Progress Overview */}
          <Card header="Active Projects">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active projects</p>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 4).map((p) => (
                  <div key={p.pro_id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{p.pro_title}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Start: {p.start_date}</span>
                      <span>Deadline: {p.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
