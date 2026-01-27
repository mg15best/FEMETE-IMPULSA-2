# FEMETE IMPULSA - Guía Completa del Sistema

## 🎯 Descripción General

Sistema integral de gestión y seguimiento para el programa de innovación STARS 2025 de FEMETE IMPULSA. Permite la gestión completa del proyecto desde la captación de empresas hasta la justificación final, con seguimiento en tiempo real de los 8 KPIs principales del programa.

## 📋 Índice

1. [Requisitos del Sistema](#requisitos)
2. [Instalación y Configuración](#instalación)
3. [Estructura de las 19 Secciones](#secciones)
4. [KPIs del Proyecto](#kpis)
5. [Base de Datos (24 Tablas)](#base-de-datos)
6. [Guía de Uso](#guía-de-uso)
7. [Integración Power BI](#power-bi)
8. [Preguntas Frecuentes](#faq)

## 📦 Requisitos

- Node.js 18+
- PostgreSQL 15+
- Docker (opcional, recomendado)
- Navegador moderno (Chrome, Firefox, Edge)

## 🚀 Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/mg15best/FEMETE-IMPULSA-2.git
cd FEMETE-IMPULSA-2

# Iniciar con Docker
docker-compose up -d

# Acceder
http://localhost        # Frontend
http://localhost:3000   # API
```

### Opción 2: Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Crear base de datos PostgreSQL
psql -U postgres -c "CREATE DATABASE femete_impulsa;"

# 4. Cargar el schema
psql -U postgres -d femete_impulsa -f database/schema.sql
psql -U postgres -d femete_impulsa -f database/kpis_powerbi.sql

# 5. Iniciar el servidor
npm run dev
```

## 📱 Estructura de las 19 Secciones

### PRINCIPAL

#### 1. Inicio / Panel de Control
**Propósito**: Vista global del estado del proyecto  
**Funcionalidades**:
- Resumen de los 8 KPIs en tiempo real
- Tareas pendientes para hoy
- Alertas de entregables sin evidencia
- Actividades sin fechas asignadas
- Registros incompletos

**Uso típico**: Revisar diariamente al comenzar la jornada

#### 2. Registro Rápido
**Propósito**: Crear registros en 30-60 segundos  
**Tipos de registro**:
- Nueva interacción (llamada/email/reunión)
- Nueva sesión de asesoramiento
- Nuevo impacto de difusión
- Subir evidencia y vincularla
- Crear tarea rápida

**Uso típico**: Registrar actividades inmediatamente después de realizarlas

#### 3. Agenda / Calendario Operativo
**Propósito**: Planificación y seguimiento de actividades  
**Vistas disponibles**:
- Vista diaria
- Vista semanal
- Vista mensual

**Filtros**:
- Por tipo: asesoramientos, formaciones, eventos, tareas
- Por técnico/a responsable
- Por estado

**Uso típico**: Planificación semanal y reparto de cargas

### CRM

#### 4. CRM - Empresas
**Propósito**: Gestión completa de empresas beneficiarias  
**Información incluida**:
- Datos básicos: razón social, CIF, sector, tamaño
- Estado actual y prioridad
- Personas de contacto vinculadas
- Historial completo de interacciones
- Sesiones de asesoramiento realizadas
- Materiales entregados
- Evidencias asociadas

**Acciones**:
- Crear nueva empresa
- Editar datos
- Ver historial completo
- Vincular contactos
- Registrar interacciones

#### 5. CRM - Personas
**Propósito**: Gestión de personas físicas  
**Tipos de personas**:
- Asistentes a formaciones/eventos
- Contactos de empresas
- Ponentes
- Colaboradores

**Información**:
- Datos personales y profesionales
- Empresa representada (opcional)
- Historial de asistencias
- Interacciones registradas
- Evidencias asociadas

#### 6. Entidades de Interés / Colaboradoras
**Propósito**: Seguimiento de instituciones y partners  
**Gestión**:
- Datos de la entidad
- Estado de la relación
- Responsable del seguimiento
- Próximos pasos planificados
- Evidencias de comunicación

#### 7. Interacciones
**Propósito**: Trazabilidad completa de comunicaciones  
**Timeline de contactos**:
- Llamadas telefónicas
- Correos electrónicos
- Reuniones presenciales
- Videoconferencias

**Para cada interacción**:
- Fecha y hora
- Canal utilizado
- Participantes
- Resultado/acuerdos
- Siguiente acción planificada
- Vinculación a empresa/persona/entidad

### ACTIVIDADES

#### 8. Asesoramientos (Empresas Asesoradas)
**Propósito**: Gestión de sesiones de asesoramiento (KPI: 20 empresas)  
**Información de sesión**:
- Código único
- Empresa asesorada
- Persona de contacto
- Fecha y duración
- Técnico/a responsable
- Modalidad (presencial/online)
- Temática tratada
- Objetivos y resultados
- Recomendaciones
- Plan de acción generado

**Flujo**:
1. Programar sesión
2. Realizar asesoramiento
3. Registrar resultados
4. Generar plan de acción (opcional)
5. Subir evidencias

#### 9. Planes de Acción y Tareas
**Propósito**: Seguimiento de tareas y compromisos  
**Vista Kanban**:
- Columna "Pendiente"
- Columna "En Curso"
- Columna "Hecho"

**Para cada tarea**:
- Título y descripción
- Vinculación: sesión, empresa, entregable, evento
- Responsable
- Fecha límite
- Prioridad
- Estado de evidencias
- Alertas automáticas

#### 10. Formaciones / Píldoras Formativas
**Propósito**: Gestión de píldoras formativas (KPI: 6 píldoras)  
**Catálogo de píldoras**:
- Código y título
- Contenidos y objetivos
- Fecha, horario y duración
- Modalidad (presencial/online/híbrida)
- Lugar o plataforma
- Formador/a
- Capacidad máxima

**Asistencia**:
- Registro de personas
- Empresa representada (opcional)
- Control de asistencia
- Porcentaje de participación
- Certificado emitido

**Encuesta de satisfacción**:
- Valoración general
- Valoración del contenido
- Valoración del formador
- Aspectos positivos y de mejora

**Evidencias**:
- Cartel/convocatoria
- Lista de asistencia firmada
- Fotos de la sesión
- Material entregado

#### 11. Eventos
**Propósito**: Gestión completa de eventos (KPI: 2 eventos)  
**Ficha de evento**:
- Código y título
- Objetivo del evento
- Fecha inicio y fin
- Lugar físico o plataforma online
- Aforo máximo y actual
- Organizador y ponentes
- Agenda detallada
- Público objetivo
- Requisitos de participación

**Gestión de invitaciones**:
- Envío de invitaciones
- Canal de envío
- Seguimiento de respuestas
- Confirmaciones

**Asistencia**:
- Registro de inscripciones
- Control de entrada/salida
- Lista de asistentes

**Encuesta de evento**:
- Valoración general
- Cumplimiento de expectativas
- Organización e instalaciones
- Interés en futuras actividades

### DIFUSIÓN Y MATERIALES

#### 12. Difusión e Impactos
**Propósito**: Registro de impactos de difusión (KPI: 15 impactos)  
**Canales**:
- Redes sociales (LinkedIn, Twitter, Facebook, etc.)
- Prensa (digital, papel, radio, TV)
- Web corporativa
- Newsletter
- Otros medios

**Métricas** (si disponibles):
- Alcance
- Impresiones
- Interacciones
- Clics
- Compartidos
- Visualizaciones

**Evidencias**:
- Capturas de pantalla
- Enlaces (URLs)
- PDFs
- Clipping de prensa
- Videos/audios

#### 13. Materiales de Apoyo
**Propósito**: Inventario de materiales (KPI: 5 materiales)  
**Tipos de materiales**:
- Guías
- Manuales
- Plantillas
- Infografías
- Presentaciones
- Videos

**Gestión**:
- Título y descripción
- Tipo y categoría
- Versión
- Fecha de publicación
- Autor/a
- Formato (PDF, Word, PPT, etc.)
- A quién se entregó
- En qué actividad se usó
- Número de descargas

### GESTIÓN Y CONTROL

#### 14. Evidencias y Documentación
**Propósito**: "Carpeta probatoria" centralizada del proyecto  
**Buscador único** de evidencias con filtros:
- Por tipo de evidencia
- Por entidad vinculada
- Por fecha
- Por estado de validación

**Vinculación múltiple**:
Una evidencia puede estar vinculada a:
- Empresa
- Persona
- Sesión de asesoramiento
- Formación
- Evento
- Impacto de difusión
- Entregable

**Estados**:
- Pendiente de subir
- Subida, pendiente de validar
- Validada
- Rechazada (requiere nueva versión)

**Información**:
- Título descriptivo
- Tipo de documento
- Archivo adjunto o URL
- Fecha del documento
- Quién lo subió
- Fecha de subida
- Quién lo validó

#### 15. Entregables del Proyecto
**Propósito**: Seguimiento de entregables alineados a KPIs  
**Para cada entregable**:
- Código y nombre
- KPI vinculado
- Objetivo/descripción
- Fecha límite
- Responsable
- Estado actual
- Progreso (%)

**Checklist de evidencias requeridas**:
- Lista de evidencias necesarias
- Estado de cada una
- Evidencias adjuntas

**Vista global**:
- Todos los entregables
- Estado de cumplimiento
- Alertas de vencimiento

#### 16. Justificación / Exportación
**Propósito**: Generar paquetes de justificación para reporting  
**Generación de paquetes**:
- Por periodo: mensual, trimestral, anual, final
- Rango de fechas personalizado

**Contenido del paquete**:
- Listados de todas las actividades
- Informes de KPIs
- Evidencias enlazadas
- Logs de actividad
- Encuestas y valoraciones

**Formatos de exportación**:
- JSON (para sistemas)
- CSV (para Excel)
- Excel completo
- PDF (para documentación)

**Registro de exportaciones**:
- Quién exportó
- Cuándo
- Qué periodo
- Qué entidades
- Tamaño del paquete

### INFORMES Y CONFIGURACIÓN

#### 17. Informes y KPIs
**Propósito**: Dashboard interno del proyecto  
**Panel de KPIs**:
- Vista de los 8 KPIs STARS 2025
- Progreso en tiempo real
- Gráficas de tendencia
- Alertas de desviación

**Gráficas**:
- Progreso por KPI
- Actividad por técnico/a
- Distribución por municipio/sector
- Evolución temporal

**Informes predefinidos**:
- Informe mensual
- Informe trimestral
- Informe anual
- Informe de cierre

#### 18. Configuración
**Propósito**: Gestión de catálogos y parámetros  
**Catálogos**:
- Estados (Activo, Pendiente, Completado, etc.)
- Prioridades (Crítica, Alta, Media, Baja)
- Tipos (por categoría: formación, evento, material, etc.)
- Canales (Email, Teléfono, Presencial, etc.)
- Roles de personas

**Plantillas**:
- Checklist de evidencias por tipo de actividad
- Plantillas de informes
- Modelos de documentos

**Parámetros del proyecto**:
- Objetivos de los 8 KPIs
- Fechas clave del proyecto
- Responsables por área
- Configuración de alertas

#### 19. Administración y Control
**Propósito**: Gestión de usuarios y auditoría  
**Usuarios y roles**:
- Técnico/a: puede crear y editar
- Coordinación: acceso completo
- Lectura: solo visualización

**Para cada usuario**:
- Nombre y email
- Rol asignado
- Permisos específicos
- Estado (activo/inactivo)
- Último acceso

**Auditoría ligera**:
- Registro de cambios clave
- Modificaciones en entregables
- Validación de evidencias
- Exportaciones realizadas

**Calidad de datos**:
- Registros incompletos
- Campos obligatorios vacíos
- Evidencias pendientes
- Actividades sin fechas

## 🎯 KPIs del Proyecto STARS 2025

### KPI-MAT-001: Material de Apoyo
- **Objetivo**: 5 unidades
- **Tipo**: Guías, manuales, plantillas
- **Sección**: Materiales de Apoyo
- **Evidencias requeridas**: Archivo final, registro de entregas

### KPI-PBI-001: Cuadro de Mando PowerBI©
- **Objetivo**: 1 dashboard
- **Tipo**: Dashboard interactivo
- **Sección**: Informes y KPIs
- **Evidencias requeridas**: Capturas, enlaces de acceso

### KPI-ENT-001: Entidades de Interés Contactadas
- **Objetivo**: 8 entidades
- **Tipo**: Instituciones, partners
- **Sección**: Entidades Colaboradoras
- **Evidencias requeridas**: Registro de contactos, emails, actas

### KPI-EMP-001: Empresas Asesoradas
- **Objetivo**: 20 empresas
- **Tipo**: Empresas DISTINTAS asesoradas
- **Sección**: Asesoramientos
- **Evidencias requeridas**: Actas de sesión, planes de acción

### KPI-INF-001: Informes Individualizados
- **Objetivo**: 15 informes
- **Tipo**: Informes de empresa emergente
- **Sección**: Entregables / Informes
- **Evidencias requeridas**: Informes firmados

### KPI-FOR-001: Píldoras Formativas
- **Objetivo**: 6 píldoras
- **Tipo**: Formaciones cortas especializadas
- **Sección**: Formaciones
- **Evidencias requeridas**: Listas asistencia, fotos, material

### KPI-EVE-001: Eventos
- **Objetivo**: 2 eventos
- **Tipo**: Eventos del programa
- **Sección**: Eventos
- **Evidencias requeridas**: Convocatoria, lista asistencia, fotos, encuestas

### KPI-DIF-001: Impactos de Difusión
- **Objetivo**: 15 impactos
- **Tipo**: Publicaciones en medios
- **Sección**: Difusión e Impactos
- **Evidencias requeridas**: Capturas, enlaces, clipping

## 🗄️ Base de Datos (24 Tablas)

### Catálogos (4 tablas)
1. **CatalogoEstado**: Estados del sistema
2. **CatalogoPrioridad**: Niveles de prioridad
3. **CatalogoTipo**: Tipos de entidades
4. **CatalogoCanal**: Canales de comunicación

### Entidades Principales (3 tablas)
5. **Personas**: Personas del programa
6. **Empresa**: Empresas beneficiarias
7. **EntidadColaboradora**: Entidades colaboradoras

### Relaciones (3 tablas)
8. **ContactoEmpresa**: Contactos de empresas
9. **ConexionEmpresaEntidad**: Conexiones empresa-entidad
10. **InteraccionEntidad**: Interacciones registradas

### Formación y Eventos (5 tablas)
11. **Formacion**: Formaciones/Píldoras
12. **Evento**: Eventos del programa
13. **AsistenciaFormacion**: Asistencias a formación
14. **AsistenciaEvento**: Asistencias a eventos
15. **InvitacionEvento**: Invitaciones enviadas

### Encuestas (2 tablas)
16. **EncuestaFormacion**: Encuestas de formación
17. **EncuestaEvento**: Encuestas de eventos

### Asesoramiento (3 tablas)
18. **SesionAsesoramiento**: Sesiones de asesoramiento
19. **PlanAccion**: Planes de acción
20. **TareaPlanAccion**: Tareas de planes

### Materiales (2 tablas)
21. **Material**: Materiales del programa
22. **AdjuntoEvidencia**: Evidencias adjuntas

### Difusión e Informes (3 tablas)
23. **DifusionImpacto**: Impactos de difusión
24. **Informe**: Informes generados

### Adicionales
- **LogExportacion**: Registro de exportaciones
- **KPIConfiguracion**: Configuración de KPIs
- **KPIHistorico**: Histórico de valores KPI
- **VistaKPIActuales**: Vista en tiempo real de KPIs

## 🎓 Guía de Uso

### Flujo de Trabajo Típico

#### 1. Inicio del Día
1. Abrir sección "Inicio / Panel de Control"
2. Revisar KPIs y alertas
3. Consultar "Pendiente hoy"
4. Planificar actividades en "Agenda"

#### 2. Registro de Empresa Nueva
1. Ir a "CRM - Empresas"
2. Hacer clic en "Nueva Empresa"
3. Rellenar datos básicos (CIF, razón social, sector)
4. Guardar

#### 3. Registro de Sesión de Asesoramiento
1. Ir a "Asesoramientos"
2. Hacer clic en "Nueva Sesión"
3. Seleccionar empresa
4. Registrar fecha, técnico/a, modalidad
5. Completar objetivos y resultados
6. Opcionalmente, generar plan de acción
7. Subir evidencias (acta, fotos, etc.)

#### 4. Organizar Formación
1. Ir a "Formaciones"
2. Crear nueva píldora formativa
3. Definir contenidos, fecha, modalidad
4. Enviar convocatoria
5. Registrar inscripciones
6. El día de la formación, controlar asistencia
7. Enviar encuesta de satisfacción
8. Subir evidencias

#### 5. Justificación Mensual
1. Ir a "Justificación / Exportación"
2. Seleccionar "Periodo: Mensual"
3. Elegir mes
4. Hacer clic en "Generar Paquete Completo"
5. Revisar contenido
6. Exportar en formato deseado

## 🔌 Integración Power BI

Ver guía completa en [POWERBI_INTEGRATION.md](POWERBI_INTEGRATION.md)

### Conexión Rápida
1. Abrir Power BI Desktop
2. Obtener Datos → Web
3. URL: `http://localhost:3000/api/kpi-stars/powerbi`
4. Autenticación: Anónimo
5. Expandir campo `kpis`

## ❓ Preguntas Frecuentes

### ¿Cómo se calcula automáticamente un KPI?
Los KPIs se calculan en tiempo real mediante vistas de PostgreSQL. Cada vez que se crea un registro (formación, evento, empresa asesorada, etc.), el contador del KPI correspondiente se actualiza automáticamente.

### ¿Puedo vincular una evidencia a múltiples cosas?
Sí. Una misma evidencia (por ejemplo, una foto) puede estar vinculada a una empresa, una sesión, una formación, etc. simultáneamente.

### ¿Qué pasa si elimino una empresa?
Por defecto, se eliminan en cascada todos sus registros relacionados (contactos, sesiones, etc.). Se recomienda cambiar el estado a "Inactivo" en lugar de eliminar.

### ¿Puedo personalizar los catálogos?
Sí. En "Configuración" puedes añadir, editar o desactivar estados, prioridades, tipos y canales según las necesidades del proyecto.

### ¿Cómo registro una tarea sin vincular a nada específico?
En "Registro Rápido" → "Crear Tarea" puedes crear una tarea independiente. Luego, opcionalmente, la puedes vincular.

## 📞 Soporte

Para consultas técnicas o funcionales:
- Email: admin@femete-impulsa.com
- Documentación completa en README.md
- Guía Power BI en POWERBI_INTEGRATION.md

---

**Versión del Sistema**: 1.0.0  
**Última actualización**: Enero 2025  
**Programa**: STARS 2025 - FEMETE IMPULSA
