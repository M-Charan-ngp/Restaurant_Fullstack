<script setup>
import { useAuthStore } from '../stores/auth'
import { computed, ref } from 'vue'
const emit = defineEmits(['login-success'])

const authStore = useAuthStore()
const themeColor = computed(() => authStore.themeColor)
const loading = ref(false)

// We assume these are passed from a parent "AuthView" via v-model
const credentials = defineModel({ required: true })

const emailrule = [
    value => !!value || 'Email is required.',
    value => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email'
]
const passwordrule = [value => !!value || "Password is required"]

const handlesubmit = async () => {
    if (credentials.value.email && credentials.value.password) {
        loading.value = true
        const result = await authStore.login(credentials.value)
        loading.value = false
        
        if (result.success) {
            emit('login-success') 
        } else {
            console.error(result.error)
        }
    }
}
</script>

<template>
    <v-card class="mx-auto pa-8 pb-8" width="400" elevation="8" rounded="lg">
        <h2 class="text-h4 font-weight-black text-center mb-6">Login</h2>
        <v-form @submit.prevent="handlesubmit">
            <v-text-field
                v-model="credentials.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="emailrule"
                class="mb-2"
            ></v-text-field>

            <v-text-field
                v-model="credentials.password"
                :rules="passwordrule"
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                class="mb-4"
            ></v-text-field>

            <v-btn
                type="submit"
                :color="themeColor"
                :loading="loading"
                size="large"
                variant="elevated"
                block
            >
                Log In
            </v-btn>
        </v-form>
    </v-card>
</template>