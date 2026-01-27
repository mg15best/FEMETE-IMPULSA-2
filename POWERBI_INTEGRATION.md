# Guía de Integración Power BI - FEMETE IMPULSA STARS 2025

## 📊 Conexión a la API

### Método 1: Conexión Web Directa

1. **Abrir Power BI Desktop**
2. **Obtener Datos** → **Web**
3. **URL**: `http://localhost:3000/api/kpi-stars/powerbi`
4. **Autenticación**: Anónimo (por ahora)
5. **Aceptar** y cargar datos

### Método 2: Conexión Avanzada con Power Query

```powerquery
let
    Origen = Json.Document(Web.Contents("http://localhost:3000/api/kpi-stars/powerbi")),
    #"Convertido a tabla" = Record.ToTable(Origen),
    #"KPIs expandidos" = Table.ExpandListColumn(#"Convertido a tabla", "Value"),
    #"Registros expandidos" = Table.ExpandRecordColumn(#"KPIs expandidos", "Value", 
        {"kpi_codigo", "kpi_nombre", "valor_objetivo", "valor_actual", "porcentaje", "estado", "unidad", "categoria"})
in
    #"Registros expandidos"
```

## 📈 KPIs Disponibles

El endpoint `/api/kpi-stars/powerbi` proporciona:

### Datos Principales

| Campo | Descripción | Tipo |
|-------|-------------|------|
| `kpi_codigo` | Código único del KPI | Texto |
| `kpi_nombre` | Nombre descriptivo | Texto |
| `valor_objetivo` | Meta a alcanzar | Número |
| `valor_actual` | Valor actual | Número |
| `porcentaje` | % de cumplimiento | Número |
| `estado` | Cumplido/En Progreso/Pendiente | Texto |
| `unidad` | Unidad de medida | Texto |
| `categoria` | Categoría del KPI | Texto |

### KPIs STARS 2025

1. **Material de apoyo** (KPI-MAT-001)
   - Objetivo: 5 unidades
   - Categoría: Recursos

2. **Cuadro de mando PowerBI** (KPI-PBI-001)
   - Objetivo: 1 unidad
   - Categoría: Herramientas

3. **Entidades contactadas** (KPI-ENT-001)
   - Objetivo: 8 entidades
   - Categoría: Networking

4. **Empresas asesoradas** (KPI-EMP-001)
   - Objetivo: 20 empresas
   - Categoría: Asesoramiento

5. **Informes individualizados** (KPI-INF-001)
   - Objetivo: 15 informes
   - Categoría: Reporting

6. **Píldoras formativas** (KPI-FOR-001)
   - Objetivo: 6 píldoras
   - Categoría: Formación

7. **Eventos** (KPI-EVE-001)
   - Objetivo: 2 eventos
   - Categoría: Eventos

8. **Impactos de difusión** (KPI-DIF-001)
   - Objetivo: 15 impactos
   - Categoría: Comunicación

## 🎨 Visualizaciones Recomendadas

### 1. Dashboard Principal - KPIs Overview

**Tarjetas (Cards)**
- Una tarjeta por cada KPI mostrando: Nombre, Valor Actual, Objetivo

**Formato Condicional:**
```
Color = 
SWITCH(
    TRUE(),
    KPIs[porcentaje] >= 100, "Verde",
    KPIs[porcentaje] >= 70, "Amarillo",
    "Rojo"
)
```

### 2. Gráfico de Barras - Progreso por KPI

- **Eje X**: `kpi_nombre`
- **Eje Y**: `valor_actual` y `valor_objetivo`
- **Tipo**: Gráfico de barras agrupadas

### 3. Medidor (Gauge) - Cumplimiento Global

```dax
% Cumplimiento Global = 
AVERAGE(KPIs[porcentaje])
```

- **Mínimo**: 0
- **Máximo**: 100
- **Objetivo**: 100

### 4. Matriz de Categorías

- **Filas**: `categoria`
- **Columnas**: `estado`
- **Valores**: COUNT de KPIs

### 5. Gráfico de Líneas - Tendencia Histórica

**Endpoint**: `http://localhost:3000/api/kpi-stars/historico`

- **Eje X**: `fecha_registro`
- **Eje Y**: `porcentaje_cumplimiento`
- **Leyenda**: `kpi_nombre`

## 📊 Medidas DAX Útiles

### Medida: KPIs Cumplidos

```dax
KPIs Cumplidos = 
COUNTROWS(
    FILTER(
        KPIs,
        KPIs[estado] = "Cumplido"
    )
)
```

### Medida: % Promedio Cumplimiento

```dax
% Promedio Cumplimiento = 
AVERAGE(KPIs[porcentaje])
```

### Medida: Gap Total

```dax
Gap Total = 
SUMX(
    KPIs,
    KPIs[valor_objetivo] - KPIs[valor_actual]
)
```

### Medida: Estado con Color

```dax
Color Estado = 
VAR EstadoKPI = SELECTEDVALUE(KPIs[estado])
RETURN
SWITCH(
    EstadoKPI,
    "Cumplido", "#28a745",
    "En Progreso", "#ffc107",
    "Pendiente", "#dc3545",
    "#6c757d"
)
```

### Medida: Progreso Texto

