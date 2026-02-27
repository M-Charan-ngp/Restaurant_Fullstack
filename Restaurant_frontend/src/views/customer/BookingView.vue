<script setup>
import { ref, reactive } from 'vue'
import { useReservationStore } from '@/stores/reservation'
import { useRouter } from 'vue-router'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
const reservationStore = useReservationStore()
const router = useRouter()
const allowedMinutes = v => v == 0 || v == 30
const step = ref(1)
const form = reactive({
  date: new Date().toISOString().substr(0, 10),
  timeSlot: '18:00',
  guestCount: 2,
  tableId: null
})
const searchTables = async () => {
  const response = await reservationStore.getAvailableTables({
    date: form.date,
    timeSlot: form.timeSlot,
    guests: form.guestCount
  })
  if (response.success) step.value = 2
}

const confirmBooking = async () => {
  const res = await reservationStore.createBooking({
    tableId: form.tableId,
    reservationDate: form.date,
    timeSlot: form.timeSlot,
    guestCount: form.guestCount
  })
  if (res.success) {
    $toast.success('Table Reserved Successfully!',{position:"top-right"})
    router.push('/my-reservations')
  } else {
    $toast.error(res.error,{position:"top-right"})
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
            <v-col cols="11" sm="5">
              <v-text-field
                v-model="form.timeSlot"
                label="Select Time"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
              >
                <v-menu
                  v-model="menuVisible"
                  activator="parent"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-if="menuVisible"
                    v-model="form.timeSlot"
                    format="24hr"
                    scrollable
                    min="09:00"
                    max="21:00"
                    :allowed-minutes="allowedMinutes"
                    @update:model-value="menuVisible = false"
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
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