<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import { formatTime,formatDate } from '@/utils/formats'
onMounted(() => orderStore.fetchMyOrders())
const orderStore = useOrderStore()
const getStatusColor = (status) => {
  const map = { pending: 'warning', cooking: 'info', served: 'success', paid: 'grey', cancelled: 'error' }
  return map[status] || 'grey'
}
</script>

<<template>
  <v-container class="py-8" max-width="900">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-bold">Order History</h2>
      </div>
      <v-btn prepend-icon="mdi-silverware" color="primary" variant="flat" to="/menu" rounded="lg">
        New Order
      </v-btn>
    </div>

    <v-expansion-panels v-if="orderStore.myOrders.length > 0" variant="accordion" class="border rounded-lg overflow-hidden">
  <v-expansion-panel
    v-for="order in orderStore.myOrders"
    :key="order.id"
    elevation="0"
    class="order-panel"
  >
    <v-expansion-panel-title>
      <v-row no-gutters align="center" class="w-100">
        <v-col cols="6" sm="3">
          <div class="text-subtitle-2 font-weight-bold">Order #{{ order.id }}</div>
          <div class="text-caption text-medium-emphasis">Table {{ order.reservation?.table?.tableNumber || 'N/A' }}</div>
        </v-col>

        <v-col cols="6" sm="4">
          <div class="d-flex align-center mb-1">
            <v-icon size="16" class="mr-1" color="grey">mdi-calendar-range</v-icon>
            <span class="text-body-2 font-weight-medium">{{ formatDate(order.reservation?.reservationDate) }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon size="16" class="mr-1" color="grey">mdi-clock-outline</v-icon>
            <span class="text-caption text-medium-emphasis">
              {{ formatTime(order.reservation?.timeSlot) }} - {{ formatTime(order.reservation?.timeSlotEnd) }}
            </span>
          </div>
        </v-col>

        <v-col cols="6" sm="2" class="d-flex justify-sm-center mt-2 mt-sm-0">
          <v-chip :color="getStatusColor(order.status)" size="small" class="text-uppercase">
              {{ order.status }}
            </v-chip>
        </v-col>

        <v-col cols="6" sm="3" class="text-right mt-2 mt-sm-0">
          <div class="text-h6 font-weight-bold text-primary">
            ₹{{ parseFloat(order.totalAmount).toFixed(2) }}
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-title>

    <v-expansion-panel-text class="bg-grey-lighten-5">
      <div class="pt-2">
        <div class="text-overline mb-2 text-primary font-weight-bold">Items Ordered</div>
        <v-list lines="one" class="bg-transparent pa-0">
          <v-list-item v-for="item in order.items" :key="item.id" class="px-0 border-b-thin">
            <v-list-item-title class="text-body-2">
              <span class="font-weight-bold text-primary">{{ item.quantity }}x</span> {{ item.menuItem?.name }}
            </v-list-item-title>
            <template v-slot:append>
              <span class="text-body-2 font-weight-medium">
                ₹{{ (item.quantity * parseFloat(item.unitPrice)).toFixed(2) }}
              </span>
            </template>
          </v-list-item>
        </v-list>
        <div class="d-flex justify-end mt-4">
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>

    <v-empty-state
      v-else
      icon="mdi-food-off-outline"
      title="No Orders Yet"
    >
      <template v-slot:actions>
        <v-btn color="primary" variant="flat" size="large" rounded="pill" to="/menu">
          New Order
        </v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>

<style scoped>
.order-panel :deep(.v-expansion-panel-title) {
  min-height: 80px;
}
.border-s-md {
  border-left: 1px solid rgba(0, 0, 0, 0.05);
}
@media (max-width: 960px) {
  .border-s-md {
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 16px;
    padding-top: 16px;
  }
}
</style>