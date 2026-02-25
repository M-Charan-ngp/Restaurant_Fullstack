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
            tables.value = response.data.tables.data
            console.log("table fetched successfully",tables.value)
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
    const toggleTableStatus = async (id) => {
        loading.value = true
        try{
            const response = await AdminService.toggleTableAvailability(id)
            const index = tables.value.findIndex(table => table.id === id)
            if (index !== -1) {
                const newValue = response.data.isAvailable ?? !tables.value[index].isAvailable
                tables.value[index] = { 
                    ...tables.value[index], 
                    isAvailable: newValue
                }
            }
            console.log("table status changed successfully")
            
            return { success: true }

        }catch (err){
            return {success: false, error: err}
        }
        finally{
            loading.value=false
        }
    }

    return { tables, loading, fetchTables, addTable, updateTable, toggleTableStatus }
})