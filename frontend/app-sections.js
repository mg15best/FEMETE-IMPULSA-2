// FEMETE IMPULSA - Sistema de Gestión STARS 2025
// Gestión de las 19 secciones principales

const API_BASE_URL = 'http://localhost:3000/api';

// Section templates for all 19 sections
const sections = {
    inicio: `
        <h2><i class="bi bi-house-door"></i> Panel de Control - STARS 2025</h2>
        <div class="row g-3 mt-3">
            <!-- KPIs del Proyecto -->
            <div class="col-12">
                <h4>KPIs del Proyecto</h4>
            </div>
            <div class="col-md-3">
                <div class="kpi-card bg-light">
                    <div class="kpi-label">Material de Apoyo</div>
                    <div class="kpi-value text-primary" id="kpi-materiales">0 / 5</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="kpi-card bg-light">
                    <div class="kpi-label">Empresas Asesoradas</div>
                    <div class="kpi-value text-success" id="kpi-empresas">0 / 20</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="kpi-card bg-light">
                    <div class="kpi-label">Píldoras Formativas</div>
                    <div class="kpi-value text-warning" id="kpi-pildoras">0 / 6</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="kpi-card bg-light">
                    <div class="kpi-label">Eventos Realizados</div>
                    <div class="kpi-value text-info" id="kpi-eventos">0 / 2</div>
                </div>
            </div>

            <!-- Pendiente Hoy -->
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-clock"></i> Pendiente Hoy
                    </div>
                    <div class="card-body">
                        <div id="tareas-hoy">Cargando...</div>
                    </div>
                </div>
            </div>

            <!-- Alertas -->
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header text-danger">
                        <i class="bi bi-exclamation-triangle"></i> Alertas
                    </div>
                    <div class="card-body">
                        <div id="alertas">Cargando...</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    'registro-rapido': `
        <h2><i class="bi bi-lightning"></i> Registro Rápido</h2>
        <p class="text-muted">Crea registros en 30-60 segundos</p>

        <div class="row g-3 mt-3">
            <div class="col-md-4">
                <div class="quick-action-btn" onclick="quickAction('interaccion')">
                    <i class="bi bi-chat-dots text-primary"></i>
                    <h5>Nueva Interacción</h5>
                    <p class="text-muted small">Llamada, email, reunión</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="quick-action-btn" onclick="quickAction('sesion')">
                    <i class="bi bi-briefcase text-success"></i>
                    <h5>Sesión de Asesoramiento</h5>
                    <p class="text-muted small">Registrar asesoramiento</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="quick-action-btn" onclick="quickAction('impacto')">
                    <i class="bi bi-megaphone text-warning"></i>
                    <h5>Impacto de Difusión</h5>
                    <p class="text-muted small">RRSS, prensa, web</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="quick-action-btn" onclick="quickAction('evidencia')">
                    <i class="bi bi-folder text-info"></i>
                    <h5>Subir Evidencia</h5>
                    <p class="text-muted small">Archivo, foto, link</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="quick-action-btn" onclick="quickAction('tarea')">
                    <i class="bi bi-list-check text-danger"></i>
                    <h5>Crear Tarea</h5>
                    <p class="text-muted small">Tarea rápida</p>
                </div>
            </div>
        </div>
    `,

    agenda: `
        <h2><i class="bi bi-calendar3"></i> Agenda / Calendario Operativo</h2>
        <div class="card mt-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-sm btn-primary me-2">Día</button>
                        <button class="btn btn-sm btn-outline-primary me-2">Semana</button>
                        <button class="btn btn-sm btn-outline-primary">Mes</button>
                    </div>
                    <div class="col-md-6 text-end">
                        <select class="form-select form-select-sm d-inline-block w-auto">
                            <option>Todos los tipos</option>
                            <option>Asesoramientos</option>
                            <option>Formaciones</option>
                            <option>Eventos</option>
                            <option>Tareas</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div id="calendario">Vista de calendario aquí</div>
            </div>
        </div>
    `,

    empresas: `
        <h2><i class="bi bi-building"></i> CRM - Empresas</h2>
        <div class="card mt-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <input type="search" class="form-control" placeholder="Buscar empresa...">
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-primary" onclick="nuevaEmpresa()">
                            <i class="bi bi-plus-circle"></i> Nueva Empresa
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Razón Social</th>
                                <th>CIF</th>
                                <th>Sector</th>
                                <th>Estado</th>
                                <th>Prioridad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-empresas">
                            <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    personas: `
        <h2><i class="bi bi-people"></i> CRM - Personas</h2>
        <div class="card mt-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <input type="search" class="form-control" placeholder="Buscar persona...">
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Nueva Persona
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="text-muted">Gestión de personas: asistentes, contactos, ponentes</p>
                <div id="lista-personas">Cargando...</div>
            </div>
        </div>
    `,

    entidades: `
        <h2><i class="bi bi-diagram-3"></i> Entidades Colaboradoras</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nueva Entidad
                </button>
            </div>
            <div class="card-body">
                <p class="text-muted">Instituciones, partners, entidades de interés</p>
                <div id="lista-entidades">Cargando...</div>
            </div>
        </div>
    `,

    interacciones: `
        <h2><i class="bi bi-chat-dots"></i> Interacciones</h2>
        <div class="card mt-3">
            <div class="card-body">
                <div class="timeline">
                    <div class="timeline-item">
                        <h6>Llamada con Empresa XYZ</h6>
                        <p class="text-muted small">Hace 2 horas • Canal: Teléfono</p>
                        <p>Discutido plan de transformación digital</p>
                    </div>
                    <div class="timeline-item">
                        <h6>Reunión presencial - Entidad ABC</h6>
                        <p class="text-muted small">Ayer • Canal: Presencial</p>
                        <p>Explorar posibilidades de colaboración</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    asesoramientos: `
        <h2><i class="bi bi-briefcase"></i> Asesoramientos</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nueva Sesión
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Empresa</th>
                                <th>Fecha</th>
                                <th>Asesor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-asesoramientos">
                            <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    'planes-accion': `
        <h2><i class="bi bi-list-check"></i> Planes de Acción y Tareas</h2>
        <div class="row mt-3">
            <div class="col-md-4">
                <div class="kanban-column">
                    <h5>Pendiente</h5>
                    <div class="kanban-card">
                        <h6>Tarea 1</h6>
                        <p class="text-small">Empresa ABC • Vence: 15/02</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="kanban-column">
                    <h5>En Curso</h5>
                    <div class="kanban-card">
                        <h6>Tarea 2</h6>
                        <p class="text-small">Empresa XYZ • Vence: 20/02</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="kanban-column">
                    <h5>Hecho</h5>
                    <div class="kanban-card">
                        <h6>Tarea 3</h6>
                        <p class="text-small">Completada el 10/02</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    formaciones: `
        <h2><i class="bi bi-book"></i> Formaciones / Píldoras Formativas</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nueva Formación
                </button>
            </div>
            <div class="card-body">
                <div id="lista-formaciones">Cargando...</div>
            </div>
        </div>
    `,

    eventos: `
        <h2><i class="bi bi-calendar-event"></i> Eventos</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nuevo Evento
                </button>
            </div>
            <div class="card-body">
                <div id="lista-eventos">Cargando...</div>
            </div>
        </div>
    `,

    difusion: `
        <h2><i class="bi bi-megaphone"></i> Difusión e Impactos</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nuevo Impacto
                </button>
            </div>
            <div class="card-body">
                <p>Registro de impactos: RRSS, prensa, web, newsletter</p>
                <div id="lista-difusion">Cargando...</div>
            </div>
        </div>
    `,

    materiales: `
        <h2><i class="bi bi-file-earmark-text"></i> Materiales de Apoyo</h2>
        <div class="card mt-3">
            <div class="card-header">
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Nuevo Material
                </button>
            </div>
            <div class="card-body">
                <p>Inventario de materiales: guías, plantillas, documentos</p>
                <div id="lista-materiales">Cargando...</div>
            </div>
        </div>
    `,

    evidencias: `
        <h2><i class="bi bi-folder"></i> Evidencias y Documentación</h2>
        <div class="card mt-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <input type="search" class="form-control" placeholder="Buscar evidencias...">
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-primary">
                            <i class="bi bi-upload"></i> Subir Evidencia
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p>Carpeta probatoria del proyecto</p>
                <div class="alert-box info">
                    <strong>Estado:</strong> 45 evidencias validadas, 8 pendientes
                </div>
                <div id="lista-evidencias">Cargando...</div>
            </div>
        </div>
    `,

    entregables: `
        <h2><i class="bi bi-box-seam"></i> Entregables del Proyecto</h2>
        <div class="card mt-3">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Entregable</th>
                                <th>KPI Vinculado</th>
                                <th>Fecha Límite</th>
                                <th>Responsable</th>
                                <th>Estado</th>
                                <th>Evidencias</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>5 Materiales de Apoyo</td>
                                <td>KPI-MAT-001</td>
                                <td>31/12/2025</td>
                                <td>Coord. Técnico</td>
                                <td><span class="badge bg-warning">En progreso</span></td>
                                <td>3/5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    justificacion: `
        <h2><i class="bi bi-file-earmark-check"></i> Justificación / Exportación</h2>
        <div class="card mt-3">
            <div class="card-body">
                <h5>Generar Paquete de Justificación</h5>
                <div class="row g-3 mt-3">
                    <div class="col-md-4">
                        <label class="form-label">Periodo</label>
                        <select class="form-select">
                            <option>Mensual</option>
                            <option>Trimestral</option>
                            <option>Anual</option>
                            <option>Final</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Fecha Inicio</label>
                        <input type="date" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Fecha Fin</label>
                        <input type="date" class="form-control">
                    </div>
                    <div class="col-12">
                        <button class="btn btn-success">
                            <i class="bi bi-download"></i> Generar Paquete Completo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,

    informes: `
        <h2><i class="bi bi-graph-up"></i> Informes y KPIs</h2>
        <div class="card mt-3">
            <div class="card-body">
                <div id="kpi-dashboard">Cargando dashboard...</div>
            </div>
        </div>
    `,

    configuracion: `
        <h2><i class="bi bi-gear"></i> Configuración</h2>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Catálogos</div>
                    <div class="list-group list-group-flush">
                        <a href="#" class="list-group-item list-group-item-action">Estados</a>
                        <a href="#" class="list-group-item list-group-item-action">Prioridades</a>
                        <a href="#" class="list-group-item list-group-item-action">Tipos</a>
                        <a href="#" class="list-group-item list-group-item-action">Canales</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Parámetros del Proyecto</div>
                    <div class="card-body">
                        <p>Configuración de objetivos KPI, fechas y responsables</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    administracion: `
        <h2><i class="bi bi-shield-lock"></i> Administración y Control</h2>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Usuarios y Roles</div>
                    <div class="card-body">
                        <p>Gestión de usuarios: técnico, coordinación, lectura</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Auditoría</div>
                    <div class="card-body">
                        <p>Registro de cambios clave y actividad</p>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Show section function
function showSection(sectionName) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = sections[sectionName] || '<p>Sección no encontrada</p>';
    
    // Update active nav link
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link')?.classList.add('active');
    
    // Load section data
    loadSectionData(sectionName);
}

// Load section data
async function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'inicio':
            loadDashboardData();
            break;
        case 'empresas':
            loadEmpresas();
            break;
        case 'formaciones':
            loadFormaciones();
            break;
        case 'eventos':
            loadEventos();
            break;
        case 'asesoramientos':
            loadAsesoramientos();
            break;
        case 'informes':
            loadKPIDashboard();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/kpi-stars/dashboard`);
        const data = await response.json();
        
        // Update KPI values
        const kpis = data.kpis || [];
        kpis.forEach(kpi => {
            const elementId = `kpi-${kpi.kpi_codigo.split('-')[1].toLowerCase()}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${kpi.valor_actual} / ${kpi.valor_objetivo}`;
            }
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load empresas
async function loadEmpresas() {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`);
        const empresas = await response.json();
        
        const tbody = document.getElementById('tabla-empresas');
        if (!tbody) return;
        
        if (empresas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay empresas registradas</td></tr>';
            return;
        }
        
        tbody.innerHTML = empresas.map(emp => `
            <tr>
                <td><strong>${emp.razon_social}</strong></td>
                <td>${emp.cif}</td>
                <td>${emp.sector || 'N/A'}</td>
                <td><span class="badge bg-success">${emp.estado_nombre || 'Activo'}</span></td>
                <td>Normal</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading empresas:', error);
    }
}

// Load formaciones
async function loadFormaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/formaciones`);
        const formaciones = await response.json();
        
        const lista = document.getElementById('lista-formaciones');
        if (!lista) return;
        
        lista.innerHTML = formaciones.map(form => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5>${form.titulo}</h5>
                    <p class="text-muted">${form.descripcion || ''}</p>
                    <span class="badge bg-primary">${form.tipo_nombre || ''}</span>
                    <span class="badge bg-info">${form.modalidad || ''}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading formaciones:', error);
    }
}

// Quick actions
function quickAction(type) {
    alert(`Abrir formulario rápido para: ${type}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showSection('inicio');
});
