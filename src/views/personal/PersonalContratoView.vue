<template>
  <div class="contrato">
    <div class="contract-container">
        <img src="https://via.placeholder.com/150x50?text=LOGO+EMPRESA" alt="Logo Empresa" class="company-logo">
        
        <div class="contract-header">
            <h1 class="contract-title">CONTRATO LABORAL</h1>
            
        </div>
        
        <div class="contract-body">
            <div class="contract-section">
                <h2 class="section-title">Datos de las Partes</h2>
              
                
                <div class="contract-clause">
                    <p><strong>Por una parte:</strong> ARCA LTDA, con domicilio en [DIRECCIÓN DE LA EMPRESA], en adelante "EL EMPLEADOR".</p>
                </div>
                
                <div class="contract-clause">
                    <p><strong>Por la otra parte:</strong> <span id="employee-name"></span>, mayor de edad, con Cédula de Identidad N° <span id="employee-ci"></span>, domiciliado en <span id="employee-address"></span>, en adelante "EL TRABAJADOR".</p>
                </div>
            </div>
            
            <div class="contract-section">
                <h2 class="section-title">Cláusulas del Contrato</h2>
                
                <div class="contract-clause">
                    <div class="clause-title">PRIMERA (OBJETO)</div>
                    <p>EL EMPLEADOR contrata los servicios de EL TRABAJADOR para el cargo de <span id="employee-position"></span> en el área de <span id="employee-area"></span>, quien acepta dicha contratación.</p>
                </div>
                
                <div class="contract-clause">
                    <div class="clause-title">SEGUNDA (DURACIÓN)</div>
                    <p>El presente contrato tendrá una duración de <span id="contract-duration"></span>, iniciando el <span id="contract-start-date"></span> y <span id="contract-end-clause"></span>.</p>
                </div>
                
                <div class="contract-clause">
                    <div class="clause-title">TERCERA (PERIODO DE PRUEBA)</div>
                    <p>Las partes acuerdan un período de prueba de <span id="probation-period"></span> días, durante el cual cualquiera de las partes podrá dar por terminada la relación laboral sin responsabilidad alguna.</p>
                </div>
                
                <div class="contract-clause">
                    <div class="clause-title">CUARTA (REMUNERACIÓN)</div>
                    <p>EL EMPLEADOR pagará a EL TRABAJADOR por sus servicios la suma de <span id="employee-salary"></span> Bolivianos (<span id="employee-salary-letters"></span>), pagaderos en la forma y condiciones establecidas en la política salarial de la empresa.</p>
                </div>
                
                <div id="additional-clauses-container">
                    <!-- Cláusulas adicionales se insertarán aquí dinámicamente -->
                </div>
            </div>
        </div>
        
        <div class="signature-section">
            <div class="signature-line">
                <p>Firma del Trabajador</p>
            </div>
            <div class="signature-line">
                <p>Firma del Representante</p>
            </div>
        </div>
        
        <div class="contract-footer">
            <p>Documento generado electrónicamente el <span id="generation-date"></span></p>
        </div>
    </div>
  </div>
