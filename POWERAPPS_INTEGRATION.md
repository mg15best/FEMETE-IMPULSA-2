# Guía de Integración con Power Apps - FEMETE IMPULSA

## 📱 Integración Completa con Microsoft Power Platform

Esta guía explica cómo importar y utilizar la API de FEMETE IMPULSA en Power Apps, permitiendo crear aplicaciones móviles y web personalizadas.

## 🔌 Método 1: Conector Personalizado (Recomendado)

### Paso 1: Obtener el Archivo OpenAPI

1. **Acceder al endpoint OpenAPI**:
   ```
   http://localhost:3000/api/openapi.json
   ```

2. **Descargar el archivo JSON** o copiar el contenido

3. **Guardar como** `femete-impulsa-openapi.json`

### Paso 2: Crear Conector Personalizado en Power Apps

1. **Ir a Power Apps** (https://make.powerapps.com)

2. **Navegación**:
   - Ir a "Datos" → "Conectores personalizados"
   - Clic en "+ Nuevo conector personalizado"
   - Seleccionar "Importar un archivo OpenAPI"

3. **Configuración del Conector**:
   - Nombre: `FEMETE IMPULSA API`
   - Descripción: `Conector para gestión STARS 2025`
   - Host: `localhost:3000` (desarrollo) o `api.femete-impulsa.com` (producción)
   - Esquema: `http` o `https`

4. **Importar Archivo**:
   - Subir el archivo `femete-impulsa-openapi.json`
   - Power Apps reconocerá automáticamente todas las operaciones

5. **Seguridad** (Opcional):
   - Tipo de autenticación: "Sin autenticación" (desarrollo)
   - Para producción: configurar "API Key" o "OAuth 2.0"

6. **Crear Conector**:
   - Revisar operaciones disponibles
   - Clic en "Crear conector"

### Paso 3: Usar el Conector en Power Apps

1. **Crear Nueva App**:
   - Ir a "Aplicaciones" → "Nueva aplicación"
   - Elegir "Aplicación de lienzo" o "Aplicación basada en modelo"

2. **Agregar Conexión de Datos**:
   - En el editor, ir a "Datos" → "Agregar datos"
   - Buscar "FEMETE IMPULSA API"
   - Hacer clic para agregar

3. **Usar en la Aplicación**:
   ```powerapp
   // Obtener todas las empresas
   ClearCollect(
       ColEmpresas,
       'FEMETE IMPULSA API'.GetEmpresas()
   )
   
   // Crear nueva empresa
   'FEMETE IMPULSA API'.CreateEmpresa({
       razon_social: TextInput_RazonSocial.Text,
       cif: TextInput_CIF.Text,
       sector: Dropdown_Sector.Selected.Value,
       email: TextInput_Email.Text,
       telefono: TextInput_Telefono.Text
   })
   
   // Actualizar empresa
   'FEMETE IMPULSA API'.UpdateEmpresa(
       GalleriaEmpresas.Selected.id,
       {
           razon_social: TextInput_RazonSocial.Text,
           sector: Dropdown_Sector.Selected.Value
       }
   )
   
   // Eliminar empresa
   'FEMETE IMPULSA API'.DeleteEmpresa(
       GalleriaEmpresas.Selected.id
   )
   ```

## 🎨 Método 2: Conexión Directa HTTP

### Usar HTTP Request en Power Apps

```powerapp
// GET - Obtener empresas
ClearCollect(
    ColEmpresas,
    ForAll(
        ParseJSON(
            Concat(
                Text(
                    HTTPRequest(
                        "http://localhost:3000/api/empresas",
                        HTTPRequestMethod.GET
                    ).ResponseText
                )
            )
        ),
        {
            id: Value.id,
            razon_social: Value.razon_social,
            cif: Value.cif,
            sector: Value.sector
        }
    )
)

// POST - Crear empresa
HTTPRequest(
    "http://localhost:3000/api/empresas",
    HTTPRequestMethod.POST,
    JSON({
        razon_social: TextInput_RazonSocial.Text,
        cif: TextInput_CIF.Text,
        sector: Dropdown_Sector.Selected.Value,
        email: TextInput_Email.Text
    }, JSONFormat.IgnoreUnsupportedTypes),
    {
        "Content-Type": "application/json"
    }
)
```

## 📊 Integración con Dataverse (Common Data Service)

### Crear Tablas Personalizadas en Dataverse

1. **Sincronizar Datos**:
   ```powerapp
   // Sincronizar empresas a Dataverse
   ForAll(
       'FEMETE IMPULSA API'.GetEmpresas(),
       Patch(
           'Empresas Dataverse',
           Defaults('Empresas Dataverse'),
           {
               'Razón Social': razon_social,
               CIF: cif,
               Sector: sector,
               Email: email,
               'ID Externo': id
           }
       )
   )
   ```

2. **Sincronización Bidireccional**:
   - Crear flujo en Power Automate
   - Trigger: Cuando se modifica registro en Dataverse
   - Acción: Actualizar vía API de FEMETE IMPULSA

## 🔄 Power Automate - Flujos Automáticos

### Ejemplo 1: Notificación de Nueva Empresa

1. **Crear Flujo**:
   - Trigger: "Recurrencia" (cada hora)
   - Acción: HTTP Request a `/api/empresas`
   - Condición: Filtrar empresas nuevas
   - Acción: Enviar email de notificación

2. **Configuración HTTP**:
   ```json
   {
       "method": "GET",
       "uri": "http://localhost:3000/api/empresas",
       "headers": {
           "Content-Type": "application/json"
       }
   }
   ```

### Ejemplo 2: Registro de Sesión desde Outlook

1. **Trigger**: Cuando llega email con asunto específico
2. **Acción**: Parsear contenido del email
3. **Acción**: HTTP POST a `/api/sesiones-asesoramiento`
4. **Acción**: Enviar confirmación

## 📱 Ejemplos de Apps

### App 1: Registro Rápido de Interacciones

**Pantallas**:
1. Lista de empresas
2. Formulario de nueva interacción
3. Confirmación

**Fórmulas Clave**:
```powerapp
// OnStart de la App
ClearCollect(ColEmpresas, 'FEMETE IMPULSA API'.GetEmpresas());
ClearCollect(ColCanales, 'FEMETE IMPULSA API'.GetCatalogos("canal"));

// OnSelect botón guardar
'FEMETE IMPULSA API'.CreateInteraccion({
    empresa_id: Dropdown_Empresa.Selected.id,
    canal_id: Dropdown_Canal.Selected.id,
    descripcion: TextInput_Descripcion.Text,
    fecha_interaccion: DatePicker_Fecha.SelectedDate,
    resultado: TextArea_Resultado.Text
});
Navigate(Screen_Confirmacion)
```

### App 2: Dashboard de KPIs Móvil

**Componentes**:
- Tarjetas de KPI
- Gráficos de progreso
- Lista de alertas

**Fórmulas**:
```powerapp
// Cargar KPIs
ClearCollect(
    ColKPIs,
    'FEMETE IMPULSA API'.GetKPIDashboard().kpis
)

// Mostrar en galería
Gallery_KPIs.Items = ColKPIs

// Color según estado
Switch(
    ThisItem.estado,
    "Cumplido", RGBA(40, 167, 69, 1),
    "En Progreso", RGBA(255, 193, 7, 1),
    "Pendiente", RGBA(220, 53, 69, 1)
)
```

### App 3: Asistencia a Eventos

**Flujo**:
1. Escanear código QR del asistente
2. Buscar persona en sistema
3. Registrar asistencia
4. Confirmar

**Fórmulas**:
```powerapp
// OnScan código QR
Set(varPersonaID, BarcodeScanner.Value);
LookUp(ColPersonas, id = varPersonaID);

// Registrar asistencia
'FEMETE IMPULSA API'.CreateAsistenciaEvento({
    evento_id: varEventoActual.id,
    persona_id: varPersonaID,
    hora_entrada: Now(),
    asistio: true
});
```

## 🔐 Seguridad y Autenticación

### Configurar API Key (Producción)

1. **En el servidor**:
   - Generar API Key única por app
   - Almacenar en variables de entorno

2. **En Power Apps**:
   - Configurar header personalizado:
   ```powerapp
   HTTPRequest(
       "https://api.femete-impulsa.com/api/empresas",
       HTTPRequestMethod.GET,
       "",
       {
           "X-API-Key": "tu-api-key-aqui"
       }
   )
   ```

### OAuth 2.0 (Recomendado para Producción)

1. Configurar Azure AD
2. Registrar aplicación
3. Configurar conector personalizado con OAuth
4. Los usuarios se autentican con sus credenciales Microsoft

## 📊 Integración con Power BI desde Power Apps

### Embed Power BI en Power Apps

```powerapp
// Configurar control Power BI
PowerBI_Control.ReportId = "tu-report-id"
PowerBI_Control.WorkspaceId = "tu-workspace-id"

// Filtrar por empresa seleccionada
PowerBI_Control.Filters = JSON({
    "$schema": "http://powerbi.com/product/schema#basic",
    "target": {
        "table": "Empresas",
        "column": "empresa_id"
    },
    "operator": "In",
    "values": [GalleriaEmpresas.Selected.id]
})
```

## 🌐 Publicación y Distribución

### Compartir la App

1. **Guardar y Publicar**:
   - Clic en "Archivo" → "Guardar"
   - Clic en "Publicar"
   - Seleccionar versión

2. **Compartir con Usuarios**:
   - Clic en "Compartir"
   - Añadir usuarios o grupos de Azure AD
   - Asignar permisos

3. **Acceso Móvil**:
   - Los usuarios descargan "Power Apps" desde App Store/Google Play
   - Inician sesión con su cuenta Microsoft
   - Acceden a la app compartida

## 🎯 Casos de Uso Recomendados

### 1. App de Registro Móvil
**Para**: Técnicos en campo
**Funcionalidad**: Registrar interacciones, subir fotos, crear tareas

### 2. Dashboard Ejecutivo
**Para**: Dirección
**Funcionalidad**: Ver KPIs en tiempo real, alertas, informes

### 3. Gestión de Eventos
**Para**: Coordinadores
**Funcionalidad**: Control de asistencia con QR, encuestas in-situ

### 4. Portal de Empresas
**Para**: Empresas beneficiarias
**Funcionalidad**: Ver su historial, documentos, próximas formaciones

## 🔧 Troubleshooting

### Error: "No se puede conectar a la API"

**Solución**:
1. Verificar que el servidor está corriendo
2. Comprobar la URL en el conector
3. Verificar configuración CORS
4. Revisar firewall/red

### Error: "Operación no permitida"

**Solución**:
1. Verificar permisos del conector
2. Comprobar autenticación
3. Revisar roles del usuario

### Los datos no se actualizan

**Solución**:
```powerapp
// Forzar recarga
Refresh('FEMETE IMPULSA API')
// O
ClearCollect(ColEmpresas, 'FEMETE IMPULSA API'.GetEmpresas())
```

## 📞 Soporte

Para consultas sobre integración con Power Apps:
- Documentación completa: http://localhost:3000/api-docs
- OpenAPI Spec: http://localhost:3000/api/openapi.json
- Email: admin@femete-impulsa.com

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Compatible con**: Power Apps, Power Automate, Power BI
