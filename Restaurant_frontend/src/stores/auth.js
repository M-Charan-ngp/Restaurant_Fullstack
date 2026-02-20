import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { AuthService } from '@/services/api_services'

export const useAuthStore = defineStore('auth', () => {
    // Reactive State
    const token = ref(Cookies.get('auth_token') || null)
    const user = ref(null)
    const themeColor = ref(localStorage.getItem('app_theme') || '#1976D2') // Default Vuetify Blue
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    
    const isCustomer = computed(() => Number(user.value?.role) === 1)
    const isStaff = computed(() => Number(user.value?.role) === 2)
    const isAdmin = computed(() => Number(user.value?.role) === 3)

    const decodeAndSetUser = (tokenValue) => {
        try {
            const decoded = jwtDecode(tokenValue)
            user.value = decoded
        } catch (e) {
            console.error("Token decoding failed", e)
            logout()
        }
    }


    const init = () => {
        if (token.value) {
            decodeAndSetUser(token.value)
        }
    }


    const saveLogin = (newToken) => {
        if (typeof newToken !== 'string') return
        
        token.value = newToken
        Cookies.set('auth_token', newToken, { expires: 7, sameSite: 'strict' })
        decodeAndSetUser(newToken)
    }

    const login = async (credentials) => {
        try {
            const response = await AuthService.login(credentials)
            const data = response.data
            
            const tokenReceived = data.token || data.data?.token
            
            if (!tokenReceived) {
                return { success: false, error: "Token not received" }
            }
            
            saveLogin(tokenReceived)
            return { success: true, user: user.value }
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Login failed" 
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await AuthService.signup(userData)
            return { success: true, message: response.data?.message || 'Success' }
        } catch (err) {
            let message = "Registration failed"
            if (err.response?.status === 422 || err.response?.status === 400) {
                message = err.response.data?.message || "Input validation failed"
            }
            return { success: false, error: message }
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        Cookies.remove('auth_token')
        
        window.location.href = '/login'
    }
    const setTheme = (color) => {
        themeColor.value = color
        localStorage.setItem('app_theme', color)
    }

    init()

    return {
        // State
        token,
        user,
        themeColor,
        isAuthenticated,
        isCustomer,
        isStaff,
        isAdmin,
        login,
        register,
        logout,
        setTheme,
        init
    }
})