import axios from 'axios'

// Create axios instance with base URL

 const API = axios.create({
  baseURL: 'https://lecture-scheduler-backend-ryfk.onrender.com/api'
})


// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API