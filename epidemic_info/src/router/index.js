import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/map',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/map',
        name: 'Map',
        component: () => import("@/components/Map.vue")
      },
      {
        path: '/pie',
        name: 'Pie',
        component: () => import("@/components/Pie.vue")
      },
      {
        path: '/bar',
        name: 'Bar',
        component: () => import("@/components/Bar.vue")
      },
      {
        path: '/line',
        name: 'Line',
        component: () => import("@/components/Line.vue")
      },
      {
        path: '/login',
        name: 'login',
        component: () => import("@/components/Login.vue")
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import("@/components/Chat.vue")
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
