// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://bdce956c916f.ngrok-free.app",
  API_ENDPOINTS: {
    LOGIN: "/api/users/login",
    USERS: "/api/users",
    USERS_REGISTER: "/api/users/register",
    ROLE_COUNTS: "/api/users/role-counts",
    LAPORAN: "/api/laporan",
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export BASE_URL for backward compatibility
export const BASE_URL = API_CONFIG.BASE_URL; 