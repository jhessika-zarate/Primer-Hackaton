<template>
  <div class="home">
    <div class="container">
      <h1>Pagos obtenidos</h1>
    </div>
    <div class="numeradores">
      <div class="numerador">
        <h3>Ganacias Total</h3>
        <span>{{ GanaciasHospital }}Bs</span>
      </div>
    </div>
    <!--buscador de fecha
      <div class="switch-button">
        <div class="switch-toggle"></div>
        <div class="switch-option"> Fecha de inicio:  <input
            type="date"
            placeholder="Ej. 777712"
            class="comboText"
            v-model="searchQuery"
            style="margin: 0rem 0rem 1rem"
          /></div>
        <div class="switch-option">
            Fecha de final
          <input
            type="date"
            placeholder="Ej. 777712"
            class="comboText"
            v-model="searchQuery"
            style="margin: 0rem 0rem 1rem"
          />
        </div>
      </div>-->
  
    <div
      class="container-cita"
      v-if="filterPacientes.length > 0"
      :class="{
        pastcontenedor: selected === 'Propias',
        todaycontenedor: selected === 'Aseguradoras',
      }"
    >
      <div v-for="persona in this.pagos" :key="persona" class="cita">
        <div class="a-box">
          <div class="img-container">
            <div class="img-inner">
              <div class="inner-skew">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/411/411745.png"
                />
              </div>
            </div>
          </div>
          <div class="text-container">
            <!--si es select la letra azul y sino verde -->
            <h3>TOTAL: {{ persona.pago_total }} Bs</h3>
            <div>
              <span>
                <span class="atributo">Fecha:</span>
                {{ persona.fecha_pago }}</span
              >
              <br />

              <span
                ><span class="atributo">Dias trabajados:</span>
                {{ persona.dias_trabajo }}</span
              >
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePagosStore } from "@/stores/pagosStore";
export default {
  name: "homeAdministradorView",
  components: {},
  data() {
    return {
      hoverColor: "#D62929",
      searchQuery: "",
      selected: "Propias",
      idUsuario: 10000,
      /**pagos */
      pagos: [
        {
          id_pago: 1,
          dias_trabajo: 5,
          id_usuario: 2,
          id_contrato: 1,
          fecha_pago: "2023-10-01",
          pago_total: 1000,
        },
        {
          id_pago: 2,
          dias_trabajo: 3,
          id_usuario: 2,
          id_contrato: 1,
          fecha_pago: "2023-10-02",
          pago_total: 800,
        },
        {
          id_pago: 3,
          dias_trabajo: 4,
          id_usuario: 2,
          id_contrato: 1,
          fecha_pago: "2023-10-03",
          pago_total: 1200,
        },
        {
          id_pago: 4,
          dias_trabajo: 2,
          id_usuario: 2,
          id_contrato: 1,
          fecha_pago: "2023-10-04",
          pago_total: 600,
        },
      ],

      citas: [
        {
          ci_paciente: "777712",
          fecha: "2023-10-01",
          total: 100,
          cantidadConsultas: 5,
          seguro: true,
        },
        {
          ci_paciente: "777713",
          fecha: "2023-10-02",
          total: 200,
          cantidadConsultas: 3,
          seguro: false,
        },
        {
          ci_paciente: "777714",
          fecha: "2023-10-03",
          total: 150,
          cantidadConsultas: 4,
          seguro: true,
        },
        {
          ci_paciente: "777715",
          fecha: "2023-10-04",
          total: 250,
          cantidadConsultas: 2,
          seguro: false,
        },
        {
          ci_paciente: "777715",
          fecha: "2023-10-04",
          total: 250,
          cantidadConsultas: 2,
          seguro: false,
        },
        {
          ci_paciente: "777715",
          fecha: "2023-10-04",
          total: 250,
          cantidadConsultas: 2,
          seguro: false,
        },
        {
          ci_paciente: "777715",
          fecha: "2023-10-04",
          total: 250,
          cantidadConsultas: 2,
          seguro: false,
        },
        {
          ci_paciente: "777715",
          fecha: "2023-10-04",
          total: 250,
          cantidadConsultas: 2,
          seguro: false,
        },
      ],
    };
  },
  mounted() {
    this.obtenerPagos();
  },
  methods: {
    async obtenerPagos() {
      this.pagos = await this.pagosStore.getPagos();
      
      //quiero que encuentres  todos los pagos que tengan el id_usuario igual a idUsuario
      this.pagos = this.pagos.filter((pago) => pago.id_usuario === this.idUsuario); 
      console.log(this.pagos);
      //ordena por fecha
      this.pagos.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
    },
  },
  computed: {
    filterPacientes() {
      if (this.selected === "Aseguradoras") {
        console.log(this.citas.filter((card) => card.seguro));
        return this.citas.filter((card) => card.seguro);
      } else if (this.selected === "Propias") {
        return this.citas.filter((card) => !card.seguro);
      }
    },
    filterPagos() {
      // cuando this.selected === "Aseguradoras" se filtre los 3 primeros pagos
      if (this.selected === "Aseguradoras") {
        return this.pagos.filter((card) => card.id_pago <= 3);
      } else if (this.selected === "Propias") {
        return this.pagos.filter((card) => card.id_pago > 3);
      }
    },
    GanaciasHospital() {
      return this.pagos.reduce((acc, cita) => {
        if (!cita.seguro) {
          return acc + cita.pago_total;
        }
        return acc;
      }, 0);
    },
  },
  setup() {
    const pagosStore = usePagosStore();
    return {
      pagosStore,
    };
  },
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Cormorant+Garamond);

