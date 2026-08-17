const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let tokenGetter = null;
let activeUserEmail = null;

/**
 * Register a dynamic token getter function (e.g. Clerk getToken)
 */
export function setTokenGetter(getter) {
  tokenGetter = getter;
}

/**
 * Register active user email header for Clerk synchronization
 */
export function setActiveUserEmail(email) {
  activeUserEmail = email;
}

/**
 * Core HTTP Request Wrapper (SOLID - Single Responsibility & Dependency Inversion)
 * Encapsulates base API logic, response parsing, Authorization Bearer token injection, and error formatting.
 */
export async function apiRequest(endpoint, options = {}) {
  const { body, headers = {}, ...customConfig } = options;

  let authHeaders = {};
  if (typeof tokenGetter === 'function') {
    try {
      const token = await tokenGetter();
      if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Unable to retrieve Clerk session token:', err);
    }
  }

  if (activeUserEmail) {
    authHeaders['X-User-Email'] = activeUserEmail;
  }

  const config = {
    method: customConfig.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 204 No Content handling
    if (response.status === 204) {
      return true;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `HTTP Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${config.method} ${endpoint}]:`, error);
    throw error;
  }
}
