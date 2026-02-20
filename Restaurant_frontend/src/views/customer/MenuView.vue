<script setup>
import { onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useOrderStore } from '@/stores/order'
import MenuCard from '@/components/MenuCard.vue'

const menuStore = useMenuStore()
const orderStore = useOrderStore()

onMounted(() => {
  menuStore.fetchMenu()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-slide-group show-arrows>
          <v-slide-group-item v-for="cat in menuStore.categories" :key="cat">
            <v-btn
              class="ma-2"
              :color="menuStore.selectedCategory === cat ? 'primary' : undefined"
              rounded
              @click="menuStore.selectedCategory = cat"
            >
              {{ cat }}
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-row v-if="menuStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col 
        v-for="item in menuStore.filteredItems" 
        :key="item.id" 
        cols="12" sm="6" md="4"
      >
        <MenuCard 
          :item="item" 
          @add="orderStore.addToCart(item)"
        />
      </v-col>
    </v-row>

    <v-row v-if="!menuStore.loading && menuStore.filteredItems.length === 0">
      <v-col class="text-center">
        <v-icon size="64" color="grey">mdi-silverware-clean</v-icon>
        <p class="text-h6 text-grey">No items found in this category.</p>
      </v-col>
    </v-row>
  </v-container>
</template>