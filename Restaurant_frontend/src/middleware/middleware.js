import { useAuthStore } from "../stores/auth"
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
export function authMiddleware(to, from, next) {
    const authStore = useAuthStore()
    const currentTime = Math.floor(Date.now() / 1000)

    if (!authStore.token) {
        $toast.error("Please Login to access the page",{position:"top-right"})
        return next('/login')
    }

    if (authStore.user && authStore.user.exp < currentTime) {
        $toast.error("Your session has expired. Please log in again.",{position:"top-right"})
        authStore.logout() 
        return next('/login')
    }

    next()
}

export function adminMiddleware(to, from, next) {
    const authStore = useAuthStore()
    
    if (authStore.user?.role !== 3) {
        $toast.warning("Access Denied: Admin privileges required.",{position:"top-right"})
        return next(authStore.user?.role === 2 ? '/staff/reservations' : '/menu')
    }
    next()
}

export function staffMiddleware(to, from, next) {
    const authStore = useAuthStore()
    if (authStore.user?.role < 2) {
        $toast.warning("Access Denied: Staff access only.",{position:"top-right"})
        return next('/menu')
    }
    next()
}