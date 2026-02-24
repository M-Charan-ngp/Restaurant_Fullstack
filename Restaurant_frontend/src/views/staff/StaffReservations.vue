<script setup>
import { ref, onMounted, watch } from 'vue'
import { useReservationStore } from '@/stores/reservation'

const reservationStore = useReservationStore()
const selectedDate = ref(new Date().toISOString().substr(0, 10))
const statuses = ['pending', 'confirmed', 'arrived', 'cancelled', 'completed']
const headers = [
        { title: 'Time', key: 'timeSlot' },
        { title: 'Customer', key: 'user.fullName' },
        { title: 'Table', key: 'table.tableNumber' },
        { title: 'Guests', key: 'guestCount' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
const loadData = () => {
  reservationStore.fetchStaffReservations(selectedDate.value)
}
onMounted(loadData)
watch(selectedDate, loadData)

const updateStatus = async (id, status) => {
  const res = await reservationStore.updateStatus(id, status)
  if (res.success) loadData()
}
</script>

<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="4">
        <h2 class="text-h4">Daily Bookings</h2>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="selectedDate" type="date" label="Filter by Date" density="compact" hide-details />
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="reservationStore.staffReservations"
      :loading="reservationStore.loading"
      :items-length="reservationStore.pagination.total"
      :page="reservationStore.pagination.currentPage"
      @update:options="loadItems"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === 'arrived' ? 'green' : 'blue'" size="small">
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="status in statuses" :key="status" @click="updateStatus(item.id, status)">
              <v-list-item-title class="text-capitalize">{{ status }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table-server>
  </v-container>
</template>