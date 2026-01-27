# Integración 360º - FEMETE IMPULSA

## Resumen de Cambios Fundamentales

Este documento describe la unificación del modelo de datos y la implementación de vistas 360º para proporcionar una perspectiva completa del proyecto desde todos los ángulos.

## 1. Problema Original

El esquema inicial tenía **redundancia y desconexión** entre conceptos similares:

- **Personas** y **ContactoEmpresa** almacenaban información duplicada (nombre, email, teléfono)
- **AsistenciaFormacion/AsistenciaEvento** tenían tanto `asistente_id` como `contacto_id` (redundante)
- No había forma fácil de ver la "historia completa" de una persona o empresa
- Conceptos similares (persona física) se trataban de forma diferente según el contexto

## 2. Solución Implementada

### 2.1 Unificación del Concepto "Persona"

**Principio**: Una persona física es una persona física, independientemente de su rol.

#### ContactoEmpresa - ANTES:
```sql
CREATE TABLE ContactoEmpresa (
    id SERIAL PRIMARY KEY,
    nombre_contacto VARCHAR(255),  -- ❌ Duplicado
    email VARCHAR(255),            -- ❌ Duplicado
    telefono VARCHAR(50),          -- ❌ Duplicado
    empresa_id INTEGER,
    cargo_rol VARCHAR(255),
    ...
);
```

#### ContactoEmpresa - AHORA:
```sql
CREATE TABLE ContactoEmpresa (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES Personas(id),  -- ✅ Referencia única
    empresa_id INTEGER REFERENCES Empresa(id),
    cargo_rol VARCHAR(255),
    contacto_principal BOOLEAN,
    consentimiento_rgpd BOOLEAN,
    ...
    UNIQUE(persona_id, empresa_id)  -- ✅ Una persona, un rol por empresa
);
```

**Beneficios**:
- ✅ Sin duplicación de datos
- ✅ Una persona puede ser contacto en múltiples empresas
- ✅ Actualizar email/teléfono en un solo lugar
- ✅ Historial completo de la persona visible

### 2.2 Simplificación de Asistencias

#### AsistenciaFormacion/AsistenciaEvento - ANTES:
```sql
CREATE TABLE AsistenciaFormacion (
    asistente_id INTEGER,    -- ❌ Referencia a Personas
    contacto_id INTEGER,     -- ❌ Referencia a ContactoEmpresa
    ...                      -- ¿Cuál usar? Redundante!
);
```

#### AsistenciaFormacion/AsistenciaEvento - AHORA:
```sql
CREATE TABLE AsistenciaFormacion (
    persona_id INTEGER REFERENCES Personas(id),  -- ✅ Solo uno
    formacion_id INTEGER REFERENCES Formacion(id),
    empresa_id INTEGER,  -- ✅ Empresa que representa (opcional)
    asistio BOOLEAN,
    ...
);
```

**Beneficios**:
- ✅ Modelo más simple y claro
- ✅ Una fuente de verdad
- ✅ Fácil ver qué empresas participaron
- ✅ Fácil ver historial de asistencias de una persona

### 2.3 Interacciones Mejoradas

```sql
CREATE TABLE InteraccionEntidad (
    persona_id INTEGER REFERENCES Personas(id),  -- ✅ Persona que interactuó
    empresa_id INTEGER REFERENCES Empresa(id),   -- ✅ Empresa relacionada
    entidad_colaboradora_id INTEGER,             -- ✅ O entidad externa
    fecha DATE NOT NULL,
    canal_id INTEGER,
    resultado TEXT,
    ...
);
```

**Beneficios**:
- ✅ Trazabilidad completa de interacciones
- ✅ Puede ser con empresa o entidad externa
- ✅ Historial visible desde persona o empresa

## 3. Vistas 360º - Perspectiva Completa

### 3.1 Vista360_Personas

**¿Qué muestra?**
```sql
SELECT * FROM Vista360_Personas WHERE persona_id = 123;
```

