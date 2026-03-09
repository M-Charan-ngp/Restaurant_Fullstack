<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
const orderStore = useOrderStore()
const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(true)
const showUploadDialog = ref(false)
const selectedFile = ref(null)
const isUploading = ref(false)

onMounted(async () => {
  if (authStore.token && !authStore.user?.profilePicture) {
    await authStore.fetchFreshUser()
  }
})
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
    routes.push({ title: 'Live Queue', icon: 'mdi-chef-hat', to: '/staff/live' })
  }

  if (authStore.isAdmin) {
    routes.push({ title: 'Manage Tables', icon: 'mdi-table-chair', to: '/admin/tables' })
    routes.push({ title: 'Edit Menu', icon: 'mdi-pencil-box-multiple', to: '/admin/menu' })
  }
  return routes
})
const uploadPhoto = async () => {
  // Grab the file correctly (handles both array and single file)
  const file = Array.isArray(selectedFile.value) 
    ? selectedFile.value[0] 
    : selectedFile.value

  if (!file) {
    console.error("No file selected or file structure is wrong")
    return
  }
  
  isUploading.value = true // Ensure this is .value
  const formData = new FormData()
  formData.append('profile_picture', file)

  try {
    const result = await authStore.updateProfilePic(formData)
    
    if (result.success) {
      showUploadDialog.value = false
      selectedFile.value = null
      $toast.success("Profile picture updated!")
    } else {
      $toast.error(result.error)
    }
  } catch (error) {
    console.error("Critical error in uploadPhoto:", error)
  } finally {
    isUploading.value = false
  }
}
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
      <v-menu v-if="authStore.isAuthenticated" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mr-2">
            <v-avatar size="32" color="secondary">
              <v-img 
                v-if="authStore.user?.profilePicture" 
                :src="authStore.user.profilePicture"
                alt="Profile"
              ></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list width="250">
          <v-list-item class="text-center py-4">
            <v-avatar size="40" color="secondary">
              <v-img 
                v-if="authStore.user?.profilePicture" 
                :src="authStore.user.profilePicture"
                cover
                alt="Profile"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
            <v-list-item-title class="font-weight-bold">
              {{ authStore.user?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item 
            prepend-icon="mdi-camera" 
            title="Update Photo" 
            @click="showUploadDialog = true"
          ></v-list-item>

          <v-list-item 
            prepend-icon="mdi-logout" 
            title="Logout" 
            color="error"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>

      <v-dialog v-model="showUploadDialog" max-width="400">
        <v-card>
          <v-card-title>Update Profile Picture</v-card-title>
          <v-card-text>
            <v-file-input
              v-model="selectedFile"
              label="Select Image"
              accept="image/*"
              prepend-icon="mdi-image"
              variant="outlined"
              :loading="isUploading"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showUploadDialog = false">Cancel</v-btn>
            <v-btn 
              color="primary" 
              :disabled="!selectedFile" 
              :loading="isUploading"
              @click="uploadPhoto"
            >Upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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