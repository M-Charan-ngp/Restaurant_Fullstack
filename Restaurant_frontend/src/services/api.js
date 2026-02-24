
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/auth'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  const authStore = useAuthStore()
  const currentTime = Math.floor(Date.now() / 1000)
  if (token) {
    if (authStore.user?.exp && authStore.user.exp < currentTime) {
      authStore.logout()
      alert("Session expired. Redirecting...")
      window.location.href = '/login'
      return Promise.reject('Token Expired')
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
        const { response } = error;
        const authStore = useAuthStore(); 
        if (response) {
            switch (response.status) {
                case 401:
                    const backendMessage = response.data?.error || "Unauthorized access";
                    console.warn(`Auth Error: ${backendMessage}`);

                    if (backendMessage.includes("API Key")) {
                        console.error("Critical: API Key issue detected.");
                    }
                    authStore.logout(); 
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    alert("Backend Access Denied: You do not have permission for this.");
                    break;

                case 404:
                    alert("Backend: The accessed resource not found")
                    console.error("Backend: Resource not found (404).");
                    break;

                case 422:
                    alert("Backend: Validation Failed (422).");
                    console.error("Validation failed:", response.data.errors);
                    break;

                case 500:
                    alert("Backend: Internal Server Error (500)).");
                    alert("Backend: Internal Server Error (500).");
                    break;
            }
        } else {
            alert("Network error.");
        }
        return Promise.reject(error);
    },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token')
    }
    return Promise.reject(error)
  }
)

export default api