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

-- Empresa (Company) - Must be created before Personas due to foreign key
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
-- Links a Person to a Company with role and GDPR consent
CREATE TABLE IF NOT EXISTS ContactoEmpresa (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL REFERENCES Personas(id) ON DELETE CASCADE,
    empresa_id INTEGER NOT NULL REFERENCES Empresa(id) ON DELETE CASCADE,
    cargo_rol VARCHAR(255),
    canal_preferido_id INTEGER REFERENCES CatalogoCanal(id),
    contacto_principal BOOLEAN DEFAULT false,
    consentimiento_rgpd BOOLEAN DEFAULT false,
    fecha_consentimiento DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(persona_id, empresa_id)
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
-- Records interactions with companies through specific contacts
CREATE TABLE IF NOT EXISTS InteraccionEntidad (
    id SERIAL PRIMARY KEY,
    nombre_interaccion VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE SET NULL,
    entidad_colaboradora_id INTEGER REFERENCES EntidadColaboradora(id) ON DELETE SET NULL,
    canal_id INTEGER REFERENCES CatalogoCanal(id),
    fecha DATE NOT NULL,
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
-- Tracks who attended trainings and which company they represent
CREATE TABLE IF NOT EXISTS AsistenciaFormacion (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL REFERENCES Personas(id) ON DELETE CASCADE,
    formacion_id INTEGER NOT NULL REFERENCES Formacion(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    asistio BOOLEAN DEFAULT false,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(formacion_id, persona_id)
);

-- AsistenciaEvento (Event Attendance)
-- Tracks who attended events and which company they represent
CREATE TABLE IF NOT EXISTS AsistenciaEvento (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL REFERENCES Personas(id) ON DELETE CASCADE,
    evento_id INTEGER NOT NULL REFERENCES Evento(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    asistio BOOLEAN DEFAULT false,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, persona_id)
);

-- InvitacionEvento (Event Invitation)
-- Tracks invitations sent to people/companies for events
CREATE TABLE IF NOT EXISTS InvitacionEvento (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER NOT NULL REFERENCES Evento(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE SET NULL,
    empresa_id INTEGER REFERENCES Empresa(id) ON DELETE SET NULL,
    canal_invitacion_id INTEGER REFERENCES CatalogoCanal(id),
    fecha_invitacion DATE NOT NULL,
    aceptada BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (persona_id IS NOT NULL OR empresa_id IS NOT NULL)
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
-- Advisory sessions with companies through specific contacts
CREATE TABLE IF NOT EXISTS SesionAsesoramiento (
    id SERIAL PRIMARY KEY,
    nombre_sesion VARCHAR(255) NOT NULL,
    empresa_id INTEGER NOT NULL REFERENCES Empresa(id) ON DELETE CASCADE,
    persona_id INTEGER REFERENCES Personas(id) ON DELETE SET NULL,
    fecha_sesion DATE NOT NULL,
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
CREATE INDEX idx_personas_nombre ON Personas(nombre, apellidos);

-- Empresa indexes
CREATE INDEX idx_empresa_cif ON Empresa(cif_identificador);
CREATE INDEX idx_empresa_sector ON Empresa(sector);
CREATE INDEX idx_empresa_municipio ON Empresa(municipio);

-- ContactoEmpresa indexes
CREATE INDEX idx_contacto_empresa_persona ON ContactoEmpresa(persona_id);
CREATE INDEX idx_contacto_empresa_empresa ON ContactoEmpresa(empresa_id);
CREATE INDEX idx_contacto_empresa_principal ON ContactoEmpresa(empresa_id, contacto_principal);

-- Formacion indexes
CREATE INDEX idx_formacion_fechas ON Formacion(fecha_inicio, fecha_fin);
CREATE INDEX idx_formacion_responsable ON Formacion(responsable);

-- Evento indexes
CREATE INDEX idx_evento_fechas ON Evento(fecha_inicio, fecha_fin);
CREATE INDEX idx_evento_tipo ON Evento(tipo_evento_id);

-- AsistenciaFormacion indexes
CREATE INDEX idx_asist_form_persona ON AsistenciaFormacion(persona_id);
CREATE INDEX idx_asist_form_formacion ON AsistenciaFormacion(formacion_id);
CREATE INDEX idx_asist_form_empresa ON AsistenciaFormacion(empresa_id);

-- AsistenciaEvento indexes
CREATE INDEX idx_asist_evento_persona ON AsistenciaEvento(persona_id);
CREATE INDEX idx_asist_evento_evento ON AsistenciaEvento(evento_id);
CREATE INDEX idx_asist_evento_empresa ON AsistenciaEvento(empresa_id);

-- InteraccionEntidad indexes
CREATE INDEX idx_interaccion_empresa ON InteraccionEntidad(empresa_id);
CREATE INDEX idx_interaccion_persona ON InteraccionEntidad(persona_id);
CREATE INDEX idx_interaccion_fecha ON InteraccionEntidad(fecha);
CREATE INDEX idx_interaccion_entidad ON InteraccionEntidad(entidad_colaboradora_id);

-- Plan Accion indexes
CREATE INDEX idx_plan_accion_empresa ON PlanAccion(empresa_id);
CREATE INDEX idx_plan_accion_estado ON PlanAccion(estado_id);
CREATE INDEX idx_plan_accion_fechas ON PlanAccion(fecha_inicio, fecha_fin);
CREATE INDEX idx_plan_accion_sesion ON PlanAccion(sesion_asesoramiento_id);

-- Sesion Asesoramiento indexes
CREATE INDEX idx_sesion_empresa ON SesionAsesoramiento(empresa_id);
CREATE INDEX idx_sesion_persona ON SesionAsesoramiento(persona_id);
CREATE INDEX idx_sesion_fecha ON SesionAsesoramiento(fecha_sesion);
CREATE INDEX idx_sesion_estado ON SesionAsesoramiento(estado_sesion_id);

-- Material indexes
CREATE INDEX idx_material_tipo ON Material(tipo_material_id);

-- AdjuntoEvidencia indexes
CREATE INDEX idx_evidencia_material ON AdjuntoEvidencia(material_id);
CREATE INDEX idx_evidencia_relacionado ON AdjuntoEvidencia(relacionado_con, relacionado_id);
CREATE INDEX idx_evidencia_fecha ON AdjuntoEvidencia(fecha_evidencia);

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

-- ============================================
-- VISTAS 360º (360º Views for Complete Perspective)
-- ============================================

-- Vista 360º de Personas: información completa de cada persona
CREATE OR REPLACE VIEW Vista360_Personas AS
SELECT 
    p.id AS persona_id,
    p.nombre,
    p.apellidos,
    p.email,
    p.telefono,
    p.empresa_id,
    e.nombre_empresa,
    e.cif_identificador,
    -- Roles en empresas
    COALESCE(
        (SELECT json_agg(json_build_object(
            'empresa_id', ce.empresa_id,
            'empresa_nombre', emp.nombre_empresa,
            'cargo_rol', ce.cargo_rol,
            'contacto_principal', ce.contacto_principal,
            'consentimiento_rgpd', ce.consentimiento_rgpd
        ))
        FROM ContactoEmpresa ce
        JOIN Empresa emp ON ce.empresa_id = emp.id
        WHERE ce.persona_id = p.id),
        '[]'::json
    ) AS roles_empresas,
    -- Formaciones asistidas
    (SELECT COUNT(*) FROM AsistenciaFormacion af WHERE af.persona_id = p.id AND af.asistio = true) AS formaciones_asistidas,
    -- Eventos asistidos
    (SELECT COUNT(*) FROM AsistenciaEvento ae WHERE ae.persona_id = p.id AND ae.asistio = true) AS eventos_asistidos,
    -- Interacciones realizadas
    (SELECT COUNT(*) FROM InteraccionEntidad ie WHERE ie.persona_id = p.id) AS interacciones_realizadas,
    -- Sesiones de asesoramiento
    (SELECT COUNT(*) FROM SesionAsesoramiento sa WHERE sa.persona_id = p.id) AS sesiones_asesoramiento,
    -- Última actividad
    GREATEST(
        (SELECT MAX(af.updated_at) FROM AsistenciaFormacion af WHERE af.persona_id = p.id),
        (SELECT MAX(ae.updated_at) FROM AsistenciaEvento ae WHERE ae.persona_id = p.id),
        (SELECT MAX(ie.updated_at) FROM InteraccionEntidad ie WHERE ie.persona_id = p.id),
        (SELECT MAX(sa.updated_at) FROM SesionAsesoramiento sa WHERE sa.persona_id = p.id),
        p.updated_at
    ) AS ultima_actividad
FROM Personas p
LEFT JOIN Empresa e ON p.empresa_id = e.id;

-- Vista 360º de Empresas: información completa de cada empresa
CREATE OR REPLACE VIEW Vista360_Empresas AS
SELECT 
    e.id AS empresa_id,
    e.nombre_empresa,
    e.cif_identificador,
    e.sector,
    e.municipio,
    e.provincia,
    e.telefono,
    e.email,
    -- Personas en la empresa
    (SELECT COUNT(*) FROM Personas p WHERE p.empresa_id = e.id) AS total_personas,
    -- Contactos de la empresa
    COALESCE(
        (SELECT json_agg(json_build_object(
            'persona_id', ce.persona_id,
            'nombre', p.nombre,
            'apellidos', p.apellidos,
            'cargo_rol', ce.cargo_rol,
            'contacto_principal', ce.contacto_principal,
            'email', p.email,
            'telefono', p.telefono
        ))
        FROM ContactoEmpresa ce
        JOIN Personas p ON ce.persona_id = p.id
        WHERE ce.empresa_id = e.id),
        '[]'::json
    ) AS contactos,
    -- Sesiones de asesoramiento
    (SELECT COUNT(*) FROM SesionAsesoramiento sa WHERE sa.empresa_id = e.id) AS sesiones_asesoramiento,
    -- Planes de acción
    (SELECT COUNT(*) FROM PlanAccion pa WHERE pa.empresa_id = e.id) AS planes_accion,
    (SELECT COUNT(*) FROM PlanAccion pa WHERE pa.empresa_id = e.id AND pa.estado_id IN (SELECT id FROM CatalogoEstado WHERE codigo_estado = 'ACTIVO')) AS planes_accion_activos,
    -- Interacciones
    (SELECT COUNT(*) FROM InteraccionEntidad ie WHERE ie.empresa_id = e.id) AS total_interacciones,
    (SELECT MAX(ie.fecha) FROM InteraccionEntidad ie WHERE ie.empresa_id = e.id) AS ultima_interaccion,
    -- Asistencias a formaciones
    (SELECT COUNT(DISTINCT af.formacion_id) FROM AsistenciaFormacion af WHERE af.empresa_id = e.id) AS formaciones_participadas,
    -- Asistencias a eventos
    (SELECT COUNT(DISTINCT ae.evento_id) FROM AsistenciaEvento ae WHERE ae.empresa_id = e.id) AS eventos_participados,
    -- Conexiones con entidades
    (SELECT COUNT(*) FROM ConexionEmpresaEntidad cee WHERE cee.empresa_id = e.id AND cee.activo = true) AS entidades_colaboradoras_activas,
    -- Estado general (basado en última actividad)
    CASE 
        WHEN GREATEST(
            (SELECT MAX(sa.fecha_sesion) FROM SesionAsesoramiento sa WHERE sa.empresa_id = e.id),
            (SELECT MAX(ie.fecha) FROM InteraccionEntidad ie WHERE ie.empresa_id = e.id)
        ) > CURRENT_DATE - INTERVAL '30 days' THEN 'Activo'
        WHEN GREATEST(
            (SELECT MAX(sa.fecha_sesion) FROM SesionAsesoramiento sa WHERE sa.empresa_id = e.id),
            (SELECT MAX(ie.fecha) FROM InteraccionEntidad ie WHERE ie.empresa_id = e.id)
        ) > CURRENT_DATE - INTERVAL '90 days' THEN 'Regular'
        ELSE 'Inactivo'
    END AS nivel_actividad,
    -- Última actividad
    GREATEST(
        (SELECT MAX(sa.updated_at) FROM SesionAsesoramiento sa WHERE sa.empresa_id = e.id),
        (SELECT MAX(ie.updated_at) FROM InteraccionEntidad ie WHERE ie.empresa_id = e.id),
        (SELECT MAX(pa.updated_at) FROM PlanAccion pa WHERE pa.empresa_id = e.id),
        e.updated_at
    ) AS ultima_actividad
FROM Empresa e;

-- Vista 360º de Formaciones: información completa de cada formación
CREATE OR REPLACE VIEW Vista360_Formaciones AS
SELECT 
    f.id AS formacion_id,
    f.nombre_formacion,
    f.fecha_inicio,
    f.fecha_fin,
    f.modalidad,
    f.horas_totales,
    f.entidad_formadora,
    f.responsable,
    -- Asistentes
    (SELECT COUNT(*) FROM AsistenciaFormacion af WHERE af.formacion_id = f.id) AS total_invitados,
    (SELECT COUNT(*) FROM AsistenciaFormacion af WHERE af.formacion_id = f.id AND af.asistio = true) AS total_asistentes,
    ROUND((SELECT COUNT(*) FROM AsistenciaFormacion af WHERE af.formacion_id = f.id AND af.asistio = true)::numeric / 
          NULLIF((SELECT COUNT(*) FROM AsistenciaFormacion af WHERE af.formacion_id = f.id), 0) * 100, 2) AS porcentaje_asistencia,
    -- Empresas representadas
    (SELECT COUNT(DISTINCT af.empresa_id) FROM AsistenciaFormacion af WHERE af.formacion_id = f.id AND af.empresa_id IS NOT NULL) AS empresas_representadas,
    -- Encuestas
    (SELECT COUNT(*) FROM EncuestaFormacion ef WHERE ef.formacion_id = f.id) AS encuestas_realizadas,
    -- Evidencias
    (SELECT COUNT(*) FROM AdjuntoEvidencia ae WHERE ae.relacionado_con = 'Formacion' AND ae.relacionado_id = f.id) AS evidencias_adjuntas,
    -- Lista de asistentes
    COALESCE(
        (SELECT json_agg(json_build_object(
            'persona_id', p.id,
            'nombre', p.nombre,
            'apellidos', p.apellidos,
            'empresa', e.nombre_empresa,
            'asistio', af.asistio
        ))
        FROM AsistenciaFormacion af
        JOIN Personas p ON af.persona_id = p.id
        LEFT JOIN Empresa e ON af.empresa_id = e.id
        WHERE af.formacion_id = f.id),
        '[]'::json
    ) AS lista_asistentes
FROM Formacion f;

-- Vista 360º de Eventos: información completa de cada evento
CREATE OR REPLACE VIEW Vista360_Eventos AS
SELECT 
    ev.id AS evento_id,
    ev.nombre_evento,
    ev.fecha_inicio,
    ev.fecha_fin,
    ev.modalidad,
    ev.lugar,
    ct.nombre_tipo AS tipo_evento,
    ev.entidad_organizadora,
    -- Invitaciones
    (SELECT COUNT(*) FROM InvitacionEvento ie WHERE ie.evento_id = ev.id) AS total_invitaciones,
    (SELECT COUNT(*) FROM InvitacionEvento ie WHERE ie.evento_id = ev.id AND ie.aceptada = true) AS invitaciones_aceptadas,
    -- Asistentes
    (SELECT COUNT(*) FROM AsistenciaEvento ae WHERE ae.evento_id = ev.id AND ae.asistio = true) AS total_asistentes,
    -- Empresas representadas
    (SELECT COUNT(DISTINCT ae.empresa_id) FROM AsistenciaEvento ae WHERE ae.evento_id = ev.id AND ae.empresa_id IS NOT NULL) AS empresas_representadas,
    -- Encuestas
    (SELECT COUNT(*) FROM EncuestaEvento ee WHERE ee.evento_id = ev.id) AS encuestas_realizadas,
    -- Evidencias
    (SELECT COUNT(*) FROM AdjuntoEvidencia ae WHERE ae.relacionado_con = 'Evento' AND ae.relacionado_id = ev.id) AS evidencias_adjuntas,
    -- Lista de asistentes
    COALESCE(
        (SELECT json_agg(json_build_object(
            'persona_id', p.id,
            'nombre', p.nombre,
            'apellidos', p.apellidos,
            'empresa', e.nombre_empresa,
            'asistio', ae.asistio
        ))
        FROM AsistenciaEvento ae
        JOIN Personas p ON ae.persona_id = p.id
        LEFT JOIN Empresa e ON ae.empresa_id = e.id
        WHERE ae.evento_id = ev.id),
        '[]'::json
    ) AS lista_asistentes
FROM Evento ev
LEFT JOIN CatalogoTipo ct ON ev.tipo_evento_id = ct.id;

-- Vista Timeline de Actividades: todas las actividades en orden cronológico
CREATE OR REPLACE VIEW Vista_Timeline_Actividades AS
SELECT 
    'Interaccion' AS tipo_actividad,
    ie.id AS actividad_id,
    ie.nombre_interaccion AS nombre,
    ie.fecha AS fecha_actividad,
    ie.empresa_id,
    e.nombre_empresa,
    ie.persona_id,
    p.nombre AS persona_nombre,
    p.apellidos AS persona_apellidos,
    cc.nombre_canal AS canal,
    ie.resultado AS detalles,
    ie.created_at
FROM InteraccionEntidad ie
LEFT JOIN Empresa e ON ie.empresa_id = e.id
LEFT JOIN Personas p ON ie.persona_id = p.id
LEFT JOIN CatalogoCanal cc ON ie.canal_id = cc.id

UNION ALL

SELECT 
    'Sesion' AS tipo_actividad,
    sa.id AS actividad_id,
    sa.nombre_sesion AS nombre,
    sa.fecha_sesion AS fecha_actividad,
    sa.empresa_id,
    e.nombre_empresa,
    sa.persona_id,
    p.nombre AS persona_nombre,
    p.apellidos AS persona_apellidos,
    cc.nombre_canal AS canal,
    sa.acuerdos_alcanzados AS detalles,
    sa.created_at
FROM SesionAsesoramiento sa
LEFT JOIN Empresa e ON sa.empresa_id = e.id
LEFT JOIN Personas p ON sa.persona_id = p.id
LEFT JOIN CatalogoCanal cc ON sa.canal_id = cc.id

UNION ALL

SELECT 
    'Formacion' AS tipo_actividad,
    f.id AS actividad_id,
    f.nombre_formacion AS nombre,
    f.fecha_inicio AS fecha_actividad,
    NULL AS empresa_id,
    NULL AS nombre_empresa,
    NULL AS persona_id,
    NULL AS persona_nombre,
    NULL AS persona_apellidos,
    f.modalidad AS canal,
    f.objetivo AS detalles,
    f.created_at
FROM Formacion f

UNION ALL

SELECT 
    'Evento' AS tipo_actividad,
    ev.id AS actividad_id,
    ev.nombre_evento AS nombre,
    ev.fecha_inicio AS fecha_actividad,
    NULL AS empresa_id,
    NULL AS nombre_empresa,
    NULL AS persona_id,
    NULL AS persona_nombre,
    NULL AS persona_apellidos,
    ev.modalidad AS canal,
    ev.descripcion AS detalles,
    ev.created_at
FROM Evento ev

ORDER BY fecha_actividad DESC, created_at DESC;

-- Vista de Estadísticas Generales
CREATE OR REPLACE VIEW Vista_Estadisticas_Generales AS
SELECT 
    (SELECT COUNT(*) FROM Personas) AS total_personas,
    (SELECT COUNT(*) FROM Empresa) AS total_empresas,
    (SELECT COUNT(*) FROM EntidadColaboradora) AS total_entidades_colaboradoras,
    (SELECT COUNT(*) FROM Formacion) AS total_formaciones,
    (SELECT COUNT(*) FROM Evento) AS total_eventos,
    (SELECT COUNT(*) FROM SesionAsesoramiento) AS total_sesiones_asesoramiento,
    (SELECT COUNT(*) FROM PlanAccion) AS total_planes_accion,
    (SELECT COUNT(*) FROM PlanAccion WHERE estado_id IN (SELECT id FROM CatalogoEstado WHERE codigo_estado IN ('ACTIVO', 'EN_PROCESO'))) AS planes_accion_activos,
    (SELECT COUNT(*) FROM InteraccionEntidad) AS total_interacciones,
    (SELECT COUNT(*) FROM Material) AS total_materiales,
    (SELECT COUNT(*) FROM AdjuntoEvidencia) AS total_evidencias,
    (SELECT COUNT(*) FROM DifusionImpacto) AS total_impactos_difusion,
    (SELECT COUNT(*) FROM Informe) AS total_informes,
    (SELECT SUM(CASE WHEN asistio = true THEN 1 ELSE 0 END) FROM AsistenciaFormacion) AS total_asistencias_formacion,
    (SELECT SUM(CASE WHEN asistio = true THEN 1 ELSE 0 END) FROM AsistenciaEvento) AS total_asistencias_evento;

-- Comentarios sobre las vistas
COMMENT ON VIEW Vista360_Personas IS 'Vista completa de personas con todas sus relaciones y actividades';
COMMENT ON VIEW Vista360_Empresas IS 'Vista completa de empresas con todas sus relaciones y actividades';
COMMENT ON VIEW Vista360_Formaciones IS 'Vista completa de formaciones con asistentes y estadísticas';
COMMENT ON VIEW Vista360_Eventos IS 'Vista completa de eventos con asistentes y estadísticas';
COMMENT ON VIEW Vista_Timeline_Actividades IS 'Timeline cronológico de todas las actividades del proyecto';
COMMENT ON VIEW Vista_Estadisticas_Generales IS 'Estadísticas generales del proyecto para dashboard';
