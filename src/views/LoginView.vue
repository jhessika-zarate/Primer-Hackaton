<template>
  <div class="modal-fondo">
    <video autoplay loop muted playsinline class="video-fondo">
      <source src="/images/fondoLogin2.mp4" type="video/mp4" />
      Tu navegador no soporta el elemento de video.
    </video>
    <div class="overlay"></div>
    <div class="modal-contenido">
      <div class="formulario-registro">
        <h2 class="titulo-paso">Inicio de sesión</h2>

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

        <div class="campo-formulario">
          <label>Usuario:</label>
          <input
            v-model="usuario.correo"
            type="email"
            placeholder="Ejemplo@correo.com"
          />
        </div>
        <div class="campo-formulario">
          <label>Contraseña:</label>
          <input
            v-model="usuario.contrasenia"
            type="password"
            placeholder="*********"
          />
        </div>

        <div class="acciones-formulario">
        
          <button @click="iniciarSesion()" class="boton boton-secundario">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2"; // Importar SweetAlert2
import Cookies from "js-cookie";
import { useUsuarioStore } from "@/stores/usuarioStore";export default {
  components: {},
  data() {
    return {
      pasoActual: 0,

      usuario: {
        correo: "",
        contrasenia: "",
      },
    };
  },
  computed: {},

  methods: {
    async iniciarSesion(){
      const response = await this.usuarioStore.login(this.usuario);
        console.log(response);
        if (response) {
           // Guardar en cookies
           console.log(response.token);
           console.log(response.idusuario);
           Cookies.set("token", response.token, { expires: 7, secure: false, sameSite: "Lax" });
Cookies.set("idusuario", response.idusuario, { expires: 7, secure: false, sameSite: "Lax" });

          Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: "Bienvenido a la aplicación",
          });
          this.$router.push({ name: "personal" });
           // Guardar en cookies
          } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Credenciales incorrectas",
          });
        }
    }
  },
  setup() {
    const usuarioStore = useUsuarioStore();
    return {
       usuarioStore
    };
  },
};
</script>
<style>
:root {
  --color-primario: #2f4156;
  --color-secundario: #013d5a;
  --color-terciario: #85a4ba;
  --color-fondo: #f5efeb;
  --color-accento: #968fb7;
  --color-texto: #333333;
  --color-texto-claro: #ffffff;
}
</style>
<style scoped>
/* Manteniendo la paleta de colores */

.modal-fondo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-fondo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

/* Overlay oscuro */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* Ajusta la opacidad según necesidad */
  z-index: -1;
}

.modal-contenido {
  width: 100%;
  padding-top: 2rem;
  padding-left: 32rem;
}

.container-cita {
  margin-bottom: -1rem;
}

h2.titulo-paso {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-primario);
  font-family: Montserrat;
  text-transform: uppercase;
  text-align: center;
  position: relative;
  padding-bottom: 8px;
}

h2.titulo-paso::after {
  content: "";
  display: block;
  width: 80px;
  height: 4px;
  background: var(--color-primario);
  margin: 10px auto 0;
  border-radius: 2px;
}

.acciones-formulario {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.boton {
  padding: 10px 20px;
  border: none;

  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(125, 125, 125, 0.267);
  margin: 1px;
  margin-top: 1rem;
}
.boton:hover {
  transform: scale(1.02);
}

.boton-primario {
  background: var(--color-terciario);
  color: white;
}

.boton-secundario {
  background: var(--color-primario);
  color: white;
}

.formulario-registro {
  width: 400px;
  margin: 0 auto;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.686);
}

.campo-formulario {
  margin-bottom: 0.5rem;
}

.campo-formulario label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primario);
  font-weight: 600;
}

.campo-formulario input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.campo-formulario input:focus {
  border-color: var(--color-accento);
  outline: none;
}

/* Cita Styles  que se ponga en 3 columnas*/
.cita {
  border-radius: 10px;
  flex: auto;
}
/**Tarjeta cita */
.a-box {
  display: inline-block;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.img-container {
  height: 180px;
  padding: 1px;
  width: 200px;
  overflow: hidden;
  border-radius: 0px 0px 20px 20px;
  display: inline-block;
}

.img-container img {
}

.inner-skew {
  position: relative;
  display: inline-block;
  border-radius: 20px;
  overflow: hidden;
  padding: 0px;
  font-size: 0px;

  height: 260px;
  width: 200px;
}

.inner-skew img {
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2));
  width: 85%;
  height: 65%;
  padding: 1px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

@media (max-width: 916px) {
  .modal-contenido {
    width: 100%;
    padding-top: 0rem;
    padding-left: 0rem;
  }
}
</style>
