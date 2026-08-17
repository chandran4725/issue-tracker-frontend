import { apiRequest } from './client';

export const projectApi = {
  getAll: () => apiRequest('/api/projects'),
  getById: (id) => apiRequest(`/api/projects/${id}`),
  create: (data) => apiRequest('/api/projects', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/api/projects/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/api/projects/${id}`, { method: 'DELETE' }),
};
