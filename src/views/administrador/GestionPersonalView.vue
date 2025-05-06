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
    
        <!-- Add/Edit Persona Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
            <h3>{{ isEditMode ? 'Editar Persona' : 'Añadir Persona' }}</h3>
            <input v-model="persona.nombre" placeholder="Nombre" />
            <input v-model="persona.apellido_paterno" placeholder="Apellido Paterno" />
            <input v-model="persona.apellido_materno" placeholder="Apellido Materno" />
            <input v-model="persona.correo" placeholder="Correo" type="email" />
            <input v-model="persona.telefono" placeholder="Teléfono" />
            <input v-model="persona.direccion" placeholder="Dirección" />
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
    import ExcelJS from 'exceljs'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    
    export default {
        name: 'VistaPersonalAdmin',
        components: { NavbarAdminComponent },
        data() {
        return {
            personal: [],
            persona: {
            id_usuario: null,
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            correo: '',
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
        computed: {
        filteredPersonal() {
            return this.personal.filter(p => {
            const matchesName = p.nombre.toLowerCase().includes(this.filterName.toLowerCase())
            const matchesPa = p.apellido_paterno.toLowerCase().includes(this.filterApellidoPa.toLowerCase())
            const matchesActivo = this.filterActivo === '' || String(p.activo) === this.filterActivo
            return matchesName && matchesPa && matchesActivo
            })
        }
        },
        methods: {
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
        cancelDownload() {
            this.closeDownloadModal()
        },
        async downloadExcel(name) {
            const workbook = new ExcelJS.Workbook()
            const sheet = workbook.addWorksheet('Personal')
            sheet.addRow(['CI', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Correo', 'Teléfono', 'Dirección', 'Activo'])
            this.filteredPersonal.forEach(p =>
            sheet.addRow([
                p.id_usuario,
                p.nombre,
                p.apellido_paterno,
                p.apellido_materno,
                p.correo,
                p.telefono,
                p.direccion,
                p.activo ? 'Activo' : 'Inactivo'
            ])
            )
            const buf = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${name}.xlsx`
            a.click()
            URL.revokeObjectURL(url)
        },
        downloadPDF(name) {
            const doc = new jsPDF()
            autoTable(doc, {
            head: [['CI', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Correo', 'Teléfono', 'Dirección', 'Activo']],
            body: this.filteredPersonal.map(p => [
                p.id_usuario,
                p.nombre,
                p.apellido_paterno,
                p.apellido_materno,
                p.correo,
                p.telefono,
                p.direccion,
                p.activo ? 'Activo' : 'Inactivo'
            ])
            })
            doc.save(`${name}.pdf`)
        },
        showAddModal() {
            this.resetPersona()
            this.isEditMode = false
            this.showModal = true
        },
        showEditModal(p) {
            this.persona = { ...p }
            this.isEditMode = true
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
        },
        savePersona() {
            if (this.isEditMode) {
            const idx = this.personal.findIndex(u => u.id_usuario === this.persona.id_usuario)
            if (idx !== -1) this.personal.splice(idx, 1, { ...this.persona })
            } else {
            this.persona.id_usuario = Date.now()
            this.personal.push({ ...this.persona })
            }
            this.closeModal()
        },
        toggleActivo(p) {
            p.activo = p.activo === 1 ? 0 : 1
        },
        resetPersona() {
            this.persona = { id_usuario: null, nombre: '', apellido_paterno: '', apellido_materno: '', correo: '', telefono: '', direccion: '', activo: 1 }
        }
        },
        mounted() {
        this.personal = [
            { id_usuario: 1001, nombre: 'Ana', apellido_paterno: 'Gómez', apellido_materno: 'López', correo: 'ana.gomez@example.com', telefono: '78901234', direccion: 'Calle A #123', activo: 1 },
            { id_usuario: 1002, nombre: 'Luis', apellido_paterno: 'Martínez', apellido_materno: 'Pérez', correo: 'luis.martinez@example.com', telefono: '71234567', direccion: 'Av. B #456', activo: 0 },
            { id_usuario: 1003, nombre: 'María', apellido_paterno: 'Rodríguez', apellido_materno: 'Díaz', correo: 'maria.rodriguez@example.com', telefono: '79876543', direccion: 'Plaza C #789', activo: 1 },
            { id_usuario: 1004, nombre: 'Carlos', apellido_paterno: 'Fernández', apellido_materno: 'García', correo: 'carlos.fernandez@example.com', telefono: '71234568', direccion: 'Calle D #123', activo: 1 },
            { id_usuario: 1005, nombre: 'Elena', apellido_paterno: 'Hernández', apellido_materno: 'Ruiz', correo: 'elena.hernandez@example.com', telefono: '78901235', direccion: 'Av. E #456', activo: 0 },
            { id_usuario: 1006, nombre: 'Jorge', apellido_paterno: 'López', apellido_materno: 'Martínez', correo: 'jorge.lopez@example.com', telefono: '79876544', direccion: 'Plaza F #789', activo: 1 },
            { id_usuario: 1007, nombre: 'Lucía', apellido_paterno: 'Pérez', apellido_materno: 'Sánchez', correo: 'lucia.perez@example.com', telefono: '71234569', direccion: 'Calle G #321', activo: 0 },
            { id_usuario: 1008, nombre: 'Miguel', apellido_paterno: 'Ramírez', apellido_materno: 'Torres', correo: 'miguel.ramirez@example.com', telefono: '78901236', direccion: 'Av. H #654', activo: 1 },
            { id_usuario: 1009, nombre: 'Sofía', apellido_paterno: 'Gómez', apellido_materno: 'Vargas', correo: 'sofia.gomez@example.com', telefono: '79876545', direccion: 'Plaza I #987', activo: 1 },
            { id_usuario: 1010, nombre: 'Diego', apellido_paterno: 'Martínez', apellido_materno: 'Castro', correo: 'diego.martinez@example.com', telefono: '71234570', direccion: 'Calle J #111', activo: 0 },
            { id_usuario: 1011, nombre: 'Valeria', apellido_paterno: 'Rodríguez', apellido_materno: 'Morales', correo: 'valeria.rodriguez@example.com', telefono: '78901237', direccion: 'Av. K #222', activo: 1 },
            { id_usuario: 1012, nombre: 'Andrés', apellido_paterno: 'Sánchez', apellido_materno: 'Ortega', correo: 'andres.sanchez@example.com', telefono: '79876546', direccion: 'Plaza L #333', activo: 1 },
            { id_usuario: 1013, nombre: 'Camila', apellido_paterno: 'Torres', apellido_materno: 'Rojas', correo: 'camila.torres@example.com', telefono: '71234571', direccion: 'Calle M #444', activo: 0 }
        ]
        }
    }
</script>
  
<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    body {
        background-color: var(--color-fondo);
        color: var(--color-texto);
        line-height: 1.6;
    }
    .contenedor {
        width: 90%;
        max-width: 1200px;
        margin: 0 auto;
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
  