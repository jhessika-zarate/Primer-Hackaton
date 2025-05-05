<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import NavBarNormal from './components/navbar.vue'
import NavBarAdministrador from './components/navbarAdministrador.vue'
import NavbarPersonal from './components/navbarPersonal.vue'
</script>

<template>
  <component  :is="
      route.meta.showAdminNav ? NavBarAdministrador :
      route.meta.showConferencistaNav ? NavBarConferencista :
      route.meta.showAsistenteNav ? NavbarPersonal :
      NavBarNormal
    "  @search="handleSearch" @location-change="handleLocationChange" />
    <RouterView />
</template>

<style scoped>
:global(body) {
  background-color: #f9f0ed;
  font-family: 'Lato';
}
</style>