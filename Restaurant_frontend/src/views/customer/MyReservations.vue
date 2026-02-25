<script setup>
import { onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservation'
import { formatTime,formatDate } from '@/utils/formats'
const resStore = useReservationStore()

onMounted(() => {
  resStore.fetchMyReservations()
})

const getStatusColor = (status) => {
  const map = { pending: 'orange', confirmed: 'blue', arrived: 'green', cancelled: 'red' }
  return map[status] || 'grey'
}
</script>

<template>
  <v-container>
    <h2 class="text-h4 mb-6">My Booking History</h2>

    <v-row v-if="resStore.loading">
      <v-col class="text-center"><v-progress-circular indeterminate /></v-col>
    </v-row>

    <v-expansion-panels v-else-if="resStore.myReservations.length > 0">
      <v-expansion-panel v-for="res in resStore.myReservations" :key="res.id">
        <v-expansion-panel-title>
          <div class="d-flex align-center w-100">
            <span class="font-weight-bold">{{ formatDate(res.reservationDate) }}</span>
            <v-divider vertical class="mx-4" />
            <span>{{ formatTime(res.timeSlot) }}</span>
            <v-spacer />
            <v-chip :color="getStatusColor(res.status)" size="small" class="text-uppercase">
              {{ res.status }}
            </v-chip>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-table-chair">
              Table Number: <strong>{{ res.table?.tableNumber }}</strong>
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-group">
              Size: <strong>{{ res.guestCount }} People</strong>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-empty-state
      v-else
      icon="mdi-calendar-blank"
      title="No Reservations Yet"
    >
      <v-btn color="primary" class="mt-4" to="/book">Book Now</v-btn>
    </v-empty-state>
  </v-container>
</template>