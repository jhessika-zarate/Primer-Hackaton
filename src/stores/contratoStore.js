import { defineStore } from 'pinia';
import axios from 'axios';
import { RutaApi } from '../assets/apiConfig';
export const useContratoStore = defineStore('contratos', {
  state: () => ({
    contratos:[]
  }),
  actions: {
    async createContrato() {
      try {
        const response = await axios.get(RutaApi + 'pagos');
        this.pagos = response.data;
        this.totalPagos = this.pagos.length;
        console.log(this.pagos);
        return this.pagos;
      } catch (error) {
        console.error('Error fetching pagos:', error);
      }
    },
},} )