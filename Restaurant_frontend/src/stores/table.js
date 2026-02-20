import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AdminService } from '@/services/api_services'

export const useTableStore = defineStore('table', () => {
    const tables = ref([])
    const loading = ref(false)

    const fetchTables = async (page = 1) => {
        loading.value = true
        try {
            const response = await AdminService.getTables(page)
            tables.value = response.data.data
            return { success: true }
        } catch (err) {
            return { success: false, error: "Failed to load tables" }
        } finally {
            loading.value = false
        }
    }

    const addTable = async (payload) => {
        loading.value = true
        try {
            await AdminService.createTable(payload)
            await fetchTables()
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Error adding table" }
        } finally {
            loading.value = false
        }
    }

    const updateTable = async (id, payload) => {
        loading.value = true
        try {
            await AdminService.updateTable(id, payload)
            await fetchTables()
            return { success: true }
        } catch (err) {
            return { success: false, error: "Update failed" }
        } finally {
            loading.value = false
        }
    }

    return { tables, loading, fetchTables, addTable, updateTable }
})