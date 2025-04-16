import axios from "axios";
import Cookies from "js-cookie";

console.log('api url -->', import.meta.env.VITE_API_URL);
console.log('VITE_PORT meta import -->', import.meta.env.VITE_PORT);

// Cambia esto por tu backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para adjuntar el token a cada petición
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
