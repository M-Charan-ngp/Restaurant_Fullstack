import { useAuthStore } from "../stores/auth"

export function authMiddleware(to, from, next) {
    const authStore = useAuthStore()
    const currentTime = Math.floor(Date.now() / 1000)

    if (!authStore.token) {
        return next('/login')
    }

    if (authStore.user && authStore.user.exp < currentTime) {
        alert("Your session has expired. Please log in again.")
        authStore.logout() 
        return next('/login')
    }

    next()
}

export function adminMiddleware(to, from, next) {
    const authStore = useAuthStore()
    
    if (authStore.user?.role !== 3) {
        alert("Access Denied: Admin privileges required.")
        return next(authStore.user?.role === 2 ? '/staff/reservations' : '/menu')
    }

    next()
}

export function staffMiddleware(to, from, next) {
    const authStore = useAuthStore()
    if (authStore.user?.role < 2) {
        alert("Access Denied: Staff access only.")
        return next('/menu')
    }
    next()
}