</template>
    <script>
        // Función para cargar y procesar el JSON
        async function loadContractData() {
            
        }
        
        // Función para mostrar los datos en el contrato
        function displayContractData(data) {
            // Datos básicos del trabajador
            document.getElementById('employee-name').textContent = 
                `${data.datosBasicos.nombre} ${data.datosBasicos.apellidoPaterno} ${data.datosBasicos.apellidoMaterno}`;
            document.getElementById('employee-ci').textContent = data.datosBasicos.ci;
            document.getElementById('employee-address').textContent = data.datosBasicos.direccion;
            document.getElementById('employee-position').textContent = data.datosBasicos.cargo;
            document.getElementById('employee-area').textContent = data.datosBasicos.area;
            
            // Fechas y duración
            const startDate = new Date(data.datosBasicos.fechaInicio);
            document.getElementById('contract-day').textContent = startDate.getDate();
            document.getElementById('contract-month').textContent = getMonthName(startDate.getMonth());
            document.getElementById('contract-year').textContent = startDate.getFullYear();
            document.getElementById('contract-start-date').textContent = formatDate(startDate);
            
            // Determinar tipo de contrato
            const contractType = data.datosBasicos.fechaFinal ? 'DETERMINADO' : 'INDEFINIDO';
            document.getElementById('contract-type').textContent = contractType;
            
            // Duración del contrato
            if (data.datosBasicos.fechaFinal) {
                const endDate = new Date(data.datosBasicos.fechaFinal);
                const duration = calculateDuration(startDate, endDate);
                document.getElementById('contract-duration').textContent = duration;
                document.getElementById('contract-end-clause').textContent = `finalizando el ${formatDate(endDate)}`;
            } else {
                document.getElementById('contract-duration').textContent = 'tiempo indefinido';
                document.getElementById('contract-end-clause').textContent = 'sin fecha de finalización determinada';
            }
            
            // Periodo de prueba
            const probationDays = data.datosBasicos.diasPrueba || 30;
            document.getElementById('probation-period').textContent = probationDays;
            
            // Salario
            const salary = parseFloat(data.datosBasicos.salario) || 0;
            document.getElementById('employee-salary').textContent = salary.toLocaleString('es-BO');
            document.getElementById('employee-salary-letters').textContent = numberToLetters(salary);
            
            // Cláusulas adicionales
            const additionalContainer = document.getElementById('additional-clauses-container');
            if (data.camposAdicionales && data.camposAdicionales.length > 0) {
                data.camposAdicionales.forEach((campo, index) => {
                    const clauseDiv = document.createElement('div');
                    clauseDiv.className = 'additional-clause';
                    
                    const clauseTitle = document.createElement('div');
                    clauseTitle.className = 'clause-title';
                    clauseTitle.textContent = `CLÁUSULA ADICIONAL ${romanize(index + 1)} (${campo.nombre.toUpperCase()})`;
                    
                    const clauseContent = document.createElement('p');
                    clauseContent.textContent = campo.contenido;
                    
                    clauseDiv.appendChild(clauseTitle);
                    clauseDiv.appendChild(clauseContent);
                    additionalContainer.appendChild(clauseDiv);
                });
            }
            
            // Fecha de generación
            const now = new Date();
            document.getElementById('generation-date').textContent = now.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        
        // Funciones auxiliares
        function formatDate(date) {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        
        function getMonthName(monthIndex) {
            const months = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            return months[monthIndex];
        }
        
        function calculateDuration(startDate, endDate) {
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 30) {
                return `${diffDays} días`;
            }
            
            const months = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            
            if (months >= 12) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                return `${years} año${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''}`;
            }
            
            return `${months} mes${months > 1 ? 'es' : ''}${remainingDays > 0 ? ` y ${remainingDays} días` : ''}`;
        }
        
        function romanize(num) {
            const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
            let roman = '';
            for (let i in lookup) {
                while (num >= lookup[i]) {
                    roman += i;
                    num -= lookup[i];
                }
            }
            return roman;
        }
        
        function numberToLetters(num) {
            const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
            const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
            const especiales = ['once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
            const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
            
            let result = '';
            const entero = Math.floor(num);
            
            if (entero === 0) return 'cero';
            if (entero >= 1000) return 'más de mil'; // Simplificación para números grandes
            
            // Centenas
            const c = Math.floor(entero / 100);
            if (c > 0) {
                result += centenas[c] + ' ';
            }
            
            // Decenas y unidades
            const resto = entero % 100;
            if (resto >= 11 && resto <= 19) {
                result += especiales[resto - 11];
            } else {
                const d = Math.floor(resto / 10);
                const u = resto % 10;
                
                if (d > 0) {
                    result += decenas[d];
                    if (u > 0) result += ' y ' + unidades[u];
                } else if (u > 0) {
                    result += unidades[u];
                }
            }
            
            return result + ' bolivianos';
        }
        
        // Cargar los datos cuando la página esté lista
        document.addEventListener('DOMContentLoaded', loadContractData);
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap');
        
        .contrato {
            font-family: 'Noto Serif', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            padding-top: 4rem;
            margin: 0 auto;
            padding: 10rem;
            background-color: #f9f9f9;
        }
        
        .contract-container {
            background-color: white;
            padding: 50px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border: 1px solid #e1e1e1;
            position: relative;
        }
        
        .contract-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1a5276;
            padding-bottom: 20px;
        }
        
        .contract-title {
            color: #1a5276;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .contract-subtitle {
            font-size: 18px;
            color: #555;
            font-weight: 400;
        }
        
        .contract-body {
            margin-top: 30px;
        }
        
        .contract-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            color: #1a5276;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        
        .contract-clause {
            margin-bottom: 20px;
            text-align: justify;
        }
        
        .clause-title {
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            width: 200px;
            text-align: center;
            padding-top: 5px;
            margin-top: 40px;
        }
        
        .contract-footer {
            margin-top: 50px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
        
        .company-logo {
            max-width: 150px;
            position: absolute;
            top: 30px;
            right: 30px;
        }
        
        .data-field {
            margin-bottom: 10px;
        }
        
        .data-label {
            font-weight: bold;
            display: inline-block;
            min-width: 150px;
        }
        
        .additional-clause {
            background-color: #f5f5f5;
            padding: 15px;
            border-left: 3px solid #1a5276;
            margin: 15px 0;
        }
    </style>