```dax
Progreso Texto = 
SELECTEDVALUE(KPIs[valor_actual]) & " / " & SELECTEDVALUE(KPIs[valor_objetivo]) & " " & SELECTEDVALUE(KPIs[unidad])
```

## 🔄 Actualización Automática

### Configurar Actualización Programada

1. **Publicar en Power BI Service**
2. **Configuración del Dataset** → **Actualización programada**
3. **Frecuencia**: Diaria (recomendado)
4. **Hora**: 00:00 (medianoche)

### Actualización Manual

En Power BI Desktop:
- **Inicio** → **Actualizar**
- O presionar `F5`

## 📱 Desglose Detallado

Para obtener el desglose de cada KPI:

### Endpoint por KPI

```
GET /api/kpi-stars/breakdown/KPI-MAT-001
GET /api/kpi-stars/breakdown/KPI-EMP-001
GET /api/kpi-stars/breakdown/KPI-FOR-001
... etc
```

### Ejemplo Power Query para Desglose

```powerquery
let
    Fuente = Json.Document(Web.Contents("http://localhost:3000/api/kpi-stars/breakdown/KPI-EMP-001")),
    Items = Fuente[items],
    #"Convertido en tabla" = Table.FromList(Items, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Columna expandida" = Table.ExpandRecordColumn(#"Convertido en tabla", "Column1", 
        {"razon_social", "sector", "num_sesiones", "ultima_sesion"})
in
    #"Columna expandida"
```

## 🎨 Plantilla de Dashboard Recomendada

### Página 1: Resumen Ejecutivo

- **Título**: "FEMETE IMPULSA - STARS 2025 Dashboard"
- **Subtítulo**: Fecha actual
- **8 Tarjetas**: Una por cada KPI
- **Gráfico de Barras**: Progreso de todos los KPIs
- **Medidor**: % Cumplimiento Global

### Página 2: Análisis por Categoría

- **Matriz**: Categorías vs Estados
- **Gráfico de Anillos**: Distribución por categoría
- **Tabla**: Detalle de cada KPI

### Página 3: Tendencias

- **Gráfico de Líneas**: Evolución histórica
- **Gráfico de Área**: Acumulado por mes
- **Tabla**: Cambios mensuales

### Página 4: Detalle por KPI

- **Segmentador**: Selector de KPI
- **Tabla Dinámica**: Items del KPI seleccionado
- **Tarjetas**: Métricas específicas

## 🔗 Endpoints API Completos

```
# Dashboard Principal
GET http://localhost:3000/api/kpi-stars/dashboard

# Para Power BI (optimizado)
GET http://localhost:3000/api/kpi-stars/powerbi

# Histórico
GET http://localhost:3000/api/kpi-stars/historico
GET http://localhost:3000/api/kpi-stars/historico?fecha_inicio=2025-01-01&fecha_fin=2025-12-31

# Detalle de KPI específico
GET http://localhost:3000/api/kpi-stars/detalle/KPI-MAT-001

# Desglose (items) de KPI
GET http://localhost:3000/api/kpi-stars/breakdown/KPI-MAT-001
GET http://localhost:3000/api/kpi-stars/breakdown/KPI-EMP-001
GET http://localhost:3000/api/kpi-stars/breakdown/KPI-FOR-001
GET http://localhost:3000/api/kpi-stars/breakdown/KPI-EVE-001
GET http://localhost:3000/api/kpi-stars/breakdown/KPI-DIF-001
```

## 🛠️ Solución de Problemas

### Error: No se puede conectar

**Solución:**
1. Verificar que el servidor esté corriendo: `npm run dev`
2. Verificar la URL: `http://localhost:3000`
3. Comprobar el firewall

### Error: Datos vacíos

**Solución:**
1. Verificar que la base de datos tenga datos
2. Ejecutar: `psql -d femete_impulsa -f database/schema.sql`
3. Ejecutar: `psql -d femete_impulsa -f database/kpis_powerbi.sql`

### Error: Formato de datos incorrecto

**Solución:**
1. Usar "Expandir tabla" en Power Query
2. Verificar tipos de datos
3. Aplicar transformaciones necesarias

## 📝 Ejemplo Completo: Dashboard Básico

### Paso 1: Crear Conexiones

```powerquery
// Conexión KPIs
let
    Source = Json.Document(Web.Contents("http://localhost:3000/api/kpi-stars/powerbi")),
    metadata = Source[metadata],
    kpis = Source[kpis],
    #"Converted to Table" = Table.FromList(kpis, Splitter.SplitByNothing()),
    #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", 
        {"kpi_codigo", "kpi_nombre", "valor_objetivo", "valor_actual", "porcentaje", "estado", "unidad", "categoria"})
in
    #"Expanded Column1"
```

### Paso 2: Crear Visuales

1. **Insertar Tarjeta** para cada KPI
2. **Formato Condicional** basado en `porcentaje`
3. **Gráfico de Barras** con todos los KPIs
4. **Filtros** por categoría y estado

### Paso 3: Publicar

1. **Archivo** → **Publicar** → **Publicar en Power BI**
2. Seleccionar área de trabajo
3. Configurar actualización automática

## 📞 Soporte

Para consultas sobre la integración con Power BI:
- Email: admin@femete-impulsa.com
- Documentación API: http://localhost:3000/api

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Programa**: STARS 2025 - FEMETE IMPULSA
