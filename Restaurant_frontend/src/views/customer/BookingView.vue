<script setup>
import { ref, reactive } from 'vue'
import { useReservationStore } from '@/stores/reservation'
import { useRouter } from 'vue-router'

const reservationStore = useReservationStore()
const router = useRouter()

const step = ref(1)
const form = reactive({
  date: new Date().toISOString().substr(0, 10),
  timeSlot: '18:00',
  guestCount: 2,
  tableId: null
})
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

const searchTables = async () => {
  const success = await reservationStore.getAvailableTables({
    date: form.date,
    timeSlot: form.timeSlot,
    guests: form.guestCount
  })
  if (success) step.value = 2
}

const confirmBooking = async () => {
  const res = await reservationStore.createBooking({
    tableId: form.tableId,
    reservationDate: form.date,
    timeSlot: form.timeSlot,
    guestCount: form.guestCount
  })
  if (res.success) {
    alert('Table Reserved Successfully!')
    router.push('/my-reservations')
  } else {
    alert(res.error)
  }
}
</script>

<template>
  <v-container>
    <v-stepper v-model="step" :items="['Find a Table', 'Select Table']" hide-actions>
      <template v-slot:item.1>
        <v-card title="Reserve your table" flat>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.date" label="Date" type="date" variant="outlined" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="form.timeSlot" :items="timeSlots" label="Time" variant="outlined" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.guestCount" label="Guests" type="number" variant="outlined" />
            </v-col>
          </v-row>
          <v-btn block color="primary" @click="searchTables" :loading="reservationStore.loading">
            Check Availability
          </v-btn>
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="Available Tables" flat>
          <v-alert v-if="reservationStore.availableTables.length === 0" type="info">
            No tables available for this time. Try another slot.
          </v-alert>
          
          <v-item-group v-model="form.tableId" selected-class="bg-primary">
            <v-row class="pa-4">
              <v-col v-for="table in reservationStore.availableTables" :key="table.id" cols="12" sm="4">
                <v-item v-slot:default="{ isSelected, toggle }" :value="table.id">
                  <v-card 
                    :color="isSelected ? 'primary' : 'grey-lighten-4'" 
                    class="d-flex align-center text-center"
                    height="100"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <div class="flex-grow-1">
                        Table {{ table.tableNumber }}
                        <div class="text-caption">Capacity: {{ table.capacity }}</div>
                      </div>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>

          <v-card-actions>
            <v-btn variant="text" @click="step = 1">Back</v-btn>
            <v-spacer />
            <v-btn color="success" :disabled="!form.tableId" @click="confirmBooking">
              Confirm Reservation
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-stepper>
  </v-container>
</template>