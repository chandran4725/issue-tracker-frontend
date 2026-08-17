import { apiRequest } from './client';

export const employeeApi = {
  getAll: () => apiRequest('/api/employee'),
  getById: (id) => apiRequest(`/api/employee/${id}`),
  create: (data) => apiRequest('/api/employee', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/api/employee/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/api/employee/${id}`, { method: 'DELETE' }),
  syncClerk: (email, name) => apiRequest('/api/employee/sync-clerk', { method: 'POST', body: { email, name } }),
};
