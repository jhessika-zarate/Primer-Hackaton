<template>
  <div class="home">
    <div class="container">
      <h1>PERFIL DE USUARIO</h1>
        </div>  <button @click="abrirModal()" class="btn-editar">Editar</button>

    <div class="numeradores">
      <div class="numerador">
        <div class="container-cita">
          <div class="cita">
            <div class="a-box">
              <div class="img-container">
                <div class="img-inner">
                  <div class="inner-skew">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-container">
        <h3>Nombre completo:</h3>
          <span
            >{{ usuario.nombre }} {{ usuario.apellido_paterno }}
            {{ usuario.apellido_materno }}</span
          >
          <h3>Correo:</h3>
          <span>{{ usuario.correo }}</span>
          <h3>Contraseña:</h3>
          <span>{{ usuario.contrasenia }}Bs</span>
          <h3>Rol:</h3>
          <span>{{ usuario.rol === 2 ? "Personal" : "Administrador" }}</span>

          <h3>Telefono:</h3>
          <span>{{ usuario.telefono }}</span>
          <h3>Dirección:</h3>
          <span>{{ usuario.direccion }}</span></div>
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
  </div>

  <!-- Modal -->
<div v-if="mostrarModal" class="modal-overlay">
  <div class="modal">
    <h2>Editar Perfil</h2>
    <label>Nueva Contraseña:</label>
    <input type="text" v-model="nuevaContrasenia" />
    <label>Repetir Nueva Contraseña:</label>
    <input type="text" v-model="nuevaContrasenia2" />
   
    <div class="modal-buttons">
      <button @click="guardarCambios">Guardar</button>
      <button @click="cerrarModal">Cancelar</button>
    </div>
  </div>
</div>
</template>

<script>
import { useUsuarioStore } from "@/stores/usuarioStore";
import Swal from "sweetalert2"; // Importar SweetAlert2
export default {
  name: "homeAdministradorView",
  components: {},
  data() {
    return {
      hoverColor: "#D62929",
      searchQuery: "",
      selected: "Propias",
      usuario: {
        nombre: "Juan Perez",
        apellido_paterno: "Gonzalez",
        apellido_materno: "Lopez",
        correo: "jhessika@gmail.com",
        contrasenia: "123456",
        rol: 1,
        telefono: "77771234",
        direccion: "Calle Falsa 123",
        activo: true,
      },
      nuevaContrasenia: "",
      nuevaContrasenia2: "",

      listaUsuarios: null,

      mostrarModal: false,
    formulario: {},

    idUsuario: 10000,
    };
  },
  mounted() {
this.obtenerUsuario();
//quiero que de la listaUsuarios busque el usaurio con id_usuario que consida con idUsuario
      },
  methods: {
    abrirModal() {
       
    // Copia segura de los datos actuales
    this.formulario = { ...this.usuario };
    this.mostrarModal = true;
    console.log("Abrir modal");
    console.log(this.formulario);
  },
  cerrarModal() {
    this.mostrarModal = false;
  },
  async guardarCambios() {
    if (this.nuevaContrasenia !== this.nuevaContrasenia2) {
      alert("Las contraseñas no coinciden");
      return;
    }
    let nuevoEdit;
    nuevoEdit={
        id_usuario: this.usuario.id_usuario,
        contrasenia: this.nuevaContrasenia,
    }
    const response= await this.usuarioStore.cambiarContrasenia(nuevoEdit);
    console.log("Respuesta del servidor:", response);
if (response) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Contraseña actualizada correctamente",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la contraseña",
      });
    }
    this.mostrarModal = false;
    this.nuevaContrasenia = "";
    this.nuevaContrasenia2 = "";
  },
  async obtenerUsuario(){
    this.listaUsuarios = await this.usuarioStore.getUsuarios();
    console.log("Lista de usuarios:", this.listaUsuarios);
  

    this.usuario = this.listaUsuarios.find(usuario => usuario.id_usuario === this.idUsuario);
    console.log("Usuario encontrado:", this.usuario);

}
  },
  computed: {
   
  },
  setup() {
    const usuarioStore = useUsuarioStore();
    return {
       usuarioStore
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
  margin-bottom: 0px;
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
  font-size: 0.em;
  color: #000000;
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



.text-container span {
  font-size: 0.2em;
  color: #000000;
  font-weight: 500;
}

span {
  font-size: 1em;
  color: #000000ac;
  font-weight: 500;
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
  background-color: #00e1ff36;

  border: 1px solid #07d30069;
  color: #0070a4;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  border-radius: 10px;
  text-align: center;
  width: 320px;
}

.numerador h3 {
  font-size: 1.05em;
  font-weight: 600;
  color: #4a4a4a;
  text-transform: uppercase;
  text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.112);
  margin: 0;
}

.numerador span {
  color: #021700;
  font-size: 1.4rem;
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



/**estulos para modal y boton */

.btn-editar {
  margin-top: 1rem;
  background-color: #0070a4;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
}

.modal input,
.modal select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.4rem 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.modal-buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #28a745;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #dc3545;
  color: white;
}

</style>