**Resultado**: Perfil completo de la persona con:
- Datos básicos (nombre, apellidos, email, teléfono)
- Empresa principal
- **Todos sus roles en empresas** (JSON array)
- Contador de formaciones asistidas
- Contador de eventos asistidos
- Contador de interacciones realizadas
- Contador de sesiones de asesoramiento
- Última fecha de actividad

**Ejemplo de uso**:
```javascript
// Frontend: Mostrar perfil completo de una persona
const persona = await fetch('/api/vistas360/personas/123');
console.log(`${persona.nombre} tiene ${persona.formaciones_asistidas} formaciones`);
console.log(`Roles:`, persona.roles_empresas);
```

### 3.2 Vista360_Empresas

**¿Qué muestra?**
```sql
SELECT * FROM Vista360_Empresas WHERE empresa_id = 456;
```

**Resultado**: Perfil completo de la empresa con:
- Datos básicos y ubicación
- Total de personas vinculadas
- **Todos sus contactos con roles** (JSON array)
- Contadores de actividad:
  - Sesiones de asesoramiento
  - Planes de acción (totales y activos)
  - Interacciones
  - Formaciones y eventos participados
  - Entidades colaboradoras activas
- **Nivel de actividad** (Activo/Regular/Inactivo)
- Última fecha de actividad

**Nivel de actividad**:
- **Activo**: Actividad en últimos 30 días
- **Regular**: Actividad en últimos 90 días
- **Inactivo**: Sin actividad en más de 90 días

**Ejemplo de uso**:
```javascript
// Power BI: Dashboard de empresas por nivel de actividad
const empresas = await fetch('/api/vistas360/empresas?nivel_actividad=Activo');
// Filtrar solo empresas activas para seguimiento prioritario
```

### 3.3 Vista360_Formaciones

**¿Qué muestra?**
Estadísticas completas de cada formación:
- Total invitados vs asistentes
- Porcentaje de asistencia
- Empresas representadas
- Encuestas realizadas
- Evidencias adjuntas
- **Lista completa de asistentes** (JSON array)

**Ejemplo de uso**:
```javascript
// Análisis de formación
const formacion = await fetch('/api/vistas360/formaciones/789');
console.log(`Asistencia: ${formacion.porcentaje_asistencia}%`);
console.log(`Empresas: ${formacion.empresas_representadas}`);
```

### 3.4 Vista360_Eventos

Similar a formaciones, con:
- Total invitaciones vs aceptadas
- Total asistentes
- Empresas representadas
- Lista completa de asistentes

### 3.5 Vista_Timeline_Actividades

**¿Para qué sirve?**
Ver **todas las actividades** en orden cronológico:
- Interacciones
- Sesiones de asesoramiento
- Formaciones
- Eventos

**Filtros disponibles**:
- Por tipo de actividad
- Por empresa
- Por persona
- Por rango de fechas

**Ejemplo de uso**:
```javascript
// Timeline de una empresa
const timeline = await fetch('/api/vistas360/timeline?empresa_id=456&limit=20');
// Muestra últimas 20 actividades de la empresa

// Timeline de una persona
const timeline = await fetch('/api/vistas360/timeline?persona_id=123');
// Muestra todas las actividades de la persona
```

### 3.6 Vista_Estadisticas_Generales

**¿Qué muestra?**
Contadores para el dashboard principal:
- Total de personas, empresas, entidades
- Total de formaciones, eventos
- Total de sesiones, planes de acción
- Planes de acción activos
- Total de materiales, evidencias, informes
- Total de asistencias (formación + eventos)

**Ejemplo de uso**:
```javascript
// Dashboard principal
const stats = await fetch('/api/vistas360/estadisticas');
/*
{
  total_personas: 250,
  total_empresas: 75,
  total_formaciones: 15,
  total_eventos: 8,
  sesiones_asesoramiento: 120,
  planes_accion_activos: 18,
  ...
}
*/
```

## 4. Nuevas APIs de Relaciones

### 4.1 Relaciones de Persona

