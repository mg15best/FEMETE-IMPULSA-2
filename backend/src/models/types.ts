// ============================================
// CATÁLOGOS (Catalogs)
// ============================================

export interface CatalogoEstado {
  id?: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoPrioridad {
  id?: number;
  nombre: string;
  nivel?: number;
  color?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoTipo {
  id?: number;
  categoria: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CatalogoCanal {
  id?: number;
  nombre: string;
  descripcion?: string;
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
  cargo?: string;
  organizacion?: string;
  genero?: string;
  fecha_nacimiento?: Date;
  provincia?: string;
  municipio?: string;
  codigo_postal?: string;
  notas?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Empresa {
  id?: number;
  razon_social: string;
  nombre_comercial?: string;
  cif: string;
  sector?: string;
  tamano?: string;
  numero_empleados?: number;
  facturacion_anual?: number;
  direccion?: string;
  provincia?: string;
  municipio?: string;
  codigo_postal?: string;
  telefono?: string;
  email?: string;
  web?: string;
  descripcion?: string;
  estado_id?: number;
  fecha_alta?: Date;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface EntidadColaboradora {
  id?: number;
  nombre: string;
  tipo?: string;
  ambito?: string;
  direccion?: string;
  provincia?: string;
  municipio?: string;
  telefono?: string;
  email?: string;
  web?: string;
  persona_contacto?: string;
  descripcion?: string;
  fecha_colaboracion?: Date;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// RELACIONES (Relationships)
// ============================================

export interface ContactoEmpresa {
  id?: number;
  empresa_id: number;
  persona_id: number;
  es_contacto_principal?: boolean;
  departamento?: string;
  notas?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ConexionEmpresaEntidad {
  id?: number;
  empresa_id: number;
  entidad_id: number;
  tipo_conexion?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface InteraccionEntidad {
  id?: number;
  entidad_id: number;
  empresa_id?: number;
  persona_id?: number;
  tipo_interaccion?: string;
  canal_id?: number;
  fecha_interaccion?: Date;
  duracion_minutos?: number;
  descripcion?: string;
  resultado?: string;
  seguimiento_requerido?: boolean;
  fecha_seguimiento?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// FORMACIÓN Y EVENTOS (Training and Events)
// ============================================

export interface Formacion {
  id?: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  tipo_id?: number;
  modalidad?: string;
  duracion_horas?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  horario?: string;
  lugar?: string;
  plataforma_online?: string;
  capacidad_maxima?: number;
  formador?: string;
  contenido?: string;
  objetivos?: string;
  estado_id?: number;
  presupuesto?: number;
  coste_real?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Evento {
  id?: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  tipo_id?: number;
  fecha_inicio: Date;
  fecha_fin?: Date;
  lugar?: string;
  direccion?: string;
  modalidad?: string;
  plataforma_online?: string;
  capacidad_maxima?: number;
  aforo_actual?: number;
  organizador?: string;
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
  formacion_id: number;
  persona_id: number;
  empresa_id?: number;
  fecha_inscripcion?: Date;
  estado?: string;
  asistio?: boolean;
  porcentaje_asistencia?: number;
  calificacion?: number;
  certificado_emitido?: boolean;
  fecha_certificado?: Date;
  valoracion?: number;
  comentarios?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AsistenciaEvento {
  id?: number;
  evento_id: number;
  persona_id: number;
  empresa_id?: number;
  fecha_inscripcion?: Date;
  estado?: string;
  asistio?: boolean;
  hora_entrada?: Date;
  hora_salida?: Date;
  valoracion?: number;
  comentarios?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvitacionEvento {
  id?: number;
  evento_id: number;
  persona_id: number;
  empresa_id?: number;
  fecha_invitacion?: Date;
  canal_id?: number;
  estado?: string;
  fecha_respuesta?: Date;
  acepto?: boolean;
  motivo_rechazo?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// ENCUESTAS (Surveys)
// ============================================

export interface EncuestaFormacion {
  id?: number;
  formacion_id: number;
  persona_id: number;
  fecha_respuesta?: Date;
  valoracion_general?: number;
  valoracion_contenido?: number;
  valoracion_formador?: number;
  valoracion_organizacion?: number;
  valoracion_utilidad?: number;
  aspectos_positivos?: string;
  aspectos_mejora?: string;
  sugerencias?: string;
  recomendaria?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface EncuestaEvento {
  id?: number;
  evento_id: number;
  persona_id: number;
  fecha_respuesta?: Date;
  valoracion_general?: number;
  valoracion_contenido?: number;
  valoracion_organizacion?: number;
  valoracion_instalaciones?: number;
  cumplimiento_expectativas?: number;
  aspectos_positivos?: string;
  aspectos_mejora?: string;
  sugerencias?: string;
  interesado_futuras_actividades?: boolean;
  temas_interes?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// ASESORAMIENTO Y PLANES (Advisory and Plans)
// ============================================

export interface SesionAsesoramiento {
  id?: number;
  codigo: string;
  empresa_id: number;
  persona_contacto_id?: number;
  tipo_id?: number;
  fecha_sesion: Date;
  duracion_minutos?: number;
  modalidad?: string;
  lugar?: string;
  asesor?: string;
  tematica?: string;
  descripcion?: string;
  objetivos?: string;
  resultados?: string;
  recomendaciones?: string;
  seguimiento_requerido?: boolean;
  fecha_seguimiento?: Date;
  estado_id?: number;
  valoracion?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlanAccion {
  id?: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  empresa_id: number;
  sesion_asesoramiento_id?: number;
  responsable?: string;
  fecha_inicio?: Date;
  fecha_fin_prevista?: Date;
  fecha_fin_real?: Date;
  prioridad_id?: number;
  estado_id?: number;
  presupuesto?: number;
  coste_real?: number;
  progreso?: number;
  resultados_esperados?: string;
  resultados_obtenidos?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TareaPlanAccion {
  id?: number;
  plan_accion_id: number;
  titulo: string;
  descripcion?: string;
  responsable?: string;
  fecha_inicio?: Date;
  fecha_fin_prevista?: Date;
  fecha_fin_real?: Date;
  prioridad_id?: number;
  estado_id?: number;
  orden?: number;
  dependencias?: string;
  completada?: boolean;
  porcentaje_completado?: number;
  notas?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// MATERIALES Y EVIDENCIAS (Materials and Evidence)
// ============================================

export interface Material {
  id?: number;
  titulo: string;
  descripcion?: string;
  tipo_id?: number;
  categoria?: string;
  formato?: string;
  url?: string;
  ruta_archivo?: string;
  tamano_kb?: number;
  autor?: string;
  fecha_publicacion?: Date;
  palabras_clave?: string;
  formacion_id?: number;
  evento_id?: number;
  sesion_asesoramiento_id?: number;
  publico?: boolean;
  descargas?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdjuntoEvidencia {
  id?: number;
  titulo: string;
  descripcion?: string;
  tipo_documento?: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_kb?: number;
  tipo_mime?: string;
  formacion_id?: number;
  evento_id?: number;
  sesion_asesoramiento_id?: number;
  plan_accion_id?: number;
  empresa_id?: number;
  fecha_documento?: Date;
  subido_por?: string;
  verificado?: boolean;
  fecha_verificacion?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// DIFUSIÓN E INFORMES (Diffusion and Reports)
// ============================================

export interface DifusionImpacto {
  id?: number;
  titulo: string;
  descripcion?: string;
  tipo_id?: number;
  canal_id?: number;
  fecha_publicacion?: Date;
  alcance?: number;
  impresiones?: number;
  interacciones?: number;
  clics?: number;
  compartidos?: number;
  url?: string;
  formacion_id?: number;
  evento_id?: number;
  publico_objetivo?: string;
  resultados?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Informe {
  id?: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  tipo_id?: number;
  periodo_inicio?: Date;
  periodo_fin?: Date;
  fecha_generacion?: Date;
  generado_por?: string;
  contenido?: string;
  ruta_archivo?: string;
  formato?: string;
  estado_id?: number;
  publico?: boolean;
  destinatarios?: string;
  fecha_envio?: Date;
  conclusiones?: string;
  recomendaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LogExportacion {
  id?: number;
  usuario?: string;
  entidad?: string;
  formato?: string;
  filtros?: string;
  num_registros?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  tamano_kb?: number;
  ip_address?: string;
  exitoso?: boolean;
  mensaje_error?: string;
  created_at?: Date;
}
