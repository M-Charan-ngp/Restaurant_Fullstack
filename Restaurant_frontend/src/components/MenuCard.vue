<script setup>
defineProps(['item'])
defineEmits(['add'])
const logout = () => {
  router.push('/');
};
</script>

<template>
  <v-card class="mx-auto flex-column d-flex" height="100%" elevation="2">
    <v-card-item>
      <v-card-title>{{ item.name }}</v-card-title>
      <v-card-subtitle>
        {{ item.category }}
      </v-card-subtitle>
    </v-card-item>

   <v-card-text class="flex-grow-1">
      <div class="text-h6">₹{{ item.price }}</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        block
        prepend-icon="mdi-plus"
        :disabled="!item.isAvailable"
        @click="$emit('add')"
      >
        {{ item.isAvailable ? 'Add to Cart' : 'Out of Stock' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>