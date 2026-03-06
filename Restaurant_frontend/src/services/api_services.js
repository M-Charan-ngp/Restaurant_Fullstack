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
  uploadProfilePicture: (formData) => api.post('/profile/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  me: () => api.get('/auth/me'),
}

export const StaffService = {
  getReservations: (date, page = 1) => 
    api.get(`/staff/reservations`, { params: { date, page } }),
  updateReservationStatus: (id, status) => 
    api.patch(`/staff/reservations/${id}/status`, { status }),
  getKitchenOrders: (page = 1) => api.get(`/staff/kitchen/orders?page=${page}`),
  ViewMenu: (pageNumber = 1,limit=10) => {
    return api.get('/staff/menu', { 
      params: { 
        page: pageNumber,
        limit:limit
      } 
    })
  },
  updateOrderStatus: (id, status) => 
    api.patch(`/staff/orders/${id}/status`, { status }),
  
}

export const AdminService = {
  createMenuItem: (payload) => api.post('/admin/menu', payload),
  updateMenuItem: (id, payload) => api.patch(`/admin/menu/${id}`, payload),
  getTables: (page = 1) => api.get(`/admin/tables?page=${page}`),
  createTable: (payload) => api.post('/admin/tables', payload),
  updateTable: (id, payload) => api.patch(`/admin/tables/${id}`, payload),
  toggleMenuAvailability: (id) => api.patch(`/admin/menu/${id}/toggle`),
  toggleTableAvailability: (id) => api.patch(`/admin/table/${id}/toggle`),
  uploadMenuImage: (id, formData) => api.post(`/admin/menu/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}