.home {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f4f7fb;
  /* Light background for better visibility */
  padding-bottom: 4rem;
  min-height: 90vh;
  /* Full height to accommodate footer */
}

.container {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  /* Space for the footer */
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: #34495e;
  /* Dark footer */
  color: white;
  padding: 10px 0;
}

h1 {
  font-size: 3.5em;
  color: #0070a4;
  font-weight: 700;
  text-transform: uppercase;
}

span {
  font-size: 1.4em;
  color: #000000;
}

/* Switch Button Styles */

.switch-button {
  margin: 20px auto;
  display: flex;
  background: #0070a456;
  border-radius: 30px;
  overflow: hidden;
  width: 300px;
  position: relative;
  padding-top: 0.2rem;
}

.switch-button-tipo {
  margin: 5px auto;
  display: flex;
  background: #0070a4;
  border-radius: 30px;
  overflow: hidden;
  width: 200px;
  position: relative;
}

.switch-button-tipo:hover {
  background: #0070a4b5;
  transition: background-color 0.3s ease;
}

.switch-option {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 18px;
  letter-spacing: 1px;
  color: #ffffff;
  position: relative;
  padding-top: 0.5rem;
  z-index: 2;
}

.switch-option-tipo {
  flex: 1;
  text-align: center;
  padding-top: 0.5rem;
  padding: 10px 0;
  cursor: pointer;
  font-size: 18px;
  letter-spacing: 1px;
  color: #ffffff;
  position: relative;
  z-index: 2;
}

.switch-toggle {
  position: absolute;
  top: 0;
  bottom: 0;
  color: #000;
  width: 150px;
  background: #0070a4;
  border-radius: 30px;
  transition: transform 300ms;
}

.past {
  transform: translateX(0);
}

.today {
  transform: translateX(150px);
}

.pastcontenedor {
  background: #09ff0036;
  transition: background-color 0.3s ease;
}

.todaycontenedor {
  background: #fffc349d;
  transition: background-color 0.3s ease;
}

.future {
}

/* Input Styles */
/* el texto predeterminado del input */
.comboText::placeholder {
  color: #f6f6f6;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  opacity: 0.5;
  /* Opacity for placeholder */
}

.comboText {
  width: 100%;
  height: 12px;

  font-weight: 300;
  border: 0px solid #0070a456;
  color: #f6f6f6;
  background-color: #0070a400;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  margin: 10px 0;

  cursor: pointer;
  justify-content: center;
  text-align: center;
}

