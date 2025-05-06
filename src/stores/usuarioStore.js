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
  
        async getUsuarios2(){
            // http://localhost:2000/api/auth/usuarios

            try {
                const response = await axios.get(RutaApi + 'auth/usuarios');
                this.usuarios = response.data;
                console.log(this.usuarios);
                return this.usuarios.usuarios;
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }
        } ,

        //put  http://localhost:2000/api/auth/cambio
        async cambiarContrasenia(usuarioJson) {
            try {
                const response = await axios.put(RutaApi + 'auth/cambio', usuarioJson);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error('Error changing user state:', error);
            }
        },
        async crearUsuario(usuarioJson) {
            try {
                const response = await axios.post(RutaApi + 'auth/register', usuarioJson);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error('Error changing user state:', error);
            }
        },

        //post http://localhost:2000/api/auth/login
        async login(usuarioJson) {
            try {
                const response = await axios.post(RutaApi + 'auth/login', usuarioJson);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }, async registerUsuario(usuarioPayload) {
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


    },
   
  }
);
