import { createRouter, createWebHashHistory } from 'vue-router'
// import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RequestRfqView from '@/views/RequestRfqView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  // {
  //   meta: {
  //     title: 'Select style'
  //   },
  //   path: '/',
  //   name: 'style',
  //   component: Style
  // },
  {
    meta: {
      title: 'Home'
    },
    path: '/',
    component:LoginView
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta:{
      title:'Create RFQ'
    },
    path:'/create-rfq',
    name:'create-rfq',
    component:()=>import('@/views/CreateRFQView.vue')
  },
  {
    meta:{
      title:'Request RFQ'
    },
    path:'/request-rfq',
    name:'request-rfq',
    component:RequestRfqView
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Register'
    },
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
