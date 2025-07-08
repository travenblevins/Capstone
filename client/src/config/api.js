// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://capstone-backend-render.onrender.com'  // Your actual Render backend URL
  : 'http://localhost:3001';

export { API_BASE_URL };
