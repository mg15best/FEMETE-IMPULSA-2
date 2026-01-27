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
  nombre_contacto: string;
  empresa_id: number;
  cargo_rol?: string;
  email?: string;
  telefono?: string;
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
  contacto_id?: number;
  canal_id?: number;
  fecha?: Date;
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
  nombre_formacion: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  horas_totales?: number;
  entidad_formadora?: string;
  responsable?: string;
  objetivo?: string;
  contenidos?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Evento {
  id?: number;
  nombre_evento: string;
  tipo_evento_id?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  modalidad?: string;
  lugar?: string;
  descripcion?: string;
  entidad_organizadora?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AsistenciaFormacion {
  id?: number;
  asistente_id: number;
  formacion_id: number;
  empresa_id?: number;
  contacto_id?: number;
  asistio?: boolean;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AsistenciaEvento {
  id?: number;
  asistente_id: number;
  evento_id: number;
  empresa_id?: number;
  contacto_id?: number;
  asistio?: boolean;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvitacionEvento {
  id?: number;
  evento_id: number;
  empresa_id?: number;
  contacto_id?: number;
  canal_invitacion_id?: number;
  fecha_invitacion?: Date;
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
  nombre_sesion: string;
  empresa_id: number;
  contacto_id?: number;
  fecha_sesion?: Date;
  duracion?: number;
  canal_id?: number;
  estado_sesion_id?: number;
  responsable?: string;
  temas_tratados?: string;
  necesidades_detectadas?: string;
  acuerdos_alcanzados?: string;
  proximo_paso?: string;
  fecha_proximo_paso?: Date;
  evidencia_sesion?: string;
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
