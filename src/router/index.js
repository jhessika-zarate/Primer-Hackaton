import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


// personal 
import PersonalHomeView from '@/views/personal/PersonalHomeView.vue'
//administrador
import AdministradorHomeView from '@/views/administrador/AdministradorHomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },

    //personal
    {
      path: '/personal',
      name: 'personal',
      component: PersonalHomeView,
      meta: { showPersonalNav: true }, // Mostrar navbar de asist
   
    },
    //administrador

    {
      path: '/administrador',
      name: 'administrador',
      component: AdministradorHomeView,
      meta: { showAdminNav: true }, // Mostrar navbar de asist
    }
  ],
})

export default router
