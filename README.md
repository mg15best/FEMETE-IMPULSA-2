# FEMETE IMPULSA - Sistema de Gestión y Seguimiento

Sistema integral de gestión de proyectos y seguimiento para el programa de innovación STARS 2025. Permite la gestión completa de empresas, formaciones, eventos, asesoramiento, y seguimiento de KPIs con integración para Power BI y Power Apps.

## 🎯 Características Principales

- **Gestión de Empresas y Personas**: Control completo de empresas beneficiarias, contactos y entidades colaboradoras
- **Formación y Eventos**: Gestión de píldoras formativas, eventos, asistencias y encuestas de satisfacción
- **Asesoramiento Empresarial**: Sesiones de asesoramiento, planes de acción y seguimiento de tareas
- **Materiales y Evidencias**: Gestión de materiales de apoyo y adjuntos de evidencia
- **KPIs STARS 2025**: Seguimiento en tiempo real de los 8 KPIs principales del programa
- **Exportación de Datos**: Exportación masiva en formatos JSON, CSV y Excel
- **Integración Power BI**: API REST lista para conectar con Power BI
- **Integración Power Apps**: Endpoints compatibles con Power Apps

## 📊 KPIs del Programa STARS 2025

El sistema monitorea automáticamente los siguientes KPIs:

1. **Material de apoyo**: 5 unidades objetivo
2. **Cuadro de mando PowerBI©**: 1 dashboard objetivo
3. **Entidades de interés contactadas**: 8 entidades objetivo
4. **Empresas asesoradas**: 20 empresas objetivo
5. **Informes individualizados de empresa emergente**: 15 informes objetivo
6. **Píldoras formativas**: 6 píldoras objetivo
7. **Eventos**: 2 eventos objetivo
8. **Impactos de difusión**: 15 impactos objetivo

## 🗄️ Estructura de Base de Datos

El sistema utiliza 24 tablas principales:

### Catálogos
- `CatalogoEstado` - Estados del sistema
- `CatalogoPrioridad` - Niveles de prioridad
- `CatalogoTipo` - Tipos de entidades
- `CatalogoCanal` - Canales de comunicación

### Entidades Principales
- `Personas` - Personas del programa
- `Empresa` - Empresas beneficiarias
- `EntidadColaboradora` - Entidades colaboradoras

### Relaciones
- `ContactoEmpresa` - Contactos de empresas
- `ConexionEmpresaEntidad` - Conexiones empresa-entidad
- `InteraccionEntidad` - Interacciones con entidades

### Formación y Eventos
- `Formacion` - Formaciones/Píldoras
- `Evento` - Eventos del programa
- `AsistenciaFormacion` - Asistencias a formación
- `AsistenciaEvento` - Asistencias a eventos
- `InvitacionEvento` - Invitaciones a eventos

### Encuestas
- `EncuestaFormacion` - Encuestas de formación
- `EncuestaEvento` - Encuestas de eventos

### Asesoramiento
- `SesionAsesoramiento` - Sesiones de asesoramiento
- `PlanAccion` - Planes de acción
- `TareaPlanAccion` - Tareas de planes

### Materiales
- `Material` - Materiales del programa
- `AdjuntoEvidencia` - Evidencias adjuntas

### Difusión e Informes
- `DifusionImpacto` - Impactos de difusión
- `Informe` - Informes generados
- `LogExportacion` - Registro de exportaciones

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/mg15best/FEMETE-IMPULSA-2.git
cd FEMETE-IMPULSA-2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Crear la base de datos**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE femete_impulsa;

# Salir de psql
\q

# Cargar el schema
psql -U postgres -d femete_impulsa -f database/schema.sql

# Cargar configuración de KPIs
psql -U postgres -d femete_impulsa -f database/kpis_powerbi.sql
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Uso con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📡 API Endpoints

### KPIs STARS 2025

```
GET /api/kpi-stars/dashboard          - Dashboard completo de KPIs
GET /api/kpi-stars/powerbi             - Datos para Power BI
GET /api/kpi-stars/historico           - Histórico de KPIs
GET /api/kpi-stars/detalle/:codigo     - Detalle de un KPI
GET /api/kpi-stars/breakdown/:codigo   - Desglose detallado
POST /api/kpi-stars/snapshot           - Registrar snapshot diario
```

### Entidades Principales

```
# Empresas
GET    /api/empresas              - Listar empresas
POST   /api/empresas              - Crear empresa
GET    /api/empresas/:id          - Obtener empresa
PUT    /api/empresas/:id          - Actualizar empresa
DELETE /api/empresas/:id          - Eliminar empresa

# Personas
GET    /api/personas              - Listar personas
POST   /api/personas              - Crear persona
GET    /api/personas/:id          - Obtener persona
PUT    /api/personas/:id          - Actualizar persona
DELETE /api/personas/:id          - Eliminar persona

# Formaciones
GET    /api/formaciones           - Listar formaciones
POST   /api/formaciones           - Crear formación
GET    /api/formaciones/:id       - Obtener formación
PUT    /api/formaciones/:id       - Actualizar formación
DELETE /api/formaciones/:id       - Eliminar formación

# Eventos
GET    /api/eventos               - Listar eventos
POST   /api/eventos               - Crear evento
GET    /api/eventos/:id           - Obtener evento
PUT    /api/eventos/:id           - Actualizar evento
DELETE /api/eventos/:id            - Eliminar evento
```

