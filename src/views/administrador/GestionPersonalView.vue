<template>
    <div class="pagina-inicio">
        <NavbarAdminComponent />
    
        <section class="tabla">
            <div class="fondo-tabla">
            <div class="filtros">
                <input type="text" v-model="filterName" placeholder="Buscar nombre..." />
                <input type="text" v-model="filterApellidoPa" placeholder="Buscar apellido paterno..." />
                <select v-model="filterActivo">
                <option value="">Todos</option>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
                </select>
                <button class="descargar" @click="openDownloadModal('excel')">Descargar Excel</button>
                <button class="descargar" @click="openDownloadModal('pdf')">Descargar PDF</button>
            </div>
    
            <div class="table-wrapper">
                <table>
                <thead>
                    <tr>
                    <th>CI</th>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Activo</th>
                    <th>Modificar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="persona in filteredPersonal" :key="persona.id_usuario">
                    <td>{{ persona.id_usuario }}</td>
                    <td>{{ persona.nombre }}</td>
                    <td>{{ persona.apellido_paterno }}</td>
                    <td>{{ persona.apellido_materno }}</td>
                    <td>{{ persona.correo }}</td>
                    <td>{{ persona.telefono }}</td>
                    <td>{{ persona.direccion }}</td>
                    <td>
                        <img
                        :src="persona.activo === 1
                            ? 'https://cdn-icons-png.flaticon.com/128/5290/5290062.png'
                            : 'https://cdn-icons-png.flaticon.com/128/5290/5290060.png'"
                        @click="toggleActivo(persona)"
                        style="cursor: pointer; width: 3rem"
                        />
                    </td>
                    <td>
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/5932/5932105.png"
                        @click="showEditModal(persona)"
                        style="cursor: pointer; width: 3rem"
                        />
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </section>
    
        <!-- Download Filename Modal -->
        <div v-if="showDownloadModal" class="modal-overlay" @click.self="closeDownloadModal">
            <div class="modal download-modal">
            <h3>Nombre del archivo</h3>
            <input
                type="text"
                v-model="fileName"
                placeholder="Introduce el nombre del archivo"
            />
            <div class="modal-actions">
                <button @click="confirmDownload">Confirmar</button>
                <button @click="cancelDownload">Cancelar</button>
            </div>
            </div>
        </div>
    
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
            <h3>{{ isEditMode ? 'Editar Persona' : 'Añadir Persona' }}</h3>
            <input v-model="persona.ci" placeholder="CI" />
            <input v-model="persona.nombre" placeholder="Nombre" />
            <input v-model="persona.apellido_paterno" placeholder="Apellido Paterno" />
            <input v-model="persona.apellido_materno" placeholder="Apellido Materno" />
            <input v-model="persona.correo" placeholder="Correo" type="email" />
            <input v-model="persona.telefono" placeholder="Teléfono" />
            <input v-model="persona.direccion" placeholder="Dirección" />
            <!-- SI es alta (isEditMode === false), pedir contraseña -->
            <input
            v-if="!isEditMode"
            v-model="persona.contrasenia"
            placeholder="Contraseña"
            type="password"
            />
            <div class="modal-actions">
                <button @click="savePersona">Guardar</button>
                <button @click="closeModal">Cancelar</button>
            </div>
            </div>
        </div>
    
        <button @click="showAddModal" class="btn-anadir">+</button>
    </div>
</template>
  