```
GET /api/vistas360/personas/:id/relaciones
```

**Devuelve**:
```json
{
  "empresas": [
    {
      "empresa_id": 45,
      "empresa_nombre": "Innovatech SL",
      "cargo_rol": "CEO",
      "contacto_principal": true
    }
  ],
  "interacciones_recientes": [...],  // Últimas 10
  "formaciones": [...],               // Todas las asistidas
  "eventos": [...],                   // Todos los asistidos
  "sesiones_asesoramiento": [...]     // Últimas 10
}
```

### 4.2 Relaciones de Empresa

```
GET /api/vistas360/empresas/:id/relaciones
```

**Devuelve**:
```json
{
  "contactos": [...],                  // Todos los contactos con roles
  "interacciones_recientes": [...],    // Últimas 10
  "sesiones_asesoramiento": [...],     // Todas las sesiones
  "planes_accion": [...],              // Todos los planes
  "formaciones": [...],                // Formaciones con participación
  "eventos": [...],                    // Eventos con participación
  "entidades_colaboradoras": [...]     // Entidades vinculadas
}
```

## 5. Casos de Uso Prácticos

### Caso 1: Perfil Completo de Persona

**Escenario**: Ver toda la información de María García

```javascript
// 1. Vista 360º básica
const persona = await fetch('/api/vistas360/personas/123');

// 2. Relaciones completas
const relaciones = await fetch('/api/vistas360/personas/123/relaciones');

// Ahora tienes:
// - Datos personales
// - Todos sus roles en empresas
// - Historial de formaciones
// - Historial de eventos
// - Interacciones realizadas
// - Sesiones de asesoramiento
```

### Caso 2: Dashboard de Empresa

**Escenario**: Mostrar actividad completa de Innovatech SL

```javascript
// 1. Vista 360º de empresa
const empresa = await fetch('/api/vistas360/empresas/45');

// Muestra inmediatamente:
console.log(`Nivel de actividad: ${empresa.nivel_actividad}`);
console.log(`Sesiones realizadas: ${empresa.sesiones_asesoramiento}`);
console.log(`Planes activos: ${empresa.planes_accion_activos}`);

// 2. Ver contactos de la empresa
empresa.contactos.forEach(c => {
  console.log(`${c.nombre} - ${c.cargo_rol} - Principal: ${c.contacto_principal}`);
});

// 3. Timeline de actividades
const timeline = await fetch('/api/vistas360/timeline?empresa_id=45');
```

### Caso 3: Análisis de Formación

**Escenario**: Evaluar éxito de una formación

```javascript
const formacion = await fetch('/api/vistas360/formaciones/10');

console.log(`Formación: ${formacion.nombre_formacion}`);
console.log(`Asistencia: ${formacion.total_asistentes}/${formacion.total_invitados}`);
console.log(`Porcentaje: ${formacion.porcentaje_asistencia}%`);
console.log(`Empresas: ${formacion.empresas_representadas}`);
console.log(`Encuestas: ${formacion.encuestas_realizadas}`);

// Ver lista de asistentes
formacion.lista_asistentes.forEach(a => {
  console.log(`${a.nombre} - ${a.empresa} - Asistió: ${a.asistio}`);
});
```

### Caso 4: Dashboard de Power BI

**Escenario**: Crear visualizaciones en Power BI

```powerquery
// Power Query - Obtener estadísticas generales
let
    Source = Json.Document(Web.Contents("https://api.femete-impulsa.com/api/vistas360/estadisticas")),
    Stats = Source
in
    Stats

// Power Query - Obtener empresas con nivel de actividad
let
    Source = Json.Document(Web.Contents("https://api.femete-impulsa.com/api/vistas360/empresas")),
    ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1", 
        {"empresa_id", "nombre_empresa", "nivel_actividad", "sesiones_asesoramiento", "planes_accion_activos"})
in
    Expanded
```

## 6. Índices para Rendimiento

Se han añadido más de 20 índices nuevos para optimizar consultas:

