import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

// personal 
import PersonalHomeView from '@/views/personal/PersonalHomeView.vue'
import PersonalContratoView from '@/views/personal/PersonalContratoView.vue'
import PersonalPerfilView from '@/views/personal/PersonalPerfilView.vue'
//administrador
import AdministradorHomeView from '@/views/administrador/AdministradorHomeView.vue'
import GestionPersonalView from '@/views/administrador/GestionPersonalView.vue'


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
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    //personal
    {
      path: '/personal',
      name: 'personal',
      component: PersonalHomeView,
      meta: { showPersonalNav: true }, // Mostrar navbar de asist
   
    },
    {
      path: '/personal/contrato',
      name: 'personal-contrato',
      component: PersonalContratoView,
      meta: { showPersonalNav: true }, // Mostrar navbar de asist
      
    },
    {
path: '/personal/perfil',
      name: 'personal-perfil',
      component: PersonalPerfilView,
      meta: { showPersonalNav: true }, // Mostrar navbar de asist
    },

    //administrador

    {
      path: '/administrador',
      name: 'administrador',
      component: AdministradorHomeView,
      meta: { showAdminNav: true }, // Mostrar navbar de asist
    },
    {
      path: '/administrador/gestion-personal',
      name: 'gestion-personal',
      component: GestionPersonalView
    }
  ],
})

export default router