/* Cita Styles  que se ponga en 3 columnas*/
.cita {
  border-radius: 10px;
  flex: auto;
  width: 300px;
  padding: 10px 10px 0px 40px;
}

/* centra el texto en una fila */
.cita-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.cita-info h1 {
  font-size: 1.5rem;
  margin: 1rem 1rem 0 2rem;
}

.container-cita {
  padding: 10px;
  display: flex;
margin-top: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 80%;
  border-radius: 10px;
  gap: 20px;
  max-height: 55vh;
  overflow-y: auto;
}

/**Tarjeta cita */
.a-box {
  display: inline-block;
  width: 240px;
  text-align: center;
}

.img-container {
  height: 230px;
  width: 200px;
  overflow: hidden;
  border-radius: 0px 0px 20px 20px;
  display: inline-block;
}

.img-container img {
  transform: skew(0deg, -0deg);
  height: 150px;
  margin: -1px 0px 0px -0px;
}

.inner-skew {
  position: relative;
  display: inline-block;
  border-radius: 20px;
  overflow: hidden;
  padding: 0px;
  transform: skew(0deg, 0deg);
  font-size: 0px;
  margin: 10px 0px 0px 0px;
  height: 250px;
  width: 200px;
}

.inner-skew img {
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2));
  width: 100%;
  height: 80%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

/* Capa de brillo */
.inner-skew::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.5s ease-in-out;
  pointer-events: none;
}

/* Aplica el efecto de brillo cuando el mouse está encima */
.inner-skew:hover::before {
  left: 100%;
}

.text-container {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  padding: 120px 10px 0px 10px;
  border-radius: 20px;
  background: #fff;
  margin: -130px 0px 0px 0px;
  line-height: 19px;
  font-size: 14px;
  padding-bottom: 1rem;
}

.text-container h3 {
  margin: -10px 0px 5px 0px;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.102);

  font-size: 25px;
  font-weight: 700;
  text-transform: uppercase;
}

span {
  font-size: 1em;
  color: #000000ac;
  font-weight: 500;
}

.atributo {
  font-weight: 700;
  color: #000000;
}

.Especialidad {
  font-weight: 600;
  color: #000000;
  font-size: 1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.Solicitud {
  background-color: #0070a4;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 8px;
  cursor: pointer;
  border-radius: 5px;
}

.Solicitud:hover {
  background-color: #0093d7;
  transition: background-color 0.3s ease;
}

/**numeradores */
.numeradores {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.numerador {
  transition: left 0.5s ease-in-out;
  pointer-events: none;
  background-color: #09ff0036;

  border: 1px solid #07d30069;
  color: #0070a4;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  border-radius: 10px;
  text-align: center;
  width: 250px;
}

.numerador h3 {
  font-size: 1.05em;
  font-weight: 600;
  color: #0ead00;
  text-transform: uppercase;
  text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.112);
  margin: 0;
}

.numerador span {
  color: #0ead00;
  font-size: 2.4rem;
  font-weight: 600;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.218);

  padding: 10px;
  border-radius: 10px;
}

.numerador-aseguradoras {
  background-color: #fffc349d;
  color: white;
  border: 1px solid #adad00b8;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  width: 250px;
  transition: left 0.5s ease-in-out;
}

.numerador-aseguradoras h3 {
  font-size: 1.05em;
  font-weight: 600;
  color: #adad00;
  text-transform: uppercase;
  text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.112);
  margin: 0;
}

.numerador-aseguradoras span {
  color: #adad00;
  font-size: 2.4rem;
  font-weight: 600;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.218);
  padding: 10px;
  border-radius: 10px;
}
.numerador span {
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Evita el desbordamiento del texto */
  text-overflow: ellipsis; /* Muestra "..." si el texto es demasiado largo */
  display: inline-block;
  max-width: 100%; /* Asegura que el texto se ajuste al contenedor */
}

.numerador-aseguradoras span {
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Evita el desbordamiento del texto */
  text-overflow: ellipsis; /* Muestra "..." si el texto es demasiado largo */
  display: inline-block;
  max-width: 100%; /* Asegura que el texto se ajuste al contenedor */
}
</style>
