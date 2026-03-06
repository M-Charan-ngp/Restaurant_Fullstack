<script setup>
import { ref } from 'vue'
import { useMenuStore } from '@/stores/menu'
import {useToast} from 'vue-toast-notification';
const $toast = useToast();
const menuStore = useMenuStore()
const showDialog = ref(false)
const editMode = ref(false)
const form = ref({ id: null, name: '', category: 'Main Course', price: 0, description: '', isAvailable: true })
const headers = [
  { title: 'Image', key: 'imagePath', sortable: false, width: '80px' },
        { title: 'Dish Name', key: 'name' },
        { title: 'Category', key: 'category' },
        { title: 'Price', key: 'price', align: 'end' },
        { title: 'Status', key: 'isAvailable' },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
      ]
const loadItems = async (options) => {
  await menuStore.fetchMenuforStaff(options.page, options.itemsPerPage)
}
const fileInputRef = ref(null)
const activeItemId = ref(null)

const triggerUpload = (itemId) => {
  activeItemId.value = itemId
  fileInputRef.value.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file || !activeItemId.value) return
  await handleImageUpload(activeItemId.value, file)
  event.target.value = ''
  activeItemId.value = null
}
const uploadingId = ref(null)

const handleImageUpload = async (itemId, file) => {
  if (!file) return
  
  uploadingId.value = itemId
  
  const result = await menuStore.updateMenuItemImage(itemId, file)
  
  if (result.status.success) {
    $toast.success("Image updated successfully")
  } else {
    $toast.error(result.error || "Upload failed")
  }
  
  uploadingId.value = null
}

const openCreate = () => {
  editMode.value = false
  form.value = { id: null, name: '', category: 'Main Course', price: 0, description: '', isAvailable: true }
  showDialog.value = true
}
const openEdit = (item) => {
  editMode.value = true
  form.value = { ...item }
  showDialog.value = true
}

const handleSave = async () => {
  let result
  if (editMode.value) {
    result = await menuStore.updateMenuItem(form.value.id, form.value)
  } else {
    result = await menuStore.addMenuItem(form.value)
  }
  
  if (result.success) showDialog.value = false
  else $toast.error(result.error,{position:"top-right"})
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4">Menu Management</h2>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-plus" color="primary" @click="openCreate">Add Dish</v-btn>
    </div>

    <v-data-table-server
      :headers="headers"
      :items="menuStore.items"
      :loading="menuStore.loading"
      :items-length="menuStore.pagination.total"
      :page="menuStore.pagination.currentPage"
      @update:options="loadItems"
    >
      <template v-slot:item.imagePath="{ item }">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-avatar 
            v-bind="props" 
            size="50" 
            rounded="lg" 
            class="elevation-2 cursor-pointer"
            @click="triggerUpload(item.id)" 
          >
            <v-img v-if="item.imagePath" :src="item.imagePath" cover>
              <v-overlay :model-value="isHovering" contained scrim="black" class="align-center justify-center">
                <v-icon color="white">mdi-camera</v-icon>
              </v-overlay>
            </v-img>
            <v-icon v-else size="30" color="grey-lighten-1">mdi-image-plus</v-icon>
          </v-avatar>
        </v-hover>
      </template>
      <template v-slot:item.price="{ item }">₹{{ item.price }}</template>
      <template v-slot:item.isAvailable="{ item }">
        <v-chip :color="item.isAvailable ? 'success' : 'error'" size="x-small" label>
          {{ item.isAvailable ? 'Available' : 'Not Available' }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" size="small" color="info" @click="openEdit(item)"></v-btn>
        <v-btn 
          :icon="item.isAvailable ? 'mdi-eye-off' : 'mdi-eye'" 
          variant="text" 
          size="small" 
          :color="item.isAvailable ? 'warning' : 'success'"
          @click="menuStore.toggleAvailability(item.id)"
        ></v-btn>
      </template>
    </v-data-table-server>
    <input
      type="file"
      ref="fileInputRef"
      class="d-none"
      accept="image/*"
      @change="onFileSelected"
    >

    <v-dialog v-model="showDialog" max-width="500">
      <v-card :title="editMode ? 'Edit Dish' : 'New Dish'">
        <v-card-text>
          <v-text-field v-model="form.name" label="Name" variant="outlined" class="mb-2" />
          <v-select v-model="form.category" :items="menuStore.categories" label="Category" variant="outlined" class="mb-2" />
          <v-text-field v-model="form.price" label="Price" type="number" prefix="₹" variant="outlined" class="mb-2" />
          <v-textarea v-model="form.description" label="Description" variant="outlined" rows="3" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handleSave" :loading="menuStore.loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>