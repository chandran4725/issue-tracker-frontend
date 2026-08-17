import { apiRequest } from './client';

export const issueApi = {
  getAll: () => apiRequest('/api/issues'),
  getById: (id) => apiRequest(`/api/issues/${id}`),
  create: (data) => apiRequest('/api/issues', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/api/issues/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/api/issues/${id}`, { method: 'DELETE' }),
};