<script>
import NavbarAdminComponent from '@/components/navbarAdministrador.vue'
import { useUsuarioStore } from '@/stores/usuarioStore'
import ExcelJS from 'exceljs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  name: 'VistaPersonalAdmin',
  components: { NavbarAdminComponent },
  setup() {
    const usuarioStore = useUsuarioStore()
    return { usuarioStore }
  },
  data() {
    return {
      personal: [],
      persona: {
        idusuario: null,        // tu PK
        ci: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo: '',
        contrasenia: '',
        telefono: '',
        direccion: '',
        activo: 1
      },
      filterName: '',
      filterApellidoPa: '',
      filterActivo: '',
      showModal: false,
      showDownloadModal: false,
      isEditMode: false,
      downloadType: '',
      fileName: ''
    }
  },
  methods: {
    async fetchUsuarios() {
      this.personal = await this.usuarioStore.getUsuarios()
    },

    showAddModal() {
      this.resetPersona()
      this.isEditMode = false
      this.showModal = true
    },

    showEditModal(p) {
      // Mapea tu PK desde backend (por ej. idusuario)
      this.persona = {
        idusuario: p.idusuario || p.id_usuario,
        ci: p.ci,
        nombre: p.nombre,
        apellido_paterno: p.apellido_paterno,
        apellido_materno: p.apellido_materno,
        correo: p.correo,
        contrasenia: '',  // vacío para no mostrar la real
        telefono: p.telefono,
        direccion: p.direccion,
        activo: p.activo
      }
      this.isEditMode = true
      this.showModal = true
    },

    async savePersona() {
      try {
        if (this.isEditMode) {
          await this.usuarioStore.updateUsuarioData({
            idusuario: this.persona.idusuario,
            ci: this.persona.ci,
            nombre: this.persona.nombre,
            apellido_paterno: this.persona.apellido_paterno,
            apellido_materno: this.persona.apellido_materno,
            correo: this.persona.correo,
            telefono: this.persona.telefono,
            direccion: this.persona.direccion,
            activo: this.persona.activo
          })
        } else {
          await this.usuarioStore.registerUsuario({
            ci: this.persona.ci,
            nombre: this.persona.nombre,
            apellido_paterno: this.persona.apellido_paterno,
            apellido_materno: this.persona.apellido_materno,
            correo: this.persona.correo,
            contrasenia: this.persona.contrasenia,
            telefono: this.persona.telefono,
            direccion: this.persona.direccion
          })
        }

        await this.fetchUsuarios()
        this.closeModal()
      } catch (err) {
        console.error('Error al guardar/actualizar:', err.response?.data || err.message)
      }
    },

    toggleActivo(p) {
      p.activo = p.activo === 1 ? 0 : 1
    },

    resetPersona() {
      this.persona = {
        idusuario: null,
        ci: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo: '',
        contrasenia: '',
        telefono: '',
        direccion: '',
        activo: 1
      }
    },
    closeModal() {
      this.showModal = false
    },
    openDownloadModal(type) {
      this.downloadType = type
      this.fileName = `personal_${type}`
      this.showDownloadModal = true
    },
    closeDownloadModal() {
      this.showDownloadModal = false
    },
    confirmDownload() {
      if (this.downloadType === 'excel') this.downloadExcel(this.fileName)
      else this.downloadPDF(this.fileName)
      this.closeDownloadModal()
    },
    async downloadExcel(name) {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Personal')
      ws.addRow(['CI','Nombre','Apellido P.','Apellido M.','Correo','Teléfono','Dirección','Activo'])
      this.filteredPersonal.forEach(p => {
        ws.addRow([
          p.ci,
          p.nombre,
          p.apellido_paterno,
          p.apellido_materno,
          p.correo,
          p.telefono,
          p.direccion,
          p.activo ? 'Activo' : 'Inactivo'
        ])
      })
      const buf = await wb.xlsx.writeBuffer()
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${name}.xlsx`; a.click()
      URL.revokeObjectURL(url)
    },
    downloadPDF(name) {
      const doc = new jsPDF()
      autoTable(doc, {
        head: [['CI','Nombre','Apellido P.','Apellido M.','Correo','Teléfono','Dirección','Activo']],
        body: this.filteredPersonal.map(p => [
          p.ci,p.nombre,p.apellido_paterno,p.apellido_materno,
          p.correo,p.telefono,p.direccion,p.activo?'Activo':'Inactivo'
        ])
      })
      doc.save(`${name}.pdf`)
    }
  },
  computed: {
    filteredPersonal() {
      return this.personal.filter(p => {
        return p.nombre.toLowerCase().includes(this.filterName.toLowerCase()) &&
               p.apellido_paterno.toLowerCase().includes(this.filterApellidoPa.toLowerCase()) &&
               (this.filterActivo === '' || String(p.activo) === this.filterActivo)
      })
    }
  },
  async mounted() {
    await this.fetchUsuarios()
  }
}
</script>
  
<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        background-color: var(--color-fondo);
        color: var(--color-texto);
        line-height: 1.6;
    }

    html, body {
        height: 100%;
        overflow: hidden;
    }
    .pagina-inicio {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .tabla {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        padding-top: 4rem;
        background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    }

    .fondo-tabla {
        background: var(--color-fondo);
        padding: 2rem;
        border-radius: 8px;
        width: 95%;
        height: 78vh;
        display: flex;
        margin-top: 4rem;
        flex-direction: column;
        gap: 1rem;
    }

    .filtros {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
    .filtros input,
    .filtros select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: var(--color-terciario);
        color: var(--color-secundario);
        text-decoration-color: var(--color-secundario);
    }
    .filtros input::placeholder {
        color: var(--color-secundario);
    }
    .filtros input:focus,
    .filtros select:focus {
        border-color: var(--color-terciario);
        outline: none;
    }
    .filtros button.descargar {
        padding: 0.5rem 1rem;
        background-color: var(--color-secundario);
        color: var(--color-texto-claro);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .filtros button.descargar:hover {
        background-color: var(--color-accento);
        transform: translateY(-3px);
    }

    .table-wrapper {
        flex: 1;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    table {
        width: 100%;
        max-height: 80vh;
        border-collapse: collapse;
    }
    thead th {
        position: sticky;
        top: 0;
        background-color: var(--color-primario);
        color: var(--color-texto-claro);
        padding: 0.75rem;
        text-align: left;
        z-index: 2;
    }
    tbody td {
        padding: 0.75rem;
        border-bottom: 1px solid #ddd;
    }
    tbody tr:hover {
        background-color: #f1f1f1;
        transition: background-color 0.3s ease;
    }
    th, td {
        border: 1px solid #ccc;
        padding: 0.5rem;
        text-align: center;
    }

    .btn-anadir {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--color-terciario);
        color: var(--color-texto-claro);
        border: none;
        border-radius: 50%;
        width: 4rem;
        height: 4rem;
        font-size: 3rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal {
        background: #fff;
        padding: 1.5rem;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        text-align: center;
    }
    .modal input {
        width: 100%;
        padding: 0.5rem;
        margin: 1rem 0;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .modal-actions {
        display: flex;
        justify-content: space-around;
    }
    .modal-actions button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .modal-actions button:first-child {
        background-color: var(--color-accento);
        color: var(--color-texto-claro);
    }
    .modal-actions button:last-child {
        background-color: #ccc;
        color: #333;
    }

    .modal.download-modal {
        max-width: 600px;
    }

    @media (max-width: 768px) {
        .table-wrapper {
            overflow-x: auto; 
            overflow-y: auto;
            max-height: 400px;
        }
    }
</style>
  