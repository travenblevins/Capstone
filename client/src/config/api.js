// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://capstone-1-xj60.onrender.com'  // Same domain serves both frontend and backend
  : 'http://localhost:3001';

export { API_BASE_URL };
