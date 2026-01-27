-- FEMETE IMPULSA Database Schema
-- For STARS 2025 Innovation Program

-- Create database (run manually if needed)
-- CREATE DATABASE femete_impulsa;

-- ============================================
-- CATÁLOGOS (Catalogs) - Reference Tables
-- ============================================

-- Estado Catalog (Status)
CREATE TABLE IF NOT EXISTS CatalogoEstado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    color VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prioridad Catalog (Priority)
CREATE TABLE IF NOT EXISTS CatalogoPrioridad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    nivel INTEGER,
    color VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipo Catalog (Type)
CREATE TABLE IF NOT EXISTS CatalogoTipo (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(categoria, nombre)
);

-- Canal Catalog (Channel)
CREATE TABLE IF NOT EXISTS CatalogoCanal (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENTIDADES PRINCIPALES (Main Entities)
-- ============================================

-- Personas (People)
CREATE TABLE IF NOT EXISTS Personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(50),
    cargo VARCHAR(255),
    organizacion VARCHAR(255),
    genero VARCHAR(50),
    fecha_nacimiento DATE,
    provincia VARCHAR(100),
    municipio VARCHAR(100),
    codigo_postal VARCHAR(20),
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empresa (Company)
CREATE TABLE IF NOT EXISTS Empresa (
    id SERIAL PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    cif VARCHAR(50) UNIQUE NOT NULL,
    sector VARCHAR(255),
    tamano VARCHAR(50),
    numero_empleados INTEGER,
    facturacion_anual DECIMAL(15, 2),
    direccion TEXT,
    provincia VARCHAR(100),
    municipio VARCHAR(100),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(50),
    email VARCHAR(255),
    web VARCHAR(255),
    descripcion TEXT,
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    fecha_alta DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EntidadColaboradora (Collaborating Entity)
CREATE TABLE IF NOT EXISTS EntidadColaboradora (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    ambito VARCHAR(100),
    direccion TEXT,
    provincia VARCHAR(100),
    municipio VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(255),
    web VARCHAR(255),
    persona_contacto VARCHAR(255),
    descripcion TEXT,
    fecha_colaboracion DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RELACIONES (Relationships)
-- ============================================

-- ContactoEmpresa (Company Contact)
CREATE TABLE IF NOT EXISTS ContactoEmpresa (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    es_contacto_principal BOOLEAN DEFAULT false,
    departamento VARCHAR(255),
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, persona_id)
);

-- ConexionEmpresaEntidad (Company-Entity Connection)
CREATE TABLE IF NOT EXISTS ConexionEmpresaEntidad (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    entidad_id INTEGER REFERENCES EntidadColaboradora(id) ON DELETE CASCADE,
    tipo_conexion VARCHAR(100),
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- InteraccionEntidad (Entity Interaction)
CREATE TABLE IF NOT EXISTS InteraccionEntidad (
    id SERIAL PRIMARY KEY,
    entidad_id INTEGER REFERENCES EntidadColaboradora(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE SET NULL,
    tipo_interaccion VARCHAR(100),
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    fecha_interaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracion_minutos INTEGER,
    descripcion TEXT,
    resultado TEXT,
    seguimiento_requerido BOOLEAN DEFAULT false,
    fecha_seguimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FORMACIÓN Y EVENTOS (Training and Events)
-- ============================================

-- Formacion (Training)
CREATE TABLE IF NOT EXISTS Formacion (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    modalidad VARCHAR(50),
    duracion_horas DECIMAL(5, 2),
    fecha_inicio DATE,
    fecha_fin DATE,
    horario VARCHAR(255),
    lugar VARCHAR(255),
    plataforma_online VARCHAR(255),
    capacidad_maxima INTEGER,
    formador VARCHAR(255),
    contenido TEXT,
    objetivos TEXT,
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    presupuesto DECIMAL(10, 2),
    coste_real DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evento (Event)
CREATE TABLE IF NOT EXISTS Evento (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    lugar VARCHAR(255),
    direccion TEXT,
    modalidad VARCHAR(50),
    plataforma_online VARCHAR(255),
    capacidad_maxima INTEGER,
    aforo_actual INTEGER DEFAULT 0,
    organizador VARCHAR(255),
    ponentes TEXT,
    agenda TEXT,
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    presupuesto DECIMAL(10, 2),
    coste_real DECIMAL(10, 2),
    publico_objetivo VARCHAR(255),
    requisitos TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AsistenciaFormacion (Training Attendance)
CREATE TABLE IF NOT EXISTS AsistenciaFormacion (
    id SERIAL PRIMARY KEY,
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'inscrito',
    asistio BOOLEAN,
    porcentaje_asistencia DECIMAL(5, 2),
    calificacion DECIMAL(5, 2),
    certificado_emitido BOOLEAN DEFAULT false,
    fecha_certificado DATE,
    valoracion INTEGER,
    comentarios TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(formacion_id, persona_id)
);

-- AsistenciaEvento (Event Attendance)
CREATE TABLE IF NOT EXISTS AsistenciaEvento (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'inscrito',
    asistio BOOLEAN,
    hora_entrada TIMESTAMP,
    hora_salida TIMESTAMP,
    valoracion INTEGER,
    comentarios TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, persona_id)
);

-- InvitacionEvento (Event Invitation)
CREATE TABLE IF NOT EXISTS InvitacionEvento (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    fecha_invitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    estado VARCHAR(50) DEFAULT 'enviada',
    fecha_respuesta TIMESTAMP,
    acepto BOOLEAN,
    motivo_rechazo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENCUESTAS (Surveys)
-- ============================================

-- EncuestaFormacion (Training Survey)
CREATE TABLE IF NOT EXISTS EncuestaFormacion (
    id SERIAL PRIMARY KEY,
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valoracion_general INTEGER CHECK (valoracion_general >= 1 AND valoracion_general <= 5),
    valoracion_contenido INTEGER,
    valoracion_formador INTEGER,
    valoracion_organizacion INTEGER,
    valoracion_utilidad INTEGER,
    aspectos_positivos TEXT,
    aspectos_mejora TEXT,
    sugerencias TEXT,
    recomendaria BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(formacion_id, persona_id)
);

-- EncuestaEvento (Event Survey)
CREATE TABLE IF NOT EXISTS EncuestaEvento (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valoracion_general INTEGER CHECK (valoracion_general >= 1 AND valoracion_general <= 5),
    valoracion_contenido INTEGER,
    valoracion_organizacion INTEGER,
    valoracion_instalaciones INTEGER,
    cumplimiento_expectativas INTEGER,
    aspectos_positivos TEXT,
    aspectos_mejora TEXT,
    sugerencias TEXT,
    interesado_futuras_actividades BOOLEAN,
    temas_interes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, persona_id)
);

-- ============================================
-- ASESORAMIENTO Y PLANES (Advisory and Plans)
-- ============================================

-- SesionAsesoramiento (Advisory Session)
CREATE TABLE IF NOT EXISTS SesionAsesoramiento (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    persona_contacto_id INTEGER REFERENCES Personas(id),
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    fecha_sesion TIMESTAMP NOT NULL,
    duracion_minutos INTEGER,
    modalidad VARCHAR(50),
    lugar VARCHAR(255),
    asesor VARCHAR(255),
    tematica VARCHAR(255),
    descripcion TEXT,
    objetivos TEXT,
    resultados TEXT,
    recomendaciones TEXT,
    seguimiento_requerido BOOLEAN DEFAULT false,
    fecha_seguimiento DATE,
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    valoracion INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PlanAccion (Action Plan)
CREATE TABLE IF NOT EXISTS PlanAccion (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    sesion_asesoramiento_id INTEGER REFERENCES SesionAsesoramiento(id),
    responsable VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin_prevista DATE,
    fecha_fin_real DATE,
    prioridad_id INTEGER REFERENCES CatalogoPrioridad(id),
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    presupuesto DECIMAL(10, 2),
    coste_real DECIMAL(10, 2),
    progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
    resultados_esperados TEXT,
    resultados_obtenidos TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TareaPlanAccion (Action Plan Task)
CREATE TABLE IF NOT EXISTS TareaPlanAccion (
    id SERIAL PRIMARY KEY,
    plan_accion_id INTEGER REFERENCES PlanAccion(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    responsable VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin_prevista DATE,
    fecha_fin_real DATE,
    prioridad_id INTEGER REFERENCES CatalogoPrioridad(id),
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    orden INTEGER,
    dependencias TEXT,
    completada BOOLEAN DEFAULT false,
    porcentaje_completado INTEGER DEFAULT 0 CHECK (porcentaje_completado >= 0 AND porcentaje_completado <= 100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MATERIALES Y EVIDENCIAS (Materials and Evidence)
-- ============================================

-- Material (Material)
CREATE TABLE IF NOT EXISTS Material (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    categoria VARCHAR(100),
    formato VARCHAR(50),
    url VARCHAR(500),
    ruta_archivo VARCHAR(500),
    tamano_kb INTEGER,
    autor VARCHAR(255),
    fecha_publicacion DATE,
    palabras_clave TEXT,
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE SET NULL,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE SET NULL,
    sesion_asesoramiento_id INTEGER REFERENCES SesionAsesoramiento(id) ON DELETE SET NULL,
    publico BOOLEAN DEFAULT false,
    descargas INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AdjuntoEvidencia (Evidence Attachment)
CREATE TABLE IF NOT EXISTS AdjuntoEvidencia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_documento VARCHAR(100),
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_kb INTEGER,
    tipo_mime VARCHAR(100),
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE SET NULL,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE SET NULL,
    sesion_asesoramiento_id INTEGER REFERENCES SesionAsesoramiento(id) ON DELETE SET NULL,
    plan_accion_id INTEGER REFERENCES PlanAccion(id) ON DELETE SET NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    fecha_documento DATE,
    subido_por VARCHAR(255),
    verificado BOOLEAN DEFAULT false,
    fecha_verificacion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DIFUSIÓN E INFORMES (Diffusion and Reports)
-- ============================================

-- DifusionImpacto (Diffusion Impact)
CREATE TABLE IF NOT EXISTS DifusionImpacto (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    fecha_publicacion TIMESTAMP,
    alcance INTEGER,
    impresiones INTEGER,
    interacciones INTEGER,
    clics INTEGER,
    compartidos INTEGER,
    url VARCHAR(500),
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE SET NULL,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE SET NULL,
    publico_objetivo VARCHAR(255),
    resultados TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Informe (Report)
CREATE TABLE IF NOT EXISTS Informe (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_id INTEGER REFERENCES CatalogoTipo(id),
    periodo_inicio DATE,
    periodo_fin DATE,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generado_por VARCHAR(255),
    contenido TEXT,
    ruta_archivo VARCHAR(500),
    formato VARCHAR(50),
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    publico BOOLEAN DEFAULT false,
    destinatarios TEXT,
    fecha_envio TIMESTAMP,
    conclusiones TEXT,
    recomendaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LogExportacion (Export Log)
CREATE TABLE IF NOT EXISTS LogExportacion (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(255),
    entidad VARCHAR(100),
    formato VARCHAR(50),
    filtros TEXT,
    num_registros INTEGER,
    fecha_inicio DATE,
    fecha_fin DATE,
    tamano_kb INTEGER,
    ip_address VARCHAR(50),
    exitoso BOOLEAN DEFAULT true,
    mensaje_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES (Indexes)
-- ============================================

-- Personas indexes
CREATE INDEX idx_personas_email ON Personas(email);
CREATE INDEX idx_personas_organizacion ON Personas(organizacion);
CREATE INDEX idx_personas_activo ON Personas(activo);

-- Empresa indexes
CREATE INDEX idx_empresa_cif ON Empresa(cif);
CREATE INDEX idx_empresa_estado ON Empresa(estado_id);
CREATE INDEX idx_empresa_sector ON Empresa(sector);
CREATE INDEX idx_empresa_activo ON Empresa(activo);

-- Formacion indexes
CREATE INDEX idx_formacion_codigo ON Formacion(codigo);
CREATE INDEX idx_formacion_fechas ON Formacion(fecha_inicio, fecha_fin);
CREATE INDEX idx_formacion_estado ON Formacion(estado_id);

-- Evento indexes
CREATE INDEX idx_evento_codigo ON Evento(codigo);
CREATE INDEX idx_evento_fechas ON Evento(fecha_inicio, fecha_fin);
CREATE INDEX idx_evento_estado ON Evento(estado_id);

-- Plan Accion indexes
CREATE INDEX idx_plan_accion_empresa ON PlanAccion(empresa_id);
CREATE INDEX idx_plan_accion_estado ON PlanAccion(estado_id);
CREATE INDEX idx_plan_accion_fechas ON PlanAccion(fecha_inicio, fecha_fin_prevista);

-- Sesion Asesoramiento indexes
CREATE INDEX idx_sesion_empresa ON SesionAsesoramiento(empresa_id);
CREATE INDEX idx_sesion_fecha ON SesionAsesoramiento(fecha_sesion);

-- Material indexes
CREATE INDEX idx_material_tipo ON Material(tipo_id);
CREATE INDEX idx_material_categoria ON Material(categoria);

-- ============================================
-- DATOS INICIALES (Initial Data)
-- ============================================

-- Estados
INSERT INTO CatalogoEstado (nombre, descripcion, color) VALUES
('Activo', 'Estado activo', 'success'),
('Pendiente', 'Pendiente de acción', 'warning'),
('Completado', 'Completado exitosamente', 'primary'),
('Cancelado', 'Cancelado', 'danger'),
('En Proceso', 'En proceso de ejecución', 'info'),
('Suspendido', 'Temporalmente suspendido', 'secondary');

-- Prioridades
INSERT INTO CatalogoPrioridad (nombre, nivel, color) VALUES
('Crítica', 1, 'danger'),
('Alta', 2, 'warning'),
('Media', 3, 'info'),
('Baja', 4, 'secondary');

-- Tipos
INSERT INTO CatalogoTipo (categoria, nombre, descripcion) VALUES
('Formacion', 'Presencial', 'Formación presencial'),
('Formacion', 'Online', 'Formación online'),
('Formacion', 'Híbrida', 'Formación híbrida'),
('Evento', 'Conferencia', 'Evento tipo conferencia'),
('Evento', 'Taller', 'Evento tipo taller'),
('Evento', 'Networking', 'Evento de networking'),
('Asesoramiento', 'Técnico', 'Asesoramiento técnico'),
('Asesoramiento', 'Estratégico', 'Asesoramiento estratégico'),
('Asesoramiento', 'Financiero', 'Asesoramiento financiero'),
('Material', 'Guía', 'Guía o manual'),
('Material', 'Plantilla', 'Plantilla'),
('Material', 'Video', 'Material en video'),
('Informe', 'Mensual', 'Informe mensual'),
('Informe', 'Trimestral', 'Informe trimestral'),
('Informe', 'Anual', 'Informe anual');

-- Canales
INSERT INTO CatalogoCanal (nombre, descripcion) VALUES
('Email', 'Correo electrónico'),
('Teléfono', 'Llamada telefónica'),
('Presencial', 'Reunión presencial'),
('Videoconferencia', 'Reunión por videoconferencia'),
('WhatsApp', 'Mensajería WhatsApp'),
('LinkedIn', 'Red social LinkedIn'),
('Sitio Web', 'Sitio web corporativo'),
('Redes Sociales', 'Otras redes sociales');
