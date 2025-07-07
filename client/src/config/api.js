// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://us-central1-capstone-3cc59.cloudfunctions.net/api'
  : 'http://localhost:3001';

export default API_BASE_URL;
