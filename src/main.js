import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'

import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';

import './css/main.css'

// Init Pinia
const pinia = createPinia()

// Create Vue app
createApp(App)
.use(router)
.use(pinia)
.use(ToastPlugin)
.mount('#app')

const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()

const defaultDocumentTitle = 'Admin One Vue 3 Tailwind'
router.beforeEach(async (to,from)=>{
  if(to.name != 'login' && to.name != 'register')
  {
    const isLoggedIn = await mainStore.isLoggedIn()
    console.log("isLoggedIn",isLoggedIn)
    if(!isLoggedIn)
    {
      return {name:'login'}
    }
  }
})
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
