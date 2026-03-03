import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { useAuthStore } from './stores/auth'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ToastPlugin from 'vue-toast-notification';
import 'unfonts.css'
import App from './App.vue'
import router from './router'
const vuetify = createVuetify({
  components,
  directives,
  ssr: true,
})

const app = createApp(App)


app.use(ToastPlugin,{position:'top'});
app.use(createPinia())
const authStore = useAuthStore()
authStore.init()
app.use(router)
app.use(vuetify)

app.mount('#app')
