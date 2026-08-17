import { apiRequest } from './client';

export const roleApi = {
  getAll: () => apiRequest('/api/roles'),
  getById: (id) => apiRequest(`/api/roles/${id}`),
  create: (data) => apiRequest('/api/roles', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/api/roles/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/api/roles/${id}`, { method: 'DELETE' }),
};
