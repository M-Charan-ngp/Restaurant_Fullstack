import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CustomerService, StaffService } from '@/services/api_services'

export const useOrderStore = defineStore('order', () => {

    const cart = ref([])
    const myOrders = ref([])
    const kitchenOrders = ref([])
    const loading = ref(false)
    const pagination = ref({
        total: 0,
        currentPage: 1,
        lastPage: 1
    })

    const cartTotal = computed(() => {
        return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    const cartCount = computed(() => {
        return cart.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    const addToCart = (menuItem) => {
        const existingItem = cart.value.find(item => item.id === menuItem.id)
        if (existingItem) {
            existingItem.quantity++
        } else {
            cart.value.push({
                menuItemId: menuItem.id, 
                id: menuItem.id,         
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            })
        }
    }

    const removeFromCart = (itemId) => {
        const index = cart.value.findIndex(item => item.id === itemId)
        if (index !== -1) {
            if (cart.value[index].quantity > 1) {
                cart.value[index].quantity--
            } else {
                cart.value.splice(index, 1)
            }
        }
    }

    const clearCart = () => {
        cart.value = []
    }


    const submitOrder = async (resId) => {
        loading.value = true
        try {
            const payload = {
                reservationId: resId,
                items: cart.value.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity
                }))
            }
            const response = await CustomerService.placeOrder(payload)
            clearCart()
            return { success: true, data: response.data }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Failed to place order" }
        } finally {
            loading.value = false
        }
    }

    const fetchMyOrders = async (page = 1) => {
        loading.value = true
        try {
            const response = await CustomerService.getMyOrders(page)
            myOrders.value = response.data.data
            pagination.value = response.data.meta
        } finally {
            loading.value = false
        }
    }

    const fetchKitchenQueue = async (page = 1) => {
        loading.value = true
        try {
            const response = await StaffService.getKitchenOrders(page)
            kitchenOrders.value = response.data.data
            pagination.value = response.data.meta
        } finally {
            loading.value = false
        }
    }

    const updateProgress = async (orderId, status) => {
        try {
            await StaffService.updateOrderStatus(orderId, status)

            const order = kitchenOrders.value.find(o => o.id === orderId)
            if (order) order.status = status
            return { success: true }
        } catch (err) {
            return { success: false, error: "Status update failed" }
        }
    }

    return {

        cart,
        myOrders,
        kitchenOrders,
        loading,
        pagination,

        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        submitOrder,
        fetchMyOrders,
        fetchKitchenQueue,
        updateProgress
    }
})