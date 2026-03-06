import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { AuthService } from '@/services/api_services'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { CustomerService } from '@/services/api_services'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(Cookies.get('auth_token') || null)
    const user = ref(null)
    const themeColor = ref(localStorage.getItem('app_theme') || '#1976D2')
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    let refreshPromise = null
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
    


    const fetchFreshUser = async () => {
        if (refreshPromise) return refreshPromise
        refreshPromise = (async () => {
            try {
                const response = await CustomerService.me()
                if (response.data.status) {
                    user.value = { ...user.value, ...response.data.user }
                }
            } catch (err) {
                console.error("Refresh failed", err)
            } finally {
                refreshPromise = null
            }
        })()

        return refreshPromise
    }

    const init = async () => {
        if (token.value) {
            decodeAndSetUser(token.value)
            await fetchFreshUser()
        }
    }
    


    const saveLogin = (newToken) => {
        if (typeof newToken !== 'string') return
        
        token.value = newToken
        Cookies.set('auth_token', newToken, { expires: 1, sameSite: 'strict' })
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
        //$toast.error("Please Login to access the page",{position:"top-right"})
        window.location.href = '/login'
    }
    const setTheme = (color) => {
        themeColor.value = color
        localStorage.setItem('app_theme', color)
    }
    const updateProfilePic = async (formData) => {
        try {
            const response = await CustomerService.uploadProfilePicture(formData)
            if (response.data.status) {
                user.value = { ...user.value, ...response.data.user }
                return { success: true }
            }
            return { success: false, error: "Upload failed" }
        } catch (err) {
            console.error("Axios Error Details:", err)
            return { 
                success: false, 
                error: err.response?.data?.message || "Upload failed" 
            }
        }
    }

    init()

    return {
        // State
        token,
        user,
        themeColor,
        isAuthenticated,
        updateProfilePic,
        isCustomer,
        isStaff,
        isAdmin,
        fetchFreshUser,
        login,
        register,
        logout,
        setTheme,
        init
    }
})