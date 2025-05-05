<template>
    
    <div class="app-container">
      <!-- Sidebar de Exámenes Clínicos -->
      <nav class="checkup-sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Exámenes Clínicos</h2>
          <button class="upload-toggle-btn" @click="toggleUploadSidebar">
            <i class="upload-icon"></i> Subir Archivos
          </button>
          <button class="comodin-toggle-btn" @click="toggleCustomExamModal">
            <i class="custom-icon"></i> Examen Personalizado
          </button>
        </div>
  
        <div class="search-container">
          <input v-model="searchTerm" type="text" placeholder="Buscar examen..." class="search-input">
        </div>
        <!-- Filtros por especialidad -->
        <div class="specialty-filters">
          <h3 class="filter-title">Filtrar por especialidad:</h3>
          <div class="filter-grid">
            <button v-for="specialty in specialties" :key="specialty.id" class="filter-btn"
              :class="{ 'active': activeFilter === specialty.id }" @click="setActiveFilter(specialty.id)">
              {{ specialty.name }}
            </button>
          </div>
        </div>
        <ul class="checkup-list">
          <li v-for="checkup in filteredCheckups" :key="checkup.id" class="checkup-item" @click="selectCheckup(checkup)">
            {{ checkup.name }}
            <span class="checkup-category">{{ checkup.category }}</span>
          </li>
        </ul>
      </nav>
  
      <!-- Sidebar de Subida de Archivos -->
      <aside class="upload-sidebar" v-if="showUploadSidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Subir Archivos</h2>
          <button class="close-upload-btn" @click="toggleUploadSidebar">
            &times;
          </button>
        </div>
  
        <div class="file-upload-container">
          <div class="upload-area" @dragover.prevent @drop="handleDrop">
            <input type="file" id="fileInput" ref="fileInput" multiple @change="handleFileSelect" class="file-input">
            <label for="fileInput" class="upload-label">
              <i class="upload-cloud-icon"></i>
              <p>Arrastra archivos aquí o haz clic para seleccionar</p>
              <p class="upload-hint">Formatos soportados: PDF, JPG, PNG, DICOM</p>
            </label>
          </div>
  
          <div class="uploaded-files">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
              <div class="file-info">
                <i :class="fileIcon(file.type)"></i>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
              </div>
              <textarea v-model="file.descriptions[file.descriptions.length - 1]" placeholder="Descripción del archivo..."
                class="file-description" rows="2"></textarea>
              <button @click="removeFile(index)" class="remove-file-btn">
                &times;
              </button>
            </div>
          </div>
        </div>
      </aside>
  
      <!-- Main Content -->
      <main class="consultation-main" :class="{ 'with-upload-sidebar': showUploadSidebar }">
        <div class="patient-header">
          <h1 class="main-title">CITA EN CURSO: <span class="patient-name">{{ currentPatient }}</span></h1>
          <div class="consultation-info">
        <span><strong>Médico:</strong> {{ doctorName }}</span>
        <span><strong>Fecha y hora:</strong> {{ currentDateTime }}</span>
      </div>
        </div>
  
        <form @submit.prevent="guardarConsulta" class="consultation-form">
          <!-- Sección de Resultados Públicos -->
          <section class="form-section public-section">
            <header class="section-header">
              <h3 class="section-title">Resultados de la Consulta</h3>
              <div class="public-badge">Público</div>
            </header>
  
            <div class="form-content">
              <div class="input-group">
                <label class="input-label">
                  Diagnóstico y Recomendaciones
                  <textarea v-model="resultadosPublicos" class="medical-textarea"
                    placeholder="Redacte los resultados visibles para el paciente..." rows="4"></textarea>
                </label>
              </div>
            </div>
          </section>
  
          <!-- Secciones de Exámenes -->
          <section v-for="(formulario, index) in formulariosActivos" :key="index" class="form-section"
            :class="{ 'public-section': formulario.data.esPublico }">
            <header class="section-header">
              <div class="section-title-container">
                <h3 class="section-title">{{ formulario.nombre }}</h3>
                <button @click="removeCheckup(index)" class="remove-checkup-btn">
                  <i class="remove-icon"></i>
                </button>
              </div>
              <label class="visibility-toggle">
                <input type="checkbox" v-model="formulario.data.esPublico" class="visually-hidden" />
                <span class="toggle-label">
                  {{ formulario.data.esPublico ? 'Público' : 'Confidencial' }}
                </span>
                <span class="toggle-badge"></span>
              </label>
            </header>
  
            <div class="form-content">
              <textarea v-model="formulario.data.resultados" class="medical-textarea2"
                :placeholder="`Redacte resultados de ${formulario.nombre}...`" rows="4"></textarea>
  
  
            </div>
          </section>
  
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="limpiarFormulario">
              Limpiar
            </button>
            <button type="submit" class="submit-button">
              <i class="save-icon"></i> Guardar Consulta
            </button>
          </div>
        </form>
      </main>
    </div>
    <!-- Modal para Examen Personalizado -->
    <div v-if="showCustomExamModal" class="custom-exam-modal">
      <div class="modal-content">
        <h3>Crear Examen Personalizado</h3>
        <input v-model="nuevoExamenNombre" type="text" placeholder="Nombre del examen" class="modal-input">
        <div class="modal-actions">
          <button @click="toggleCustomExamModal" class="modal-cancel">Cancelar</button>
          <button @click="agregarExamenPersonalizado" class="modal-confirm">Agregar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  import html2pdf from 'html2pdf.js';
  export default {
    components: {
      
    },
    data() {
      return {
        currentPatient: '',
        patientCI: '',
        doctorName: '',
        currentDateTime: new Date().toLocaleString(), 
        searchTerm: "",
        activeFilter: 'all',
        showUploadSidebar: false,
        showCustomExamModal: false,
        nuevoExamenNombre: '',
        resultadosPublicos: "",
        uploadedFiles: [],
        checkupOptions: [
          // Medicina General
          { id: 1, name: 'Control de Peso', tipo: 'antropometrico', category: 'Antropometría', specialty: 'general' },
          { id: 2, name: 'Examen Físico General', tipo: 'general', category: 'Examen Básico', specialty: 'general' },
          { id: 3, name: 'Presión Arterial', tipo: 'cardiovascular', category: 'Cardiología', specialty: 'general' },
  
          // Cardiología
          { id: 4, name: 'Electrocardiograma', tipo: 'cardiaco', category: 'Estudios Cardíacos', specialty: 'cardiologia' },
          { id: 5, name: 'Ecocardiograma', tipo: 'imagen', category: 'Imagenología Cardíaca', specialty: 'cardiologia' },
          { id: 6, name: 'Prueba de Esfuerzo', tipo: 'cardiaco', category: 'Pruebas Funcionales', specialty: 'cardiologia' },
  
          // Radiología
          { id: 7, name: 'Radiografía de Tórax', tipo: 'imagen', category: 'Radiografía', specialty: 'radiologia' },
          { id: 8, name: 'Tomografía Computarizada', tipo: 'imagen', category: 'Tomografía', specialty: 'radiologia' },
          { id: 9, name: 'Resonancia Magnética', tipo: 'imagen', category: 'RMN', specialty: 'radiologia' },
  
          // Pediatría
          { id: 10, name: 'Control de Desarrollo', tipo: 'pediatrico', category: 'Desarrollo Infantil', specialty: 'pediatria' },
          { id: 11, name: 'Vacunación', tipo: 'inmunizacion', category: 'Prevención', specialty: 'pediatria' },
          { id: 12, name: 'Prueba de Audición', tipo: 'audiometria', category: 'Otorrinolaringología', specialty: 'pediatria' },
  
          // Ginecología
          { id: 13, name: 'Papanicolaou', tipo: 'laboratorio', category: 'Citología', specialty: 'ginecologia' },
          { id: 14, name: 'Ultrasonido Obstétrico', tipo: 'imagen', category: 'Ecografía', specialty: 'ginecologia' },
          { id: 15, name: 'Mamografía', tipo: 'imagen', category: 'Estudio Mamario', specialty: 'ginecologia' },
  
          // Traumatología
          { id: 16, name: 'Radiografía Ósea', tipo: 'imagen', category: 'Estudio Óseo', specialty: 'traumatologia' },
          { id: 17, name: 'Densitometría Ósea', tipo: 'imagen', category: 'Densidad Mineral', specialty: 'traumatologia' },
          { id: 18, name: 'Artroscopia', tipo: 'procedimiento', category: 'Estudio Articular', specialty: 'traumatologia' },
  
          // Neurología
          { id: 19, name: 'Electroencefalograma', tipo: 'neurologico', category: 'Estudio Cerebral', specialty: 'neurologia' },
          { id: 20, name: 'EMG', tipo: 'neurologico', category: 'Conducción Nerviosa', specialty: 'neurologia' },
  
          // Gastroenterología
          { id: 21, name: 'Endoscopia Digestiva', tipo: 'procedimiento', category: 'Estudio Digestivo', specialty: 'gastroenterologia' },
          { id: 22, name: 'Colonoscopía', tipo: 'procedimiento', category: 'Estudio Colónico', specialty: 'gastroenterologia' },
  
          // Dermatología
          { id: 23, name: 'Biopsia de Piel', tipo: 'laboratorio', category: 'Estudio Tisular', specialty: 'dermatologia' },
          { id: 24, name: 'Prueba de Alergias', tipo: 'inmunologia', category: 'Alergología', specialty: 'dermatologia' },
  
          // Endocrinología
          { id: 25, name: 'Curva de Glucosa', tipo: 'laboratorio', category: 'Metabolismo', specialty: 'endocrinologia' },
          { id: 26, name: 'Estudio Tiroideo', tipo: 'laboratorio', category: 'Hormonas', specialty: 'endocrinologia' },
  
          // Neumología
          { id: 27, name: 'Espirometría', tipo: 'funcional', category: 'Capacidad Pulmonar', specialty: 'neumologia' },
          { id: 28, name: 'Oximetría', tipo: 'monitoreo', category: 'Saturación Oxígeno', specialty: 'neumologia' },
  
          // Nefrología
          { id: 29, name: 'Análisis de Creatinina', tipo: 'laboratorio', category: 'Función Renal', specialty: 'nefrologia' },
          { id: 30, name: 'Ecografía Renal', tipo: 'imagen', category: 'Estudio Renal', specialty: 'nefrologia' },
  
          // Oftalmología
          { id: 31, name: 'Fondo de Ojo', tipo: 'oftalmologico', category: 'Estudio Retinal', specialty: 'oftalmologia' },
          { id: 32, name: 'Tonometría', tipo: 'oftalmologico', category: 'Presión Intraocular', specialty: 'oftalmologia' },
  
          // Psiquiatría
          { id: 33, name: 'Evaluación Psiquiátrica', tipo: 'consulta', category: 'Salud Mental', specialty: 'psiquiatria' },
          { id: 34, name: 'Test de Depresión', tipo: 'evaluacion', category: 'Escalas Clínicas', specialty: 'psiquiatria' },
  
          // Oncología
          { id: 35, name: 'Biopsia Tumoral', tipo: 'laboratorio', category: 'Estudio Oncológico', specialty: 'oncologia' },
          { id: 36, name: 'PET Scan', tipo: 'imagen', category: 'Metabolismo Celular', specialty: 'oncologia' }
        ],
        specialties: [
          { id: 'all', name: 'Todos' },
          { id: 'general', name: 'Medicina General' },
          { id: 'cardiologia', name: 'Cardiología' },
          { id: 'radiologia', name: 'Radiología' },
          { id: 'pediatria', name: 'Pediatría' },
          { id: 'ginecologia', name: 'Ginecología' },
          { id: 'traumatologia', name: 'Traumatología' },
          { id: 'neurologia', name: 'Neurología' },
          { id: 'gastroenterologia', name: 'Gastroenterología' },
          { id: 'dermatologia', name: 'Dermatología' },
          { id: 'endocrinologia', name: 'Endocrinología' },
          { id: 'neumologia', name: 'Neumología' },
          { id: 'nefrologia', name: 'Nefrología' },
          { id: 'oftalmologia', name: 'Oftalmología' },
          { id: 'psiquiatria', name: 'Psiquiatría' },
          { id: 'oncologia', name: 'Oncología' }
        ],
        formulariosActivos: [],
      };
    },
    created() {
      // Obtener los parámetros de la URL
      this.currentPatient = this.$route.query.paciente || "Paciente no especificado";
      this.patientCI = this.$route.query.ci ? `(CI: ${this.$route.query.ci})` : "";
      this.doctorName = this.$route.query.medico || "Dr. No Especificado";
      
      // También puedes obtener la fecha actual
      this.currentDateTime = new Date().toLocaleString();
    },
    computed: {
      filteredCheckups() {
        let filtered = this.checkupOptions;
  
        // Filtrar por término de búsqueda
        if (this.searchTerm) {
          filtered = filtered.filter(checkup =>
            checkup.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            checkup.category.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
  
        // Filtrar por especialidad
        if (this.activeFilter !== 'all') {
          filtered = filtered.filter(checkup => checkup.specialty === this.activeFilter);
        }
  
        return filtered;
      }
    },
    methods: {
      setActiveFilter(specialtyId) {
        this.activeFilter = specialtyId;
      },
      toggleCustomExamModal() {
        this.showCustomExamModal = !this.showCustomExamModal;
        this.nuevoExamenNombre = ''; // Resetear nombre al abrir
      },
  
      agregarExamenPersonalizado() {
        if (this.nuevoExamenNombre.trim()) {
          const defaultData = {
            esPublico: false,
            resultados: ''
          };
  
          this.formulariosActivos.push({
            nombre: this.nuevoExamenNombre,
            tipo: 'personalizado',
            data: { ...defaultData }
          });
  
          this.toggleCustomExamModal();
        }
      },
      removeCheckup(index) {
        this.formulariosActivos.splice(index, 1);
      },
      toggleUploadSidebar() {
        this.showUploadSidebar = !this.showUploadSidebar;
      },
      selectCheckup(checkup) {
        if (!this.formulariosActivos.some(f => f.tipo === checkup.tipo)) {
          const defaultData = {
            esPublico: false,
            peso: null,
            altura: null,
            ritmo: null,
            presion: null,
            tipoAnalisis: 'hemograma',
            resultados: ''
          };
  
          this.formulariosActivos.push({
            nombre: checkup.name,
            tipo: checkup.tipo,
            data: { ...defaultData }
          });
        }
      },
      handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
      },
      handleDrop(event) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
      },
      processFiles(files) {
        files.forEach(file => {
          this.uploadedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            file: file,
            descriptions: ['']
          });
        });
      },
      removeFile(index) {
        this.uploadedFiles.splice(index, 1);
      },
      fileIcon(type) {
        if (type.includes('image')) return 'file-icon image-file';
        if (type.includes('pdf')) return 'file-icon pdf-file';
        return 'file-icon generic-file';
      },
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      calcularIMC(peso, altura) {
        const alturaMetros = altura / 100;
        const imc = peso / (alturaMetros * alturaMetros);
        return imc.toFixed(1);
      },
      limpiarFormulario() {
        this.formulariosActivos = [];
        this.resultadosPublicos = "";
      },
      async guardarConsulta() {
        try {
          // Generar PDF completo
          await this.generarPDF('completo');
          
          // Generar PDF solo público si hay contenido público
          if (this.tieneContenidoPublico()) {
            await this.generarPDF('publico');
          }
          
          alert('PDFs generados exitosamente');
        } catch (error) {
          console.error('Error al generar PDFs:', error);
          alert('Error al generar los PDFs');
        }
      },
      
      tieneContenidoPublico() {
        // Verificar si hay resultados públicos
        if (this.resultadosPublicos.trim()) return true;
        
        // Verificar si hay exámenes marcados como públicos con contenido
        return this.formulariosActivos.some(form => 
          form.data.esPublico && form.data.resultados.trim()
        );
      },
      
     async generarPDF(tipo) {
    // Obtener fecha y hora formateada
    const now = new Date();
    const fechaHora = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    // Crear contenedor temporal
    const element = document.createElement('div');
    element.className = 'pdf-container';
    
    // Encabezado único (eliminé el encabezado anterior y dejé solo este)
    element.innerHTML = `
      <div style="text-align:center; margin-bottom:20px;">
        <h1 style="color:#056d70;margin-bottom:5px;">
          ${tipo === 'publico' ? 'INFORME PÚBLICO' : 'INFORME MÉDICO COMPLETO'}
        </h1>
        <h2 style="color:#333;font-size:1.2em;margin-bottom:5px;">
          ${this.currentPatient}
        </h2>
        <div style="display:flex; justify-content:center; gap:30px; margin-bottom:10px;">
          <div><strong>Médico:</strong> ${this.doctorName}</div>
          <div><strong>Fecha:</strong> ${fechaHora}</div>
        </div>
      </div>
      <hr style="border-top:1px solid #056d70;margin-bottom:20px;">
    `;
    
    // Resultados públicos (sin encabezado aquí)
    if (this.resultadosPublicos.trim() && (tipo === 'completo' || tipo === 'publico')) {
      element.innerHTML += `
        <h2 style="color:#056d70;border-bottom:1px solid #eee;padding-bottom:5px;">
          Resultados de la Consulta
        </h2>
        <div style="padding:10px;margin-bottom:20px;">
          ${this.resultadosPublicos.replace(/\n/g, '<br>')}
        </div>
      `;
    }
        
        // Exámenes
        this.formulariosActivos.forEach(form => {
          if (form.data.resultados.trim() && (tipo === 'completo' || form.data.esPublico)) {
            element.innerHTML += `
              <h3 style="color:#333;">
                ${form.nombre} ${tipo === 'completo' ? `(${form.data.esPublico ? 'Público' : 'Confidencial'})` : ''}
              </h3>
              <div style="border-left:3px solid ${form.data.esPublico ? '#056d70' : '#ccc'};padding-left:10px;margin-bottom:15px;">
                ${form.data.resultados.replace(/\n/g, '<br>')}
              </div>
            `;
          }
        });
        
        // Archivos adjuntos (solo para PDF completo)
        if (tipo === 'completo' && this.uploadedFiles.length > 0) {
          element.innerHTML += '<h2 style="color:#056d70;border-bottom:1px solid #eee;padding-bottom:5px;">Archivos Adjuntos</h2>';
          
          for (const file of this.uploadedFiles) {
            if (file.type.startsWith('image/')) {
              // Para imágenes: crear elemento img y esperar a que cargue
              const imgContainer = document.createElement('div');
              imgContainer.style.margin = '10px 0';
              imgContainer.innerHTML = `
                <p><strong>${file.name}</strong></p>
                ${file.descriptions[0] ? `<p>${file.descriptions[0]}</p>` : ''}
              `;
              
              const img = document.createElement('img');
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.border = '1px solid #eee';
              img.style.marginTop = '5px';
              
              const imgPromise = new Promise((resolve) => {
                img.onload = resolve;
                const reader = new FileReader();
                reader.onload = (e) => {
                  img.src = e.target.result;
                };
                reader.readAsDataURL(file.file);
              });
              
              imgContainer.appendChild(img);
              element.appendChild(imgContainer);
              await imgPromise; // Esperar a que la imagen cargue
            } else {
              // Para archivos no imágenes
              element.innerHTML += `
                <div style="margin:10px 0;">
                  <p><strong>${file.name}</strong></p>
                  ${file.descriptions[0] ? `<p>${file.descriptions[0]}</p>` : ''}
                  <p style="color:#666;font-size:0.9em;">Tipo: ${file.type}</p>
                </div>
              `;
            }
          }
        }
        
        // Configuración del PDF
        const opt = {
          margin: 15,
          filename: `Informe_${tipo === 'publico' ? 'Publico' : 'Completo'}_${this.currentPatient.replace(/[^a-z0-9]/gi, '_')}_${now.getTime()}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            hotfixes: ["px_scaling"] 
          }
        };
        
        // Generar PDF
        await html2pdf().set(opt).from(element).save();
      },
    }
  };
  </script>
  
  <style scoped>
  /* Variables de color */
  .custom-exam-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .patient-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .main-title {
    color: #056d70;
    font-size: 1.5rem;
    margin: 0 0 10px 0;
  }
  
  .consultation-info {
    display: flex;
    gap: 20px;
    font-size: 0.9rem;
    color: #555;
  }
  
  .patient-name {
    color: var(--text-dark);
    font-weight: 600;
  }
  .pdf-export {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .pdf-export h1 {
    color: #056d70;
    font-size: 24px;
  }
  
  .pdf-export h2 {
    color: #056d70;
    font-size: 18px;
    margin-top: 20px;
    border-bottom: 1px solid #056d70;
    padding-bottom: 5px;
  }
  
  .pdf-export h3 {
    color: #333;
    font-size: 16px;
    margin-top: 15px;
  }
  
  .modal-input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  
  .modal-cancel,
  .modal-confirm {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modal-cancel {
    background: #eee;
  }
  
  .modal-confirm {
    background: #4CAF50;
    color: white;
  }
  
  /* Estilos base */
  .app-container {
    display: flex;
    min-height: 100vh;
  }
  
  /* Grid de filtros */
  .specialty-filters {
    margin: 1.5rem 0;
  }
  
  .filter-title {
    font-size: 0.875rem;
    color: var(--text-medium);
    margin-bottom: 0.75rem;
  }
  
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  
  .filter-btn:hover {
    border-color: var(--primary-color);
  }
  
  .filter-btn.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  /* Botón para eliminar examen individual */
  .section-title-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .remove-checkup-btn {
    background: #ecd3d3;
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
  }
  
  .remove-checkup-btn:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  .remove-icon {
    display: inline-block;
    width: 20px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d32f2f'%3E%3Cpath d='M19 13H5v-2h14v2z'/%3E%3C/svg%3E");
    background-size: contain;
  }
  
  /* Ajustes responsive */
  @media (max-width: 768px) {
    .filter-grid {
      grid-template-columns: 1fr;
    }
  
    .checkup-item {
      padding: 1rem;
    }
  }
  
  /* Sidebar de Exámenes Clínicos */
  .checkup-sidebar {
    width: 400px;
    background: rgb(228, 243, 242);
  
    border-right: 1px solid var(--border-color);
    padding: 1.5rem;
    position: fixed;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
  }
  
  .checkup-sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .sidebar-title {
    color: #056d70;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
  
  .upload-toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #056d70;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;
  }
  
  .comodin-toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #323636;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;
  }
  
  
  .upload-toggle-btn:hover {
    opacity: 0.9;
  }
  
  .upload-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5M12 4v12m-4-4l4 4 4-4'/%3E%3C/svg%3E");
    background-size: contain;
  }
  
  .search-container {
    margin-bottom: 1.5rem;
  
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #0121226c;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #056d70;
    box-shadow: 0 0 0 2px rgba(26, 79, 139, 0.2);
  }
  
  .checkup-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .checkup-item {
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
    background-color: rgb(254, 255, 255);
    box-shadow: 6px 7px 19px -7px rgb(185, 185, 185);
    color: var(--text-dark);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
  }
  
  .checkup-item:hover {
    background-color: var(--primary-light);
  }
  
  .checkup-category {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-top: 0.25rem;
  }
  
  /* Sidebar de Subida de Archivos */
  .upload-sidebar {
    width: 350px;
    background: white;
    border-left: 1px solid var(--border-color);
    padding: 1.5rem;
    position: fixed;
    right: 0;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .close-upload-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-light);
    cursor: pointer;
    padding: 0 0.5rem;
  }
  
  .close-upload-btn:hover {
    color: var(--text-dark);
  }
  
  .file-upload-container {
    margin-top: 1rem;
  }
  
  .upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1.5rem;
  }
  
  .upload-area:hover {
    border-color: #056d70;
    background-color: var(--primary-light);
  }
  
  .file-input {
    display: none;
  }
  
  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .upload-cloud-icon {
    display: inline-block;
    width: 48px;
    height: 48px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231a4f8b'%3E%3Cpath d='M8 17a4 4 0 0 1 0-8 4 4 0 0 1 8 0 4 4 0 0 1 0 8m0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z'/%3E%3C/svg%3E");
    background-size: contain;
  }
  
  .upload-hint {
    font-size: 0.75rem;
    color: var(--text-light);
  }
  
  .uploaded-files {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .file-item {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.75rem;
    position: relative;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .file-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .image-file {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338a169'%3E%3Cpath d='M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m0 2v14h14l-3.5-4.5-2.5 3-3.5-4.5L5 5z'/%3E%3C/svg%3E");
  }
  
  .pdf-file {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e53e3e'%3E%3Cpath d='M6 2h8v4h4v4h-4v8H6V2m2 2v12h4V8h4V6h-4V4H8z'/%3E%3C/svg%3E");
  }
  
  .generic-file {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234a5568'%3E%3Cpath d='M6 2h8v4h4v14H6V2m2 2v16h8V8h-4V4H8z'/%3E%3C/svg%3E");
  }
  
  .file-name {
    font-weight: 500;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-size {
    font-size: 0.75rem;
    color: var(--text-light);
  }
  
  .file-description {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    resize: vertical;
  }
  
  .remove-file-btn {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
  }
  
  .remove-file-btn:hover {
    color: var(--error-color);
  }
  
  /* Contenido Principal */
  .consultation-main {
    flex: 1;
    margin-left: 400px;
    padding: 2rem;
    transition: margin-right 0.3s ease;
  }
  
  
  .consultation-main.with-upload-sidebar {
    margin-right: 350px;
  }
  
  .patient-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .main-title {
    color: #056d70;
    font-size: 1.5rem;
    margin: 0;
  }
  
  .patient-name {
    color: var(--text-dark);
    font-weight: 600;
  }
  
  .consultation-form {
    max-width: 1600px;
    margin: 0 auto;
  }
  
  /* Secciones del Formulario */
  .form-section {
    background: rgb(246, 251, 252);
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    box-shadow: 6px 7px 19px -7px rgb(202, 201, 201);
    border: 2px solid transparent;
  }
  
  .form-section.public-section {
    border-color: var(--public-color);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .section-title {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin: 0;
  }
  
  .public-badge {
    background: var(--public-color);
    color: rgb(124, 0, 0);
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
  }
  
  /* Toggle de Visibilidad */
  .visibility-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .toggle-label {
    color: var(--text-dark);
    font-size: 0.875rem;
    order: 2;
  }
  
  .toggle-badge {
    width: 48px;
    height: 24px;
    background: #96ce9d;
    border-radius: 12px;
    position: relative;
    transition: background 0.2s ease;
  }
  
  .toggle-badge::after {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
  
  input:checked+.toggle-label+.toggle-badge {
    background: #a00000;
  }
  
  input:checked+.toggle-label+.toggle-badge::after {
    transform: translateX(24px);
  }
  
  /* Contenido del Formulario */
  .form-content {
    padding: 1.5rem;
  }
  
  .input-group {
    margin-bottom: 1.5rem;
  }
  
  .input-label {
    display: block;
    color: var(--text-dark);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .medical-input,
  .medical-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    transition: border-color 0.2s ease;
    margin-bottom: 0.75rem;
  }
  
  .medical-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234a5568'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px;
  }
  
  .medical-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    min-height: 100px;
    resize: vertical;
  }
  
  .medical-textarea2 {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dbd7d7;
    border-radius: 0.5rem;
    min-height: 50px;
    resize: vertical;
  }
  
  .medical-input:focus,
  .medical-select:focus,
  .medical-textarea:focus,
  .medical-textarea2:focus {
    outline: none;
    border-color: #056d70;
    box-shadow: 0 0 0 2px rgba(26, 79, 139, 0.2);
  }
  
  .calculated-field {
    padding: 0.5rem;
    background-color: var(--primary-light);
    border-radius: 0.25rem;
    font-weight: 500;
    color: #056d70;
  }
  
  /* Acciones del Formulario */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .secondary-button {
    background-color: white;
    color: #056d70;
    padding: 0.75rem 1.5rem;
    border: 1px solid #056d70;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-button:hover {
    background-color: var(--primary-light);
  }
  
  .submit-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #056d70;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  
  .save-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4m-5 16a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3m3-10H5V5h10v4z'/%3E%3C/svg%3E");
    background-size: contain;
  }
  
  .submit-button:hover {
    opacity: 0.9;
  }
  
  /* Accesibilidad */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Responsive */
  @media (max-width: 1200px) {
  
    .checkup-sidebar,
    .upload-sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 100;
      transform: translateX(-100%);
    }
  
    .checkup-sidebar.active,
    .upload-sidebar.active {
      transform: translateX(0);
    }
  
    .consultation-main {
      margin-left: 0;
      margin-right: 0;
    }
  
    .consultation-main.with-upload-sidebar {
      margin-right: 0;
    }
  }
  
  @media (max-width: 768px) {
    .form-actions {
      flex-direction: column;
    }
  
    .secondary-button,
    .submit-button {
      width: 100%;
      justify-content: center;
    }
  }
  </style>