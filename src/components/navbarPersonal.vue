<template>
    <nav class="navbar">
      <div class="container">
        personal
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img src="" alt="Logo" />
        </router-link>
  
        <!-- Navegación principal -->
        <ul class="nav-links">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/conferencias">Conferencias</router-link></li>
  
          <li><router-link to="/login">Login</router-link></li>
        </ul>
  
        <!-- Controles de búsqueda y ubicació   n -->
        <!-- Controles de búsqueda y ubicació   n -->
        <div class="nav-controls">
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar conferencias..."
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
  
          <div class="location-selector">
            <i
              class="fas fa-map-marker"
              aria-hidden="true"
              style="color: red; font-size: 1.3rem"
            ></i>
            <select v-model="selectedDepartment" @change="handleLocationChange">
              <option value="">Todo Bolivia</option>
              <option
                v-for="department in bolivianDepartments"
                :key="department"
                :value="department"
              >
                {{ department }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Menú móvil -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
  
      <!-- Menú móvil desplegable -->
      <transition name="slide-down">
        <div v-if="showMobileMenu" class="mobile-menu">
          <router-link to="/">Inicio</router-link>
          <router-link to="/conferencias">Conferencias</router-link>
          <router-link to="/agenda">Agenda</router-link>
          <router-link to="/contacto">Contacto</router-link>
        </div>
      </transition>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "",
        selectedDepartment: "",
        showMobileMenu: false,
        bolivianDepartments: [
          "La Paz",
          "Cochabamba",
          "Santa Cruz",
          "Oruro",
          "Potosí",
          "Tarija",
          "Chuquisaca",
          "Beni",
          "Pando",
        ],
      };
    },
    methods: {
      handleSearch() {
        this.$emit("search", this.searchQuery);
      },
      handleLocationChange() {
        this.$emit("location-change", this.selectedDepartment);
      },
      toggleMobileMenu() {
        this.showMobileMenu = !this.showMobileMenu;
      },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    background: #ffffff;
    color: rgb(17, 16, 16);
    padding: 1rem 0;
    position: fixed;
    font-size: 1.3rem;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .container {
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }
  
  .logo img {
    height: 80px;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  
  .nav-links a {
    color: rgb(2, 2, 2);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .nav-links a:hover {
    color: #84b7c2;
  }
  
  .nav-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    font-size: 1.7rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.3rem 0.8rem;
  }
  
  .search-box input {
    background: transparent;
    border: none;
    color: rgb(16, 15, 15);
    font-size: 1.3rem;
    padding: 0.5rem;
    min-width: 200px;
  }
  
  .search-box button {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: rgb(14, 12, 12);
    cursor: pointer;
  }
  
  .location-selector select {
    background: rgba(255, 255, 255, 0.1);
    font-size: 1.3rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgb(12, 10, 10);
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: rgb(1, 1, 1);
    font-size: 1.3rem;
  }
  
  .mobile-menu {
    display: none;
    background: #1a237e;
    padding: 1rem;
    text-align: center;
  }
  
  .mobile-menu a {
    display: block;
    color: rgb(15, 12, 12);
    text-decoration: none;
    padding: 1rem;
  }
  
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  @media (max-width: 768px) {
    .nav-links,
    .nav-controls {
      display: none;
    }
  
    .mobile-menu-btn {
      display: block;
    }
  
    .mobile-menu {
      display: block;
    }
  }
  </style>
  