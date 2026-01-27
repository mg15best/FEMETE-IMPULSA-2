// ============================================
// CATÁLOGOS (Catalogs)
// ============================================

export interface CatalogoEstado {
  id?: number;
  nombre_estado: string;
  codigo_estado: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoPrioridad {
  id?: number;
  nombre_prioridad: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoTipo {
  id?: number;
  nombre_tipo: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoCanal {
  id?: number;
  nombre_canal: string;
  codigo_canal: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// ENTIDADES PRINCIPALES (Main Entities)
// ============================================

export interface Personas {
  id?: number;
  nombre: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  empresa_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Empresa {
  id?: number;
  nombre_empresa: string;
  cif_identificador: string;
  direccion?: string;
  codigo_postal?: string;
  municipio?: string;
  provincia?: string;
  comunidad_autonoma?: string;
  telefono?: string;
  email?: string;
  sector?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EntidadColaboradora {
  id?: number;
  nombre_entidad: string;
  tipo_entidad?: string;
  email?: string;
  telefono?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// RELACIONES (Relationships)
// ============================================

export interface ContactoEmpresa {
  id?: number;
  persona_id: number;
  empresa_id: number;
  cargo_rol?: string;
  canal_preferido_id?: number;
  contacto_principal?: boolean;
  consentimiento_rgpd?: boolean;
  fecha_consentimiento?: Date;
  notas?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ConexionEmpresaEntidad {
  id?: number;
  nombre_conexion: string;
  empresa_id: number;
  entidad_colaboradora_id: number;
  tipo_conexion?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface InteraccionEntidad {
  id?: number;
  nombre_interaccion: string;
  empresa_id: number;
  persona_id?: number;
  entidad_colaboradora_id?: number;
  canal_id?: number;
  fecha: Date;
  resultado?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// FORMACIÓN Y EVENTOS (Training and Events)
// ============================================

export interface Formacion {
  id?: number;
  codigo?: string;
  titulo?: string;
  descripcion?: string;
  tipo_id?: number;
  nombre_formacion: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  duracion_horas?: number;
  horas_totales?: number;
  horario?: string;
  lugar?: string;
  plataforma_online?: string;
  capacidad_maxima?: number;
  entidad_formadora?: string;
  formador?: string;
  responsable?: string;
  objetivo?: string;
  objetivos?: string;
  contenido?: string;
  contenidos?: string;
  estado_id?: number;
  presupuesto?: number;
  coste_real?: number;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Evento {
  id?: number;
  codigo?: string;
  titulo?: string;
  nombre_evento: string;
  tipo_id?: number;
  tipo_evento_id?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  lugar?: string;
  direccion?: string;
  descripcion?: string;
  plataforma_online?: string;
  capacidad_maxima?: number;
  aforo_actual?: number;
  organizador?: string;
  entidad_organizadora?: string;
  ponentes?: string;
  agenda?: string;
  estado_id?: number;
  presupuesto?: number;
  coste_real?: number;
  publico_objetivo?: string;
  requisitos?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AsistenciaFormacion {
  id?: number;
  persona_id: number;
  formacion_id: number;
  empresa_id?: number;
  asistio?: boolean;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AsistenciaEvento {
  id?: number;
  persona_id: number;
  evento_id: number;
  empresa_id?: number;
  asistio?: boolean;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvitacionEvento {
  id?: number;
  evento_id: number;
  persona_id?: number;
  empresa_id?: number;
  canal_invitacion_id?: number;
  fecha_invitacion: Date;
  aceptada?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// ENCUESTAS (Surveys)
// ============================================

export interface EncuestaFormacion {
  id?: number;
  nombre_encuesta: string;
  formacion_id: number;
  fecha?: Date;
  resultado?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EncuestaEvento {
  id?: number;
  nombre_encuesta: string;
  evento_id: number;
  fecha?: Date;
  resultado?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// ASESORAMIENTO Y PLANES (Advisory and Plans)
// ============================================

export interface SesionAsesoramiento {
  id?: number;
  codigo?: string;
  nombre_sesion: string;
  empresa_id: number;
  persona_id?: number;
  persona_contacto_id?: number;
  tipo_id?: number;
  fecha_sesion: Date;
  duracion?: number;
  duracion_minutos?: number;
  canal_id?: number;
  modalidad?: string;
  lugar?: string;
  asesor?: string;
  tematica?: string;
  estado_sesion_id?: number;
  estado_id?: number;
  responsable?: string;
  temas_tratados?: string;
  descripcion?: string;
  objetivos?: string;
  resultados?: string;
  necesidades_detectadas?: string;
  acuerdos_alcanzados?: string;
  recomendaciones?: string;
  seguimiento_requerido?: boolean;
  proximo_paso?: string;
  fecha_proximo_paso?: Date;
  fecha_seguimiento?: Date;
  evidencia_sesion?: string;
  valoracion?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlanAccion {
  id?: number;
  nombre_plan: string;
  empresa_id: number;
  sesion_asesoramiento_id?: number;
  objetivo?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  prioridad_id?: number;
  estado_id?: number;
  responsable?: string;
  resultado_plan?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TareaPlanAccion {
  id?: number;
  nombre_tarea: string;
  plan_accion_id: number;
  responsable?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado_id?: number;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// MATERIALES Y EVIDENCIAS (Materials and Evidence)
// ============================================

export interface Material {
  id?: number;
  material: string;
  nombre_material: string;
  tipo_material_id?: number;
  descripcion?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdjuntoEvidencia {
  id?: number;
  nombre_adjunto: string;
  archivo: string;
  tipo_archivo?: string;
  tipo_evidencia?: string;
  fecha_evidencia?: Date;
  material_id?: number;
  relacionado_con?: string;
  relacionado_id?: number;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// DIFUSIÓN E INFORMES (Diffusion and Reports)
// ============================================

export interface DifusionImpacto {
  id?: number;
  nombre_difusion: string;
  tipo_difusion_id?: number;
  alcance_estimado?: number;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Informe {
  id?: number;
  nombre_informe: string;
  tipo_informe_id?: number;
  fecha?: Date;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LogExportacion {
  id?: number;
  nombre_exportacion: string;
  fecha?: Date;
  usuario?: string;
  tipo_exportacion?: string;
  resultado?: string;
  created_at?: Date;
}

// ============================================
// VISTAS 360º (360º Views)
// ============================================

export interface Vista360Persona {
  persona_id: number;
  nombre: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  empresa_id?: number;
  nombre_empresa?: string;
  cif_identificador?: string;
  roles_empresas: any[]; // JSON array of company roles
  formaciones_asistidas: number;
  eventos_asistidos: number;
  interacciones_realizadas: number;
  sesiones_asesoramiento: number;
  ultima_actividad?: Date;
}

export interface Vista360Empresa {
  empresa_id: number;
  nombre_empresa: string;
  cif_identificador: string;
  sector?: string;
  municipio?: string;
  provincia?: string;
  telefono?: string;
  email?: string;
  total_personas: number;
  contactos: any[]; // JSON array of contacts
  sesiones_asesoramiento: number;
  planes_accion: number;
  planes_accion_activos: number;
  total_interacciones: number;
  ultima_interaccion?: Date;
  formaciones_participadas: number;
  eventos_participados: number;
  entidades_colaboradoras_activas: number;
  nivel_actividad: string;
  ultima_actividad?: Date;
}

export interface Vista360Formacion {
  formacion_id: number;
  nombre_formacion: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  horas_totales?: number;
  entidad_formadora?: string;
  responsable?: string;
  total_invitados: number;
  total_asistentes: number;
  porcentaje_asistencia?: number;
  empresas_representadas: number;
  encuestas_realizadas: number;
  evidencias_adjuntas: number;
  lista_asistentes: any[]; // JSON array of attendees
}

export interface Vista360Evento {
  evento_id: number;
  nombre_evento: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  lugar?: string;
  tipo_evento?: string;
  entidad_organizadora?: string;
  total_invitaciones: number;
  invitaciones_aceptadas: number;
  total_asistentes: number;
  empresas_representadas: number;
  encuestas_realizadas: number;
  evidencias_adjuntas: number;
  lista_asistentes: any[]; // JSON array of attendees
}

export interface VistaTimelineActividad {
  tipo_actividad: 'Interaccion' | 'Sesion' | 'Formacion' | 'Evento';
  actividad_id: number;
  nombre: string;
  fecha_actividad?: Date;
  empresa_id?: number;
  nombre_empresa?: string;
  persona_id?: number;
  persona_nombre?: string;
  persona_apellidos?: string;
  canal?: string;
  detalles?: string;
  created_at?: Date;
}

export interface VistaEstadisticasGenerales {
  total_personas: number;
  total_empresas: number;
  total_entidades_colaboradoras: number;
  total_formaciones: number;
  total_eventos: number;
  total_sesiones_asesoramiento: number;
  total_planes_accion: number;
  planes_accion_activos: number;
  total_interacciones: number;
  total_materiales: number;
  total_evidencias: number;
  total_impactos_difusion: number;
  total_informes: number;
  total_asistencias_formacion: number;
  total_asistencias_evento: number;
}
