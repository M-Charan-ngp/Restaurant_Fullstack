import api from './api'

export const AuthService = {
  signup: (payload) => api.post('/signup', payload),
  login: (credentials) => api.post('/login', credentials),
}

export const PublicService = {
  getMenu: () => api.get('customer/menu'),
}

export const CustomerService = {
  checkAvailability: (params) => api.get('/customer/availability', { params }),
  bookTable: (payload) => api.post('/customer/reservations', payload),
  getMyReservations: (page = 1) => api.get(`/customer/my-reservations?page=${page}`),
  placeOrder: (payload) => api.post('/customer/orders', payload),
  cancelOrder: (orderId) => api.patch(`/customer/orders/${orderId}/cancel`),
  getMyOrders: (page = 1) => api.get(`/customer/my-orders?page=${page}`),
}

export const StaffService = {
  getReservations: (date, page = 1) => 
    api.get(`/staff/reservations`, { params: { date, page } }),
  updateReservationStatus: (id, status) => 
    api.patch(`/staff/reservations/${id}/status`, { status }),
  getKitchenOrders: (page = 1) => api.get(`/staff/kitchen/orders?page=${page}`),
  ViewMenu: (pageNumber = 1) => {
    return api.get('/staff/menu', { 
      params: { 
        page: pageNumber 
      } 
    })
  },
  updateOrderStatus: (id, status) => 
    api.patch(`/staff/orders/${id}/status`, { status }),
  toggleMenuAvailability: (id) => api.patch(`/staff/menu/${id}/toggle`),
}

export const AdminService = {
  createMenuItem: (payload) => api.post('/admin/menu', payload),
  updateMenuItem: (id, payload) => api.patch(`/admin/menu/${id}`, payload),
  getTables: (page = 1) => api.get(`/admin/tables?page=${page}`),
  createTable: (payload) => api.post('/admin/tables', payload),
  updateTable: (id, payload) => api.patch(`/admin/tables/${id}`, payload),
}