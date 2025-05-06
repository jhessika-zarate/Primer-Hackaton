import { defineStore } from 'pinia';
import axios from 'axios';
import { RutaApi2 } from '../assets/apiConfig';
export const usePagosStore = defineStore('pagos', {
  state: () => ({
    pagos: [],
  }),
  actions: {
    async getPagos() {
      try {
        const response = await axios.get(RutaApi2 + 'pagos');
       this.pagos = response.data;
        console.log('response pagos',this.pagos);
        return this.pagos;
      } catch (error) {
        console.error('Error fetching pagos:', error);
      }
    },
},} )