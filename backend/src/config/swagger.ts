import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FEMETE IMPULSA API - STARS 2025',
      version: '1.0.0',
      description: 'API completa para gestión del programa STARS 2025. Compatible con Power Apps y Power BI.',
      contact: {
        name: 'FEMETE IMPULSA',
        email: 'admin@femete-impulsa.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.femete-impulsa.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        Empresa: {
          type: 'object',
          required: ['razon_social', 'cif'],
          properties: {
            id: { type: 'integer', readOnly: true },
            razon_social: { type: 'string', example: 'Empresa Ejemplo S.L.' },
            nombre_comercial: { type: 'string', example: 'Ejemplo Corp' },
            cif: { type: 'string', example: 'B12345678' },
            sector: { type: 'string', example: 'Tecnología' },
            tamano: { type: 'string', example: 'PYME' },
            numero_empleados: { type: 'integer', example: 25 },
            facturacion_anual: { type: 'number', example: 500000 },
            direccion: { type: 'string' },
            provincia: { type: 'string', example: 'Madrid' },
            municipio: { type: 'string', example: 'Madrid' },
            codigo_postal: { type: 'string', example: '28001' },
            telefono: { type: 'string', example: '+34 912345678' },
            email: { type: 'string', format: 'email', example: 'info@ejemplo.com' },
            web: { type: 'string', format: 'uri', example: 'https://ejemplo.com' },
            descripcion: { type: 'string' },
            estado_id: { type: 'integer' },
            fecha_alta: { type: 'string', format: 'date' },
            activo: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true }
          }
        },
        Formacion: {
          type: 'object',
          required: ['codigo', 'titulo'],
          properties: {
            id: { type: 'integer', readOnly: true },
            codigo: { type: 'string', example: 'FOR-2025-001' },
            titulo: { type: 'string', example: 'Píldora de Transformación Digital' },
            descripcion: { type: 'string' },
            tipo_id: { type: 'integer' },
            modalidad: { type: 'string', enum: ['Presencial', 'Online', 'Híbrida'] },
            duracion_horas: { type: 'number', example: 4 },
            fecha_inicio: { type: 'string', format: 'date' },
            fecha_fin: { type: 'string', format: 'date' },
            horario: { type: 'string', example: '10:00 - 14:00' },
            lugar: { type: 'string' },
            plataforma_online: { type: 'string' },
            capacidad_maxima: { type: 'integer', example: 30 },
            formador: { type: 'string' },
            contenido: { type: 'string' },
            objetivos: { type: 'string' },
            estado_id: { type: 'integer' },
            presupuesto: { type: 'number' },
            coste_real: { type: 'number' },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true }
          }
        },
        Evento: {
          type: 'object',
          required: ['codigo', 'titulo', 'fecha_inicio'],
          properties: {
            id: { type: 'integer', readOnly: true },
            codigo: { type: 'string', example: 'EVE-2025-001' },
            titulo: { type: 'string', example: 'Jornada de Innovación Empresarial' },
            descripcion: { type: 'string' },
            tipo_id: { type: 'integer' },
            fecha_inicio: { type: 'string', format: 'date-time' },
            fecha_fin: { type: 'string', format: 'date-time' },
            lugar: { type: 'string' },
            direccion: { type: 'string' },
            modalidad: { type: 'string', enum: ['Presencial', 'Online', 'Híbrida'] },
            plataforma_online: { type: 'string' },
            capacidad_maxima: { type: 'integer' },
            aforo_actual: { type: 'integer', default: 0 },
            organizador: { type: 'string' },
            ponentes: { type: 'string' },
            agenda: { type: 'string' },
            estado_id: { type: 'integer' },
            presupuesto: { type: 'number' },
            coste_real: { type: 'number' },
            publico_objetivo: { type: 'string' },
            requisitos: { type: 'string' },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true }
          }
        },
        SesionAsesoramiento: {
          type: 'object',
          required: ['codigo', 'empresa_id', 'fecha_sesion'],
          properties: {
            id: { type: 'integer', readOnly: true },
            codigo: { type: 'string', example: 'ASES-2025-001' },
            empresa_id: { type: 'integer' },
            persona_contacto_id: { type: 'integer' },
            tipo_id: { type: 'integer' },
            fecha_sesion: { type: 'string', format: 'date-time' },
            duracion_minutos: { type: 'integer', example: 90 },
            modalidad: { type: 'string', enum: ['Presencial', 'Online'] },
            lugar: { type: 'string' },
            asesor: { type: 'string' },
            tematica: { type: 'string' },
            descripcion: { type: 'string' },
            objetivos: { type: 'string' },
            resultados: { type: 'string' },
            recomendaciones: { type: 'string' },
            seguimiento_requerido: { type: 'boolean', default: false },
            fecha_seguimiento: { type: 'string', format: 'date' },
            estado_id: { type: 'integer' },
            valoracion: { type: 'integer', minimum: 1, maximum: 5 },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true }
          }
        },
        KPI: {
          type: 'object',
          properties: {
            kpi_codigo: { type: 'string', example: 'KPI-MAT-001' },
            kpi_nombre: { type: 'string', example: 'Material de apoyo' },
            valor_objetivo: { type: 'integer', example: 5 },
            valor_actual: { type: 'integer', example: 3 },
            porcentaje: { type: 'number', example: 60.00 },
            estado: { type: 'string', enum: ['Cumplido', 'En Progreso', 'Pendiente'] },
            unidad: { type: 'string', example: 'unidades' },
            categoria: { type: 'string', example: 'Recursos' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Empresas', description: 'Gestión de empresas beneficiarias' },
      { name: 'Formaciones', description: 'Gestión de píldoras formativas' },
      { name: 'Eventos', description: 'Gestión de eventos' },
      { name: 'Asesoramientos', description: 'Sesiones de asesoramiento' },
      { name: 'KPIs', description: 'Indicadores del programa STARS 2025' },
      { name: 'Exportación', description: 'Exportación de datos' }
    ]
  },
  apis: ['./backend/src/routes/*.ts', './backend/src/server.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