### Exportación

```
GET /api/export/data?entity=empresas&format=csv
GET /api/export/data?entity=formaciones&format=json
GET /api/export/comprehensive?project_id=1
```

## 🔌 Integración con Power BI

### Configuración de Power BI

1. **Obtener Datos desde Web**
   - En Power BI Desktop, seleccionar "Obtener datos" → "Web"
   - URL: `http://localhost:3000/api/kpi-stars/powerbi`

2. **Autenticación**
   - Tipo: Anónimo (o configurar Bearer Token si se implementa)

3. **Transformar Datos**
   - Expandir campo `kpis` para ver todos los KPIs
   - Configurar actualización automática

### Visualizaciones Recomendadas

- **Gráfico de Barras**: Progreso de KPIs (valor actual vs objetivo)
- **Medidor**: Porcentaje de cumplimiento por KPI
- **Tarjetas**: KPIs individuales con formato condicional
- **Gráfico de Líneas**: Tendencia histórica de KPIs
- **Tabla**: Desglose detallado de cada KPI

### Consultas DAX Útiles

```dax
% Cumplimiento Global = 
AVERAGE(VistaKPIActuales[porcentaje_cumplimiento])

KPIs Cumplidos = 
COUNTROWS(
    FILTER(
        VistaKPIActuales,
        VistaKPIActuales[estado] = "Cumplido"
    )
)
```

## 📱 Integración con Power Apps

### Configurar Conexión

1. **Crear Conexión Personalizada**
   - En Power Apps, ir a "Datos" → "Conexiones personalizadas"
   - Tipo: REST API
   - URL base: `http://localhost:3000/api`

2. **Acciones Disponibles**
   - Listar empresas: GET `/empresas`
   - Crear empresa: POST `/empresas`
   - Actualizar empresa: PUT `/empresas/{id}`

### Ejemplo de Galería

```powerapp
// En la propiedad Items de una galería
FEMETEAPI.GetEmpresas()

// Para crear nueva empresa
FEMETEAPI.CreateEmpresa({
    razon_social: TextInput1.Text,
    cif: TextInput2.Text,
    sector: Dropdown1.Selected.Value
})
```

## 🔧 Desarrollo

### Estructura del Proyecto

```
FEMETE-IMPULSA-2/
├── backend/
│   └── src/
│       ├── config/          # Configuración
│       ├── controllers/     # Controladores
│       ├── models/          # Modelos TypeScript
│       ├── routes/          # Rutas API
│       └── server.ts        # Servidor principal
├── frontend/
│   ├── index.html          # Interfaz web
│   ├── app.js              # Lógica frontend
│   └── styles.css          # Estilos
├── database/
│   ├── schema.sql          # Schema principal
│   └── kpis_powerbi.sql    # KPIs y vistas
├── docker-compose.yml      # Configuración Docker
└── package.json            # Dependencias
```

### Scripts Disponibles

```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar TypeScript
npm start          # Iniciar servidor de producción
```

### Despliegue en Vercel

Este repositorio incluye un `vercel.json` que configura la carpeta `frontend/` como directorio de salida para el despliegue estático.

### Añadir Nuevas Entidades

1. Crear tabla en `database/schema.sql`
2. Añadir interfaz TypeScript en `backend/src/models/types.ts`
3. Crear controlador en `backend/src/controllers/`
4. Añadir rutas en `backend/src/routes/`
5. Registrar rutas en `backend/src/server.ts`

## 📈 Monitoreo y KPIs

### Snapshot Diario Automático

Para registrar valores de KPIs diariamente, configurar un cron job:

```bash
# Añadir al crontab
0 0 * * * curl -X POST http://localhost:3000/api/kpi-stars/snapshot
```

### Consultar Tendencias

```bash
# Histórico del último mes
curl "http://localhost:3000/api/kpi-stars/historico?fecha_inicio=2025-01-01&fecha_fin=2025-01-31"
```

## 🔒 Seguridad

- Las variables de entorno sensibles están en `.env` (no commiteado)
- Validación de datos en todas las rutas
- Sanitización de inputs SQL para prevenir inyección
- CORS configurado para dominios permitidos

## 📝 Licencia

Este proyecto es propiedad de FEMETE IMPULSA para el programa STARS 2025.

## 👥 Soporte

Para soporte técnico o consultas:
- Email: admin@femete-impulsa.com
- Documentación: [En desarrollo]

## 🎓 Ejemplos de Uso

### Crear una Nueva Empresa

```javascript
fetch('http://localhost:3000/api/empresas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razon_social: 'Empresa Ejemplo S.L.',
    cif: 'B12345678',
    sector: 'Tecnología',
    email: 'contacto@ejemplo.com'
  })
})
```

### Obtener Dashboard de KPIs

```javascript
fetch('http://localhost:3000/api/kpi-stars/dashboard')
  .then(res => res.json())
  .then(data => console.log(data.kpis))
```

### Exportar Datos

```javascript
// Exportar empresas a CSV
window.open('http://localhost:3000/api/export/data?entity=empresas&format=csv')
```

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Programa**: STARS 2025 - FEMETE IMPULSA
