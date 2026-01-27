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
    nombre_estado VARCHAR(100) NOT NULL,
    codigo_estado VARCHAR(50) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prioridad Catalog (Priority)
CREATE TABLE IF NOT EXISTS CatalogoPrioridad (
    id SERIAL PRIMARY KEY,
    nombre_prioridad VARCHAR(100) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipo Catalog (Type)
CREATE TABLE IF NOT EXISTS CatalogoTipo (
    id SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(100) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Canal Catalog (Channel)
CREATE TABLE IF NOT EXISTS CatalogoCanal (
    id SERIAL PRIMARY KEY,
    nombre_canal VARCHAR(100) NOT NULL,
    codigo_canal VARCHAR(50) UNIQUE NOT NULL,
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
    email VARCHAR(255),
    telefono VARCHAR(50),
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empresa (Company)
CREATE TABLE IF NOT EXISTS Empresa (
    id SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    cif_identificador VARCHAR(50) UNIQUE NOT NULL,
    direccion TEXT,
    codigo_postal VARCHAR(20),
    municipio VARCHAR(100),
    provincia VARCHAR(100),
    comunidad_autonoma VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(255),
    sector VARCHAR(255),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EntidadColaboradora (Collaborating Entity)
CREATE TABLE IF NOT EXISTS EntidadColaboradora (
    id SERIAL PRIMARY KEY,
    nombre_entidad VARCHAR(255) NOT NULL,
    tipo_entidad VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(50),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RELACIONES (Relationships)
-- ============================================

-- ContactoEmpresa (Company Contact)
CREATE TABLE IF NOT EXISTS ContactoEmpresa (
    id SERIAL PRIMARY KEY,
    nombre_contacto VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    cargo_rol VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(50),
    canal_preferido_id INTEGER REFERENCES CatalogoCanal(id),
    contacto_principal BOOLEAN DEFAULT false,
    consentimiento_rgpd BOOLEAN DEFAULT false,
    fecha_consentimiento DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ConexionEmpresaEntidad (Company-Entity Connection)
CREATE TABLE IF NOT EXISTS ConexionEmpresaEntidad (
    id SERIAL PRIMARY KEY,
    nombre_conexion VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    entidad_colaboradora_id INTEGER REFERENCES EntidadColaboradora(id) ON DELETE CASCADE,
    tipo_conexion VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- InteraccionEntidad (Entity Interaction)
CREATE TABLE IF NOT EXISTS InteraccionEntidad (
    id SERIAL PRIMARY KEY,
    nombre_interaccion VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    contacto_id INTEGER REFERENCES ContactoEmpresa(id) ON DELETE SET NULL,
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    fecha DATE,
    resultado TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FORMACIÓN Y EVENTOS (Training and Events)
-- ============================================

-- Formacion (Training)
CREATE TABLE IF NOT EXISTS Formacion (
    id SERIAL PRIMARY KEY,
    nombre_formacion VARCHAR(255) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    modalidad VARCHAR(50),
    horas_totales DECIMAL(5, 2),
    entidad_formadora VARCHAR(255),
    responsable VARCHAR(255),
    objetivo TEXT,
    contenidos TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evento (Event)
CREATE TABLE IF NOT EXISTS Evento (
    id SERIAL PRIMARY KEY,
    nombre_evento VARCHAR(255) NOT NULL,
    tipo_evento_id INTEGER REFERENCES CatalogoTipo(id),
    fecha_inicio DATE,
    fecha_fin DATE,
    modalidad VARCHAR(50),
    lugar VARCHAR(255),
    descripcion TEXT,
    entidad_organizadora VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AsistenciaFormacion (Training Attendance)
CREATE TABLE IF NOT EXISTS AsistenciaFormacion (
    id SERIAL PRIMARY KEY,
    asistente_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    contacto_id INTEGER REFERENCES ContactoEmpresa(id) ON DELETE SET NULL,
    asistio BOOLEAN DEFAULT false,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(formacion_id, asistente_id)
);

-- AsistenciaEvento (Event Attendance)
CREATE TABLE IF NOT EXISTS AsistenciaEvento (
    id SERIAL PRIMARY KEY,
    asistente_id INTEGER REFERENCES Personas(id) ON DELETE CASCADE,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    contacto_id INTEGER REFERENCES ContactoEmpresa(id) ON DELETE SET NULL,
    asistio BOOLEAN DEFAULT false,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, asistente_id)
);

-- InvitacionEvento (Event Invitation)
CREATE TABLE IF NOT EXISTS InvitacionEvento (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    contacto_id INTEGER REFERENCES ContactoEmpresa(id) ON DELETE SET NULL,
    canal_invitacion_id INTEGER REFERENCES CatalogoCanal(id),
    fecha_invitacion DATE,
    aceptada BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENCUESTAS (Surveys)
-- ============================================

-- EncuestaFormacion (Training Survey)
CREATE TABLE IF NOT EXISTS EncuestaFormacion (
    id SERIAL PRIMARY KEY,
    nombre_encuesta VARCHAR(255) NOT NULL,
    formacion_id INTEGER REFERENCES Formacion(id) ON DELETE CASCADE,
    fecha DATE,
    resultado TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EncuestaEvento (Event Survey)
CREATE TABLE IF NOT EXISTS EncuestaEvento (
    id SERIAL PRIMARY KEY,
    nombre_encuesta VARCHAR(255) NOT NULL,
    evento_id INTEGER REFERENCES Evento(id) ON DELETE CASCADE,
    fecha DATE,
    resultado TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ASESORAMIENTO Y PLANES (Advisory and Plans)
-- ============================================

-- SesionAsesoramiento (Advisory Session)
CREATE TABLE IF NOT EXISTS SesionAsesoramiento (
    id SERIAL PRIMARY KEY,
    nombre_sesion VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    contacto_id INTEGER REFERENCES ContactoEmpresa(id),
    fecha_sesion DATE,
    duracion INTEGER,
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    estado_sesion_id INTEGER REFERENCES CatalogoEstado(id),
    responsable VARCHAR(255),
    temas_tratados TEXT,
    necesidades_detectadas TEXT,
    acuerdos_alcanzados TEXT,
    proximo_paso TEXT,
    fecha_proximo_paso DATE,
    evidencia_sesion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PlanAccion (Action Plan)
CREATE TABLE IF NOT EXISTS PlanAccion (
    id SERIAL PRIMARY KEY,
    nombre_plan VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    sesion_asesoramiento_id INTEGER REFERENCES SesionAsesoramiento(id),
    objetivo TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    prioridad_id INTEGER REFERENCES CatalogoPrioridad(id),
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    responsable VARCHAR(255),
    resultado_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TareaPlanAccion (Action Plan Task)
CREATE TABLE IF NOT EXISTS TareaPlanAccion (
    id SERIAL PRIMARY KEY,
    nombre_tarea VARCHAR(255) NOT NULL,
    plan_accion_id INTEGER REFERENCES PlanAccion(id) ON DELETE CASCADE,
    responsable VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    estado_id INTEGER REFERENCES CatalogoEstado(id),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MATERIALES Y EVIDENCIAS (Materials and Evidence)
-- ============================================

-- Material (Material)
CREATE TABLE IF NOT EXISTS Material (
    id SERIAL PRIMARY KEY,
    material VARCHAR(255) NOT NULL,
    nombre_material VARCHAR(255) NOT NULL,
    tipo_material_id INTEGER REFERENCES CatalogoTipo(id),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AdjuntoEvidencia (Evidence Attachment)
CREATE TABLE IF NOT EXISTS AdjuntoEvidencia (
    id SERIAL PRIMARY KEY,
    nombre_adjunto VARCHAR(255) NOT NULL,
    archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tipo_evidencia VARCHAR(100),
    fecha_evidencia DATE,
    material_id INTEGER REFERENCES Material(id) ON DELETE SET NULL,
    relacionado_con VARCHAR(100),
    relacionado_id INTEGER,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DIFUSIÓN E INFORMES (Diffusion and Reports)
-- ============================================

-- DifusionImpacto (Diffusion Impact)
CREATE TABLE IF NOT EXISTS DifusionImpacto (
    id SERIAL PRIMARY KEY,
    nombre_difusion VARCHAR(255) NOT NULL,
    tipo_difusion_id INTEGER REFERENCES CatalogoTipo(id),
    alcance_estimado INTEGER,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Informe (Report)
CREATE TABLE IF NOT EXISTS Informe (
    id SERIAL PRIMARY KEY,
    nombre_informe VARCHAR(255) NOT NULL,
    tipo_informe_id INTEGER REFERENCES CatalogoTipo(id),
    fecha DATE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LogExportacion (Export Log)
CREATE TABLE IF NOT EXISTS LogExportacion (
    id SERIAL PRIMARY KEY,
    nombre_exportacion VARCHAR(255) NOT NULL,
    fecha DATE,
    usuario VARCHAR(255),
    tipo_exportacion VARCHAR(100),
    resultado TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES (Indexes)
-- ============================================

-- Personas indexes
CREATE INDEX idx_personas_email ON Personas(email);
CREATE INDEX idx_personas_empresa ON Personas(empresa_id);

-- Empresa indexes
CREATE INDEX idx_empresa_cif ON Empresa(cif_identificador);
CREATE INDEX idx_empresa_sector ON Empresa(sector);

-- Formacion indexes
CREATE INDEX idx_formacion_fechas ON Formacion(fecha_inicio, fecha_fin);

-- Evento indexes
CREATE INDEX idx_evento_fechas ON Evento(fecha_inicio, fecha_fin);

-- Plan Accion indexes
CREATE INDEX idx_plan_accion_empresa ON PlanAccion(empresa_id);
CREATE INDEX idx_plan_accion_estado ON PlanAccion(estado_id);
CREATE INDEX idx_plan_accion_fechas ON PlanAccion(fecha_inicio, fecha_fin);

-- Sesion Asesoramiento indexes
CREATE INDEX idx_sesion_empresa ON SesionAsesoramiento(empresa_id);
CREATE INDEX idx_sesion_fecha ON SesionAsesoramiento(fecha_sesion);

-- Material indexes
CREATE INDEX idx_material_tipo ON Material(tipo_material_id);

-- ============================================
-- DATOS INICIALES (Initial Data)
-- ============================================

-- Estados
INSERT INTO CatalogoEstado (nombre_estado, codigo_estado) VALUES
('Activo', 'ACTIVO'),
('Pendiente', 'PENDIENTE'),
('Completado', 'COMPLETADO'),
('Cancelado', 'CANCELADO'),
('En Proceso', 'EN_PROCESO'),
('Suspendido', 'SUSPENDIDO')
ON CONFLICT (codigo_estado) DO NOTHING;

-- Prioridades
INSERT INTO CatalogoPrioridad (nombre_prioridad) VALUES
('Crítica'),
('Alta'),
('Media'),
('Baja')
ON CONFLICT (nombre_prioridad) DO NOTHING;

-- Tipos
INSERT INTO CatalogoTipo (nombre_tipo) VALUES
('Presencial'),
('Online'),
('Híbrida'),
('Conferencia'),
('Taller'),
('Networking'),
('Técnico'),
('Estratégico'),
('Financiero'),
('Guía'),
('Plantilla'),
('Video'),
('Mensual'),
('Trimestral'),
('Anual')
ON CONFLICT (nombre_tipo) DO NOTHING;

-- Canales
INSERT INTO CatalogoCanal (nombre_canal, codigo_canal) VALUES
('Email', 'EMAIL'),
('Teléfono', 'TELEFONO'),
('Presencial', 'PRESENCIAL'),
('Videollamada', 'VIDEOLLAMADA'),
('Redes Sociales', 'RRSS'),
('WhatsApp', 'WHATSAPP')
ON CONFLICT (codigo_canal) DO NOTHING;
