import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "@/views/Index.vue"
import Register from "@/views/Register.vue"
import NotFound from "@/views/404.vue"
import Login from "@/views/Login.vue"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '*',
    name: '/404',
    component: NotFound
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
