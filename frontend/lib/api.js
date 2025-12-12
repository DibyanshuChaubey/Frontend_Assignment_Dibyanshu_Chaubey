import axios from 'axios'


// Create a centralized Axios instance for all API calls.
// This keeps API logic in one place instead of scattered throughout components.
const API = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
withCredentials: true,  // Allow cookies if we switch to httpOnly cookies in the future.
})


// Intercept requests to add the JWT token from localStorage.
// This way, every request automatically includes "Authorization: Bearer <token>".
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})


export default API