<script setup>
import { onMounted, ref } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useReservationStore } from '@/stores/reservation'
import { useRouter } from 'vue-router'

const orderStore = useOrderStore()
const resStore = useReservationStore()
const router = useRouter()

const selectedResId = ref(null)

onMounted(() => {
  resStore.fetchMyReservations()
})

const handlePlaceOrder = async () => {
  if (!selectedResId.value) {
    alert("Please select your active booking/table.")
    return
  }
  const resId = Number(selectedResId.value)
  const result = await orderStore.submitOrder(resId)
  if (result.success) {
    router.push('/my-orders')
  } else {
    alert(result.error)
  }
}
</script>

<template>
  <v-container>
    <h2 class="text-h4 mb-6">Your Cart</h2>

    <v-row v-if="orderStore.cart.length > 0">
      <v-col cols="12" md="8">
        <v-card variant="outlined" rounded="lg">
          <v-table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-center">Quantity</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderStore.cart" :key="item.id">
                <td>{{ item.name }}</td>
                <td class="text-center">
                  <v-btn icon="mdi-minus" size="x-small" @click="orderStore.removeFromCart(item.id)"></v-btn>
                  <span class="mx-3">{{ item.quantity }}</span>
                  <v-btn icon="mdi-plus" size="x-small" @click="orderStore.addToCart(item)"></v-btn>
                </td>
                <td class="text-right">₹{{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="4" rounded="lg">
          <div class="text-h6 mb-4">Checkout</div>
          
          <v-select
            v-model="selectedResId"
            label="Assign to Reservation"
            :items="resStore.myReservations"
            item-title="reservationDate"
            item-value="id"
            placeholder="Select your booking"
            variant="outlined"
            class="mb-4"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="`Table ${item.raw.table?.tableNumber} at ${item.raw.timeSlot}`" />
            </template>
          </v-select>

          <v-divider class="mb-4"></v-divider>
          <div class="d-flex justify-space-between text-h6 mb-6">
            <span>Total:</span>
            <span>₹{{ orderStore.cartTotal.toFixed(2) }}</span>
          </div>

          <v-btn 
            block color="primary" size="large" 
            :loading="orderStore.loading"
            @click="handlePlaceOrder"
          >
            Place Order
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-empty-state
      v-else
      icon="mdi-cart-outline"
      title="Your cart is empty"
      text="Browse our menu to add some delicious items."
    >
      <v-btn color="primary" class="mt-4" to="/menu">View Menu</v-btn>
    </v-empty-state>
  </v-container>
</template>