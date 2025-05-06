import { defineStore } from 'pinia';
import axios from 'axios';
import { RutaApi } from '../assets/apiConfig';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuarios: [],
    token: null,
    perfil: null,
  }),
  actions: {
    async getUsuarios() {
      try {
        const res = await axios.get(`${RutaApi}auth/usuarios`);
        this.usuarios = res.data.usuarios;
        return this.usuarios;
      } catch (err) {
        console.error('Error fetching usuarios:', err);
        throw err;
      }
    },
    async registerUsuario(usuarioPayload) {
      try {
        const res = await axios.post(`${RutaApi}auth/register`, usuarioPayload);
        return res.data;
      } catch (err) {
        console.error('Error registering usuario:', err);
        throw err;
      }
    },
    async loginUsuario(credentials) {
      try {
        const res = await axios.post(`${RutaApi}auth/login`, credentials);
        this.token = res.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        return res.data;
      } catch (err) {
        console.error('Error logging in:', err);
        throw err;
      }
    },
    async cambiarContrasenia(payload) {
      try {
        const res = await axios.put(`${RutaApi}auth/cambio`, payload);
        return res.data;
      } catch (err) {
        console.error('Error changing password:', err);
        throw err;
      }
    },
    logout() {
      this.token = null;
      this.perfil = null;
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});
