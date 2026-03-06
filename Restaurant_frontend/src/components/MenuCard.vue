<script setup>
defineProps(['item'])
defineEmits(['add'])
</script>
<template>
  <v-card 
    class="mx-auto flex-column d-flex overflow-hidden" 
    height="100%" 
    elevation="2"
    rounded="xl"
  >
    <v-img
      v-if="item.imagePath"
      :src="item.imagePath"
      height="180"
      cover
      class="align-end text-white"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>

    </v-img>

    <v-sheet 
      v-else 
      height="180" 
      color="grey-lighten-4" 
      class="d-flex align-center justify-center"
    >
      <v-icon size="64" color="grey-lighten-1">mdi-silverware-fork-knife</v-icon>
    </v-sheet>

    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-truncate" style="max-width: 70%">{{ item.name }}</v-card-title>
        <div class="text-subtitle-1 font-weight-bold color-primary">₹{{ item.price }}</div>
      </div>
      <v-card-subtitle>
        {{ item.category }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-0">
      <p class="text-caption text-grey-darken-1 line-clamp-2">
        {{ item.description || 'No description available.' }}
      </p>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="pa-4">
      <v-btn
        :color="item.isAvailable ? 'primary' : 'grey'"
        :variant="item.isAvailable ? 'elevated' : 'tonal'"
        block
        rounded="pill"
        prepend-icon="mdi-plus"
        :disabled="!item.isAvailable"
        @click="$emit('add')"
      >
        {{ item.isAvailable ? 'Add to Cart' : 'Out of Stock' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>