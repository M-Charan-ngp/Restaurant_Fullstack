<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import { Transmit } from '@adonisjs/transmit-client'
import { formatDate, formatTime } from '@/utils/formats'

const orderStore = useOrderStore()
const transmit = new Transmit({
  baseURL: import.meta.env.VITE_API_URL,
})
let subscription

onMounted(async () => {
  await orderStore.fetchKitchenQueue()
  orderStore.liveQueue = [...orderStore.kitchenOrders.filter(o => o.status !== 'served')]

  subscription = transmit.subscription('orders/kitchen')
  subscription.onMessage((message) => {
    if (message.type === 'NEW_ORDER') {
      orderStore.addToLiveQueue(message.data)
    } else if (message.type === 'STATUS_UPDATE') {
      orderStore.updateLiveStatus(message.data.id, message.data.status)
    }
  })
  await subscription.create()
})

onUnmounted(() => subscription?.delete())

const getStatusColor = (status) => {
  const colors = { pending: 'warning', cooking: 'info', served: 'success' }
  return colors[status] || 'grey'
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4 font-weight-bold">Live Kitchen Monitor</h2>
      <v-spacer></v-spacer>
      <v-chip color="primary" variant="outlined" pill>
        <v-icon start icon="mdi-radiobox-marked" class="pulse-icon"></v-icon>
        Live Connection Active
      </v-chip>
    </div>

    <v-row v-if="orderStore.liveQueue.length === 0">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1">mdi-tray-full</v-icon>
        <p class="text-grey-darken-1 mt-2">No active orders in the queue.</p>
      </v-col>
    </v-row>

    <v-row>
      <transition-group name="order-list">
        <v-col v-for="order in orderStore.liveQueue" :key="order.id" cols="12" md="6" lg="4">
          <v-card border variant="outlined" class="rounded-lg elevation-2 h-100"> 
            <v-card-item> 
              <template v-slot:prepend> 
                <v-chip :color="getStatusColor(order.status)" size="small" class="text-uppercase font-weight-bold"> 
                  {{ order.status }} 
                </v-chip> 
              </template> 
              
              <v-card-title class="d-flex align-center">
                Table {{ order.reservation?.table || 'N/A' }}
                <v-spacer></v-spacer>
              </v-card-title> 

              <v-card-subtitle class="mt-1">
                <div class="d-flex align-center">
                  <v-icon size="small" icon="mdi-clock-outline" start></v-icon>
                  {{ formatTime(order.reservation?.timeSlot) }}
                  <span class="mx-1">-</span>
                  {{ formatTime(order.reservation?.timeSlotEnd) }}
                </div>
                <div class="text-caption">
                  <v-icon size="x-small" icon="mdi-calendar" start></v-icon>
                  {{ formatDate(order.reservation?.date) }} | Order #{{ order.id }}
                </div>
              </v-card-subtitle> 
            </v-card-item> 

            <v-divider></v-divider> 

            <v-list density="compact"> 
              <v-list-item v-for="item in order.items" :key="item.id"> 
                <template v-slot:prepend> 
                  <v-badge color="primary" :content="item.quantity" inline></v-badge> 
                </template> 
                <v-list-item-title class="ml-2">{{ item.name || 'Unknown Item' }}</v-list-item-title> 
              </v-list-item> 
            </v-list> 
   
            <v-spacer></v-spacer> <v-card-actions> 
              <v-btn  
                v-if="order.status === 'pending'" 
                block color="info" variant="flat" 
                @click="orderStore.updateProgress(order.id, 'cooking')" 
              > 
                Start Cooking 
              </v-btn> 
              <v-btn  
                v-if="order.status === 'cooking'" 
                block color="success" variant="flat" 
                @click="orderStore.updateProgress(order.id, 'served')" 
              > 
                Mark as Served 
              </v-btn> 
            </v-card-actions> 
          </v-card> 
        </v-col>
      </transition-group>
    </v-row>
  </v-container>
</template>

<style scoped>
.order-list-enter-active, .order-list-leave-active {
  transition: all 0.5s ease;
}
.order-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.order-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.pulse-icon {
  animation: pulse-animation 2s infinite;
}
@keyframes pulse-animation {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
</style>