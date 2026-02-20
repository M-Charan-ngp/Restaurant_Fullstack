<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const newUser = defineModel({ required: true })
const authStore = useAuthStore()
const themeColor = computed(() => authStore.themeColor)
const loading = ref(false)

const confirmPassword = ref('')
const togglepass = ref(false) 
const toggleconfirmpass = ref(false)

const roleItems = [
    { title: 'Customer', value: 1 },
    { title: 'Staff', value: 2 },
    { title: 'Admin', value: 3 }
]

const emailrule = [
    value => !!value || 'Email is compulsory.',
    value => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email'
]

const rule = [value => !!value || `Field is compulsory`]

const handleSubmit = async () => {
    if (newUser.value.password !== confirmPassword.value) {
        alert("Passwords do not match!")
        return
    }

    loading.value = true
    const result = await authStore.register(newUser.value)
    loading.value = false

    if (result.success) {
        alert("Registration successful! Please login.")
        // Optionally switch the parent view to login mode
    } else {
        alert(result.error)
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
        :rules="rule"
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