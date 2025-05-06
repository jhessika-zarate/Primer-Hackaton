import { defineStore } from 'pinia';
import axios from 'axios';
import { RutaApi } from '../assets/apiConfig';

export const useUsuarioStore = defineStore('usuario', {
    state: () => ({
        usuarios: [],
      }),
      actions: {
        async getUsuarios(){
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


    },
})