```sql
-- Personas
CREATE INDEX idx_personas_nombre ON Personas(nombre, apellidos);

-- ContactoEmpresa
CREATE INDEX idx_contacto_empresa_persona ON ContactoEmpresa(persona_id);
CREATE INDEX idx_contacto_empresa_principal ON ContactoEmpresa(empresa_id, contacto_principal);

-- Asistencias
CREATE INDEX idx_asist_form_persona ON AsistenciaFormacion(persona_id);
CREATE INDEX idx_asist_form_empresa ON AsistenciaFormacion(empresa_id);

-- Interacciones
CREATE INDEX idx_interaccion_persona ON InteraccionEntidad(persona_id);
CREATE INDEX idx_interaccion_fecha ON InteraccionEntidad(fecha);

-- Y muchos más...
```

## 7. Integridad Referencial

Todas las relaciones tienen configuración de eliminación:

```sql
-- Eliminación en cascada
ContactoEmpresa.persona_id ON DELETE CASCADE
AsistenciaFormacion.persona_id ON DELETE CASCADE
-- Si se elimina una persona, se eliminan sus relaciones

-- Establecer NULL
AsistenciaFormacion.empresa_id ON DELETE SET NULL
InteraccionEntidad.persona_id ON DELETE SET NULL
-- Si se elimina empresa, asistencia mantiene registro de persona
```

## 8. Migración de Datos Existentes

Si ya tienes datos en el sistema antiguo:

```sql
-- Migrar ContactoEmpresa a nuevo modelo
-- 1. Crear personas desde contactos
INSERT INTO Personas (nombre, apellidos, email, telefono)
SELECT 
    SPLIT_PART(nombre_contacto, ' ', 1) as nombre,
    SUBSTRING(nombre_contacto FROM POSITION(' ' IN nombre_contacto) + 1) as apellidos,
    email,
    telefono
FROM ContactoEmpresa_OLD
WHERE NOT EXISTS (
    SELECT 1 FROM Personas p 
    WHERE p.email = ContactoEmpresa_OLD.email
);

-- 2. Actualizar ContactoEmpresa con persona_id
UPDATE ContactoEmpresa_NEW ce
SET persona_id = p.id
FROM Personas p, ContactoEmpresa_OLD co
WHERE ce.id = co.id 
  AND p.email = co.email;
```

## 9. Beneficios del Modelo 360º

### Para Usuarios Finales:
- ✅ Ver historial completo en un solo lugar
- ✅ Identificar rápidamente nivel de actividad
- ✅ Timeline cronológico de todo lo sucedido
- ✅ Estadísticas actualizadas en tiempo real

### Para Desarrolladores:
- ✅ Modelo de datos más limpio y mantenible
- ✅ Menos redundancia = menos bugs
- ✅ Consultas más eficientes con vistas
- ✅ TypeScript type-safe

### Para Análisis (Power BI):
- ✅ Datos pre-agregados en vistas
- ✅ JSON para datos complejos (fácil de expandir)
- ✅ Endpoints optimizados
- ✅ Menos transformaciones necesarias

### Para el Proyecto:
- ✅ Trazabilidad completa
- ✅ Justificación más fácil
- ✅ Informes automáticos
- ✅ Mejor toma de decisiones

## 10. Próximos Pasos Recomendados

1. **Cargar datos de prueba** para validar vistas
2. **Crear dashboard en Power BI** usando vistas360
3. **Desarrollar formularios** en frontend que usen las APIs
4. **Configurar alertas** basadas en nivel_actividad
5. **Implementar notificaciones** para próximos pasos pendientes

## Conclusión

El sistema ahora proporciona una **vista 360º completa** de:
- **Personas**: Sus roles, actividades, interacciones
- **Empresas**: Su equipo, actividad, nivel de engagement
- **Formaciones/Eventos**: Participación y resultados
- **Actividades**: Timeline cronológico completo

Todo está **conectado, trazable y optimizado** para servir desde cualquier perspectiva. 🎉
