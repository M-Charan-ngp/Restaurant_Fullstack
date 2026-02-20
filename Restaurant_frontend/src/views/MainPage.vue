<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
const orderStore = useOrderStore()
const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(true)

const menuItems = computed(() => {
  const routes = []

  if (authStore.isCustomer) {
    routes.push({ title: 'Menu', icon: 'mdi-silverware-fork-knife', to: '/menu' })
    routes.push({ title: 'Book a Table', icon: 'mdi-calendar-check', to: '/book' })
    routes.push({ title: 'My Reservations', icon: 'mdi-history', to: '/my-reservations' })
    routes.push({ title: 'My Orders', icon: 'mdi-receipt', to: '/my-orders' })
  }

  if (authStore.isStaff) {
    routes.push({ title: 'Reservations', icon: 'mdi-clipboard-list', to: '/staff/reservations' })
    routes.push({ title: 'Kitchen Queue', icon: 'mdi-chef-hat', to: '/staff/kitchen' })
  }

  if (authStore.isAdmin) {
    routes.push({ title: 'Manage Tables', icon: 'mdi-table-chair', to: '/admin/tables' })
    routes.push({ title: 'Edit Menu', icon: 'mdi-pencil-box-multiple', to: '/admin/menu' })
  }

  return routes
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <v-app :style="{ '--v-theme-primary': authStore.themeColor }">
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Restaurant Reservation system</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-btn icon to="/cart" v-if="authStore.isCustomer"> <v-badge 
            :content="orderStore.cartCount" 
            :model-value="orderStore.cartCount > 0" 
            color="error"
        >
                <v-icon>mdi-cart</v-icon>
        </v-badge>
        </v-btn>
      <v-menu v-if="authStore.isAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>