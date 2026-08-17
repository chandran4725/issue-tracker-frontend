import { apiRequest } from './client';

export const assignmentApi = {
  getAll: () => apiRequest('/api/assignments'),
  getById: (empId, proId) => apiRequest(`/api/assignments/${empId}/${proId}`),
  create: (data) => apiRequest('/api/assignments', { method: 'POST', body: data }),
  delete: (empId, proId) => apiRequest(`/api/assignments/${empId}/${proId}`, { method: 'DELETE' }),
};
