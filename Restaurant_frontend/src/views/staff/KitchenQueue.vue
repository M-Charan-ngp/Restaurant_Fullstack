<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

let pollInterval
onMounted(() => {
  orderStore.fetchKitchenQueue()
  console.log(orderStore.kitchenOrders)
  pollInterval = setInterval(() => orderStore.fetchKitchenQueue(), 30000)
})

onUnmounted(() => clearInterval(pollInterval))

const getStatusColor = (status) => {
  const colors = { pending: 'warning', cooking: 'info', served: 'success' }
  return colors[status] || 'grey'
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4">Kitchen Queue</h2>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-refresh" @click="orderStore.fetchKitchenQueue()"></v-btn> 
    </div> 
 
    <v-row> 
      <v-col v-for="order in orderStore.kitchenOrders" :key="order.id" cols="12" md="6" lg="4"> 
        <v-card border variant="outlined"> 
          <v-card-item> 
            <template v-slot:prepend> 
              <v-chip :color="getStatusColor(order.status)" size="small" class="text-uppercase"> 
                {{ order.status }} 
              </v-chip> 
            </template> 
            <v-card-title>Table {{ order.reservation?.table?.tableNumber }}</v-card-title> 
            <v-card-subtitle>Order #{{ order.id }}</v-card-subtitle> 
          </v-card-item> 
 
          <v-divider></v-divider> 
 
          <v-list density="compact"> 
            <v-list-item v-for="item in order.items" :key="item.id"> 
              <template v-slot:prepend> 
                <v-badge color="primary" :content="item.quantity" inline></v-badge> 
              </template> 
              <v-list-item-title class="ml-2">{{ item.menuItem?.name }}</v-list-item-title> 
            </v-list-item> 
          </v-list> 
 
          <v-card-actions> 
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
    </v-row> 
  </v-container> 
</template> 