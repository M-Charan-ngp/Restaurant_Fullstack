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
      <v-col v-for="table in tableStore.tables" :key="table.id" cols="12" sm="3">
        <v-card border elevation="0" rounded="lg" class="text-center pa-4">
          <v-icon size="48" color="primary" class="mb-2">mdi-table-chair</v-icon>
          <div class="text-h6">Table {{ table.tableNumber }}</div>
          <div class="text-body-2 text-grey">Seats: {{ table.capacity }}</div>
          <v-card-actions class="justify-center mt-2">
            <v-btn variant="text" size="small" color="info" @click="openEdit(table)">Edit</v-btn>
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