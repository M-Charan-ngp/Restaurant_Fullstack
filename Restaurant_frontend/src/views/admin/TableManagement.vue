<script setup>
import { onMounted, ref } from 'vue'
import { useTableStore } from '@/stores/table'

const tableStore = useTableStore()
const showDialog = ref(false)
const editMode = ref(false)
const form = ref({ id: null, tableNumber: '', capacity: 2 })

onMounted(() => tableStore.fetchTables())

const openCreate = () => {
  editMode.value = false
  form.value = { id: null, tableNumber: '', capacity: 2 }
  showDialog.value = true
}

const openEdit = (table) => {
  editMode.value = true
  form.value = { ...table }
  showDialog.value = true
}

const handleSave = async () => {
  let result
  if (editMode.value) {
    result = await tableStore.updateTable(form.value.id, form.value)
  } else {
    result = await tableStore.addTable(form.value)
  }
  
  if (!result?.error) showDialog.value = false
  else alert(result.error)
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4">Table Settings</h2>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-plus" color="primary" @click="openCreate">Add Table</v-btn>
    </div>

    <v-row v-if="tableStore.loading">
      <v-col v-for="n in 4" :key="n" cols="12" sm="3">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

   <v-row v-else>
  <v-col
    v-for="table in tableStore.tables"
    :key="table.id"
    cols="12"
    sm="6"
    md="4"
    lg="3"
  >
    <v-card elevation="2" rounded="lg" class="pa-4">
      <div class="d-flex justify-space-between align-center mb-3">
        <div class="text-h6">
          {{ table.tableNumber }}
        </div>
        <v-chip
          size="small"
          :color="table.isAvailable ? 'success' : 'error'"
          variant="tonal"
        >
          {{ table.isAvailable ? 'Available' : 'Unavailable' }}
        </v-chip>
      </div>
      <div class="text-center my-3">
        <v-icon size="40" color="primary">
          mdi-table-chair
        </v-icon>
      </div>
      <div class="text-body-2 text-center text-grey-darken-1 mb-4">
        Seats: {{ table.capacity }}
      </div>
      <v-card-actions class="justify-space-between pa-0">
        <v-btn
          variant="text"
          size="small"
          color="info"
          @click="openEdit(table)"
        >
          Edit
        </v-btn>
        <v-btn
          variant="tonal"
          size="small"
          :color="table.isAvailable ? 'warning' : 'success'"
          @click="tableStore.toggleTableStatus(table.id)"
        >
          Toggle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</v-row>

    <v-dialog v-model="showDialog" max-width="400">
      <v-card :title="editMode ? 'Update Table' : 'Create New Table'">
        <v-card-text>
          <v-text-field v-model="form.tableNumber" label="Number" placeholder="e.g., T-10" variant="outlined" />
          <v-text-field v-model="form.capacity" label="Capacity" type="number" variant="outlined" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handleSave" :loading="tableStore.loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>