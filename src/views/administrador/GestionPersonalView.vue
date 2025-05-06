<template>
    <div class="pagina-inicio">
        <NavbarAdminComponent />

        <section class="tabla">
            <div class="fondo-tabla">
            <div class="filtros">
                <input
                type="text"
                v-model="filterName"
                placeholder="Buscar por nombre..."
                />
                <input
                type="text"
                v-model="filterApellidoPa"
                placeholder="Buscar por apellido paterno..."
                />
                <input
                type="text"
                v-model="filterApellidoMa"
                placeholder="Buscar por apellido materno..."
                />
                <button class="descargar" @click="prepareDownload('excel')">
                Descargar Excel
                </button>
                <button class="descargar" @click="prepareDownload('pdf')">
                Descargar PDF
                </button>
            </div>
    
            <div class="table-wrapper">
                <table>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="persona in personal" :key="persona.id_usuario">
                    <td data-label="ID">{{ persona.id_usuario }}</td>
                    <td data-label="Nombre">{{ persona.nombre }}</td>
                    <td data-label="Apellido Paterno">{{ persona.apellido_paterno }}</td>
                    <td data-label="Apellido Materno">{{ persona.apellido_materno }}</td>
                    <td data-label="Correo">{{ persona.correo }}</td>
                    <td data-label="Teléfono">{{ persona.telefono }}</td>
                    <td data-label="Dirección">{{ persona.direccion }}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </section>
    </div>
</template>
  
<script>
    import NavbarAdminComponent from '@/components/navbarAdministrador.vue'
    import ExcelJS from 'exceljs'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import 'jspdf-autotable'
    
    export default {
        name: 'VistaPersonalAdmin',
        components: { NavbarAdminComponent },
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
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .tabla {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    }

    .fondo-tabla {
        background: var(--color-fondo);
        padding: 2rem;
        border-radius: 8px;
        width: 95%;
        height: 95%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .filtros {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
    .filtros input {
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
    .filtros input:focus {
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

    @media (max-width: 768px) {
        .table-wrapper {
            overflow-x: auto; /* Habilitar scroll horizontal */
            overflow-y: auto; /* Habilitar scroll vertical */
            max-height: 400px; /* Ajustar la altura según sea necesario */
        }
    }
</style>
  