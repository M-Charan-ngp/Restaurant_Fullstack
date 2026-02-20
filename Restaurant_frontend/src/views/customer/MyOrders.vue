<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

onMounted(() => orderStore.fetchMyOrders())

const getStatusColor = (status) => {
  const map = { pending: 'warning', cooking: 'info', served: 'success', paid: 'grey', cancelled: 'error' }
  return map[status] || 'grey'
}
</script>

<template>
  <v-container>
    <h2 class="text-h4 mb-6">My Orders</h2>

    <v-row v-if="orderStore.myOrders.length > 0">
      <v-col v-for="order in orderStore.myOrders" :key="order.id" cols="12">
        <v-card variant="flat" border class="mb-4">
          <v-card-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-receipt-text</v-icon>
            </template>
            <v-card-title>Order #{{ order.id }}</v-card-title>
            <v-card-subtitle>Table: {{ order.reservation?.table?.tableNumber }}</v-card-subtitle>
            
            <template v-slot:append>
              <v-chip :color="getStatusColor(order.status)" class="text-uppercase" size="small">
                {{ order.status }}
              </v-chip>
            </template>
          </v-card-item>

          <v-divider></v-divider>

          <v-list density="compact">
            <v-list-item v-for="item in order.items" :key="item.id">
              <v-list-item-title>
                {{ item.quantity }}x {{ item.menuItem?.name }}
              </v-list-item-title>
              <template v-slot:append>
                <span class="text-caption">${{ (item.quantity * item.menuItem?.price).toFixed(2) }}</span>
              </template>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          
          <v-card-item class="bg-grey-lighten-4">
            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-2">Total Amount</span>
              <span class="text-h6 font-weight-bold">${{ order.totalAmount }}</span>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-empty-state
      v-else
      icon="mdi-food-off"
      title="No Orders Found"
      text="You haven't placed any orders yet. Visit the menu to start!"
    >
      <v-btn color="primary" class="mt-4" to="/menu">Browse Menu</v-btn>
    </v-empty-state>
  </v-container>
</template>