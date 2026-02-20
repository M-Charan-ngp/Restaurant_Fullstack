import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PublicService, AdminService, StaffService } from '@/services/api_services'

export const useMenuStore = defineStore('menu', () => {

    const items = ref([])
    const categories = ref(['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'])
    const selectedCategory = ref('All')
    const loading = ref(false)
    const pagination = ref({
        total: 0,
        perPage: 15,
        currentPage: 1,
        lastPage: 1
    })
    
    const updateMenuItem = async (id, payload) => {
        loading.value = true
        try {
            await AdminService.updateMenuItem(id, payload)
            await fetchMenu(pagination.value.currentPage) // Refresh current page data
            return { success: true }
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Failed to update item" 
            }
        } finally {
            loading.value = false
        }
    }
    const filteredItems = computed(() => {
        if (selectedCategory.value === 'All') return items.value
        return items.value.filter(item => item.category === selectedCategory.value)
    })


    const fetchMenu = async (page = 1) => {
        loading.value = true
        try {
            const response = await PublicService.getMenu(page)
            const { data, meta } = response.data
            
            items.value = data
            pagination.value = meta
            return { success: true }
        } catch (err) {
            console.error("Menu fetch failed", err)
            return { success: false, error: "Could not load menu" }
        } finally {
            loading.value = false
        }
    }
const fetchMenuforStaff = async (page = 1) => {
    loading.value = true
    try {
        const pageToFetch = typeof page === 'number' ? page : 1
        
        const response = await StaffService.ViewMenu(pageToFetch)
        
        if (response && response.data) {
            items.value = response.data.data
            pagination.value = response.data.meta || pagination.value
        }
        
        return { success: true }
    } catch (err) {
        console.error("Staff menu fetch failed", err)
        return { success: false, error: err.message }
    } finally {
        loading.value = false
    }
}


    const addMenuItem = async (payload) => {
        loading.value = true
        try {
            await AdminService.createMenuItem(payload)
            await fetchMenu() 
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Failed to add item" }
        } finally {
            loading.value = false
        }
    }

    const toggleAvailability = async (id) => {
        try {
            const response = await StaffService.toggleMenuAvailability(id)
            const index = items.value.findIndex(item => item.id === id)
            if (index !== -1) {
                items.value[index].isAvailable = response.data.isAvailable
            }
            return { success: true }
        } catch (err) {
            return { success: false, error: "Update failed" }
        }
    }

    return {

        items,
        categories,
        selectedCategory,
        loading,
        pagination,
        fetchMenuforStaff,
        filteredItems,
        updateMenuItem,

        fetchMenu,
        addMenuItem,
        toggleAvailability
    }
})