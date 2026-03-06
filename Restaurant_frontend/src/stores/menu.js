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
        limit: 10,
        currentPage: 1,
        lastPage: 1
    })
    
    const updateMenuItem = async (id, payload) => {
        loading.value = true
        try {
            await AdminService.updateMenuItem(id, payload)
            await fetchMenuforStaff(pagination.value.currentPage, pagination.value.limit) 
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
            const { data, meta } = response.data.items
            
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
const fetchMenuforStaff = async (page = 1,limit=10) => {
    loading.value = true
    try {
        const pageToFetch = typeof page === 'number' ? page : 1
        const limitToFetch = typeof limit === 'number' ? limit: 10
        
        const response = await StaffService.ViewMenu(pageToFetch,limitToFetch)
        if (response && response.data) {
            const { data, meta } = response.data.items
            items.value = data
            pagination.value.total = meta.total
            pagination.value.limit = meta.perPage
            pagination.value.currentPage = meta.currentPage
            pagination.value.lastPage = meta.lastPage
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
            await fetchMenuforStaff(pagination.value.currentPage, pagination.value.limit) 
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Failed to add item" }
        } finally {
            loading.value = false
        }
    }

    const toggleAvailability = async (id) => {
        try {
            const response = await AdminService.toggleMenuAvailability(id)
            const index = items.value.findIndex(item => item.id === id)
            if (index !== -1) {
                const newValue = response.data.isAvailable ?? !items.value[index].isAvailable
                items.value[index] = { 
                    ...items.value[index], 
                    isAvailable: newValue
                }
            }
            return { success: true }
        } catch (err) {
            return { success: false, error: "Update failed" }
        }
    }
    const updateMenuItemImage = async (id, file) => {
    try {
        const formData = new FormData()
        formData.append('menu_image', file)

        const response = await AdminService.uploadMenuImage(id, formData)
        
        if (response.data.status) {
            const index = menuItems.value.findIndex(item => item.id === id)
            if (index !== -1) {
                menuItems.value[index] = response.data.user 
            }
            return { success: true }
        }
    } catch (err) {
        return { 
            success: false, 
            error: err.response?.data?.message || "Image upload failed" 
        }
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
        updateMenuItemImage,
        fetchMenu,
        addMenuItem,
        toggleAvailability
    }
})