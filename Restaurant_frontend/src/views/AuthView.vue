
<script setup>
import { ref, reactive } from 'vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'
const $toast = useToast();
const router = useRouter()
const authStore = useAuthStore()
const isLogin = ref(true)

const loginData = reactive({
    email: '',
    password: ''
})

const registerData = reactive({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roleId: 1
})

const handleRedirect = () => {
    const role = authStore.user?.role
    $toast.success("Login Success!",{position:'top-right'})
    if (role === 3) router.push('/admin/tables')
    else if (role === 2) router.push('/staff/reservations')
    else router.push('/menu')
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="4">
        
        <v-fade-transition mode="out-in">
          <div :key="isLogin">
            <Login
              v-if="isLogin" 
              v-model="loginData" 
              @login-success="handleRedirect"
            />
            <Register
              v-else 
              v-model="registerData" 
              @success="isLogin = true" 
            />
          </div>
        </v-fade-transition>

        <div class="text-center mt-6">
          <span v-if="isLogin">
            Don't have an account? 
            <v-btn variant="text" color="primary" @click="isLogin = false">Sign Up</v-btn>
          </span>
          <span v-else>
            Already have an account? 
            <v-btn variant="text" color="primary" @click="isLogin = true">Login</v-btn>
          </span>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>