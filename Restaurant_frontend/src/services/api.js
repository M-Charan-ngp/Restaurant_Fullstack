
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/auth'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
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
      $toast.error("Session expired. Redirecting...",{position:"top-right"})
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
                        $toast.error("Session expired. Redirecting...",{position:"top-right"})   
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    $toast.error("Backend Access Denied: You do not have permission for this.",{position:"top-right"});
                    break;

                case 404:
                    $toast.error("Backend: The accessed resource not found",{position:"top-right"})
                    console.error("Backend: Resource not found (404).");
                    break;

                case 422:
                    $toast.error(`Backend: Validation Failed (422).${response.data.errors}`,{position:"top-right"});
                    console.error("Validation failed:", response.data.errors);
                    break;

                case 500:
                    $toast.error("Backend: Internal Server Error (500)).",{position:"top-right"});
                    break;
            }
        } else {
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