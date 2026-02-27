<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const newUser = defineModel({ required: true })
const authStore = useAuthStore()
const themeColor = computed(() => authStore.themeColor)
const loading = ref(false)
const $toast = useToast();
const confirmPassword = ref('')
const togglepass = ref(false) 
const toggleconfirmpass = ref(false)
const emit = defineEmits(['success'])
const roleItems = [
    { title: 'Customer', value: 1 },
    { title: 'Staff', value: 2 },
    { title: 'Admin', value: 3 }
]

const emailrule = [
    value => !!value || 'Email is required.',
    value => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email'
]

const rule = [value => !!value || `Field is required`]
const phonerule = [
  value => !!value || 'Phone no is required.',
  value => /^[0-9]{10}$/.test(value) || 'Invalid phone']
const handleSubmit = async () => {
  if (!newUser.value.fullName || !newUser.value.email || !newUser.value.password || !newUser.value.phoneNumber) {
        $toast.error("Please fill all the values",{position:"top-right"})
        return
    }
    if (newUser.value.password !== confirmPassword.value) {
        $toast.error("Passwords do not match!",{position:"top-right"})
        return
    }

    loading.value = true
    const result = await authStore.register(newUser.value)
    loading.value = false

    if (result.success) {
        $toast.success("Registration successful! Please login.",{position:"top-right"})
        emit('success')
    }
}
</script>

<template>
  <v-card class="mx-auto pa-8 pb-8" elevation="8" min-width="400" rounded="lg">
    <h2 class="text-h4 font-weight-black text-center mb-6">Register</h2>

    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="newUser.fullName"
        :rules="rule"
        label="Full Name"
        prepend-inner-icon="mdi-account"
        variant="outlined"
      ></v-text-field>

      <v-text-field
        v-model="newUser.email"
        :rules="emailrule"
        label="Email"
        prepend-inner-icon="mdi-email"
        variant="outlined"
      ></v-text-field>

      <v-text-field
        v-model="newUser.phoneNumber"
        :rules="phonerule"
        label="Phone Number"
        prepend-inner-icon="mdi-phone"
        variant="outlined"
      ></v-text-field>

      <v-text-field
        v-model="newUser.password"
        :append-inner-icon="togglepass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="togglepass ? 'text' : 'password'"
        :rules="rule"
        label="Password"
        prepend-inner-icon="mdi-lock"
        variant="outlined"
        @click:append-inner="togglepass = !togglepass"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        :append-inner-icon="toggleconfirmpass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="toggleconfirmpass ? 'text' : 'password'"
        :rules="rule"
        label="Confirm Password"
        prepend-inner-icon="mdi-lock-check"
        variant="outlined"
        @click:append-inner="toggleconfirmpass = !toggleconfirmpass"
      ></v-text-field>

      <v-select
        v-model="newUser.roleId"
        :items="roleItems"
        label="Register as"
        variant="outlined"
      ></v-select>

      <v-btn
        type="submit"
        block
        :loading="loading"
        :color="themeColor"
        size="large"
        variant="elevated"
      >
        Register
      </v-btn>
    </v-form>
  </v-card>
</template>