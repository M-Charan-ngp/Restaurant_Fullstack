import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware, adminMiddleware, staffMiddleware } from '@/middleware/middleware'

// Layouts
import MainLayout from '@/views/MainPage.vue'
import AuthView from '@/views/AuthView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: AuthView
  },

  {
    path: '/',
    component: MainLayout,
    beforeEnter: [authMiddleware],
    children: [
      {
        path: 'menu',
        name: 'customer-menu',
        component: () => import('@/views/customer/MenuView.vue')
      },
      {
        path: 'book',
        name: 'customer-booking',
        component: () => import('@/views/customer/BookingView.vue')
      },
      {
        path: 'my-reservations',
        name: 'customer-reservations',
        component: () => import('@/views/customer/MyReservations.vue')
      },
      {
        path: 'my-orders',
        name: 'customer-orders',
        component: () => import('@/views/customer/MyOrders.vue')
      },
      {
        path: 'cart',
        name: 'customer-cart',
        component: () => import('@/views/customer/CartView.vue')
      },

      {
        path: 'staff/reservations',
        name: 'staff-reservations',
        beforeEnter: [staffMiddleware],
        component: () => import('@/views/staff/StaffReservations.vue')
      },
      {
        path: 'staff/live',
        name: 'staff-live-orders',
        beforeEnter: [staffMiddleware],
        component: () => import('@/views/staff/LiveQueue.vue')
      },
      {
        path: 'staff/kitchen',
        name: 'staff-kitchen',
        beforeEnter: [staffMiddleware],
        component: () => import('@/views/staff/KitchenQueue.vue')
      },

      {
        path: 'admin/tables',
        name: 'admin-tables',
        beforeEnter: [adminMiddleware],
        component: () => import('@/views/admin/TableManagement.vue')
      },
      {
        path: 'admin/menu',
        name: 'admin-menu',
        beforeEnter: [adminMiddleware],
        component: () => import('@/views/admin/MenuManagement.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router