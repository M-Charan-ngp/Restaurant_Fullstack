import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CustomerService, StaffService } from '@/services/api_services'

export const useReservationStore = defineStore('reservation', () => {
    const availableTables = ref([])
    const myReservations = ref([])
    const staffReservations = ref([])
    const loading = ref(false)
    const pagination = ref({
        total: 0,
        currentPage: 1,
        lastPage: 1
    })
    
    const getAvailableTables = async (params) => {
        loading.value = true
        try {
            const response = await CustomerService.checkAvailability(params)
            availableTables.value = response.data
            return { success: true }
        } catch (err) {
            return { success: false, error: "Failed to fetch availability" }
        } finally {
            loading.value = false
        }
    }

    const createBooking = async (payload) => {
        loading.value = true
        try {
            const response = await CustomerService.bookTable(payload)
            return { success: true, data: response.data }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Booking failed" }
        } finally {
            loading.value = false
        }
    }

    const fetchMyReservations = async (page = 1) => {
        loading.value = true
        try {
            const response = await CustomerService.getMyReservations(page)
            myReservations.value = response.data.data
            pagination.value = response.data.meta
        } finally {
            loading.value = false
        }
    }

    const fetchStaffReservations = async (date, page = 1) => {
        loading.value = true
        try {
            const pageToFetch = typeof page === 'number' ? page : 1
            const limitToFetch = typeof limit === 'number' ? limit: 10
            const response = await StaffService.getReservations(date, pageToFetch,limitToFetch)
            staffReservations.value = response.data.data
            pagination.value = response.data.meta
        } finally {
            loading.value = false
        }
    }

    const updateStatus = async (id, status) => {
        try {
            await StaffService.updateReservationStatus(id, status)
            
            return { success: true }
        } catch (err) {
            return { success: false, error: "Failed to update status" }
        }
    }

    return {

        availableTables,
        myReservations,
        staffReservations,
        loading,
        pagination,

        getAvailableTables,
        createBooking,
        fetchMyReservations,
        fetchStaffReservations,
        updateStatus
    }
})