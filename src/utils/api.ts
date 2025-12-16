// API utility functions
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

// Helper function for authenticated API calls
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  
  return fetch(apiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
};