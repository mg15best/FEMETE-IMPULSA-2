import { Request, Response } from 'express';
import pool from '../config/database';
import {
  Vista360Persona,
  Vista360Empresa,
  Vista360Formacion,
  Vista360Evento,
  VistaTimelineActividad,
  VistaEstadisticasGenerales
} from '../models/types';

/**
 * Controller for 360º views - provides comprehensive perspective of all entities
 */

// Get 360º view of a specific person
export const getPersona360 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Vista360Persona>(
      'SELECT * FROM Vista360_Personas WHERE persona_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching persona 360:', error);
    res.status(500).json({ error: 'Error al obtener vista 360 de persona' });
  }
};

// Get 360º view of all people
export const getAllPersonas360 = async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0, empresa_id } = req.query;
    
    let query = 'SELECT * FROM Vista360_Personas';
    const params: any[] = [];
    
    if (empresa_id) {
      query += ' WHERE empresa_id = $1';
      params.push(empresa_id);
    }
    
    query += ` ORDER BY ultima_actividad DESC NULLS LAST LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query<Vista360Persona>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching personas 360:', error);
    res.status(500).json({ error: 'Error al obtener vistas 360 de personas' });
  }
};

// Get 360º view of a specific company
export const getEmpresa360 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Vista360Empresa>(
      'SELECT * FROM Vista360_Empresas WHERE empresa_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching empresa 360:', error);
    res.status(500).json({ error: 'Error al obtener vista 360 de empresa' });
  }
};

// Get 360º view of all companies
export const getAllEmpresas360 = async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0, sector, nivel_actividad } = req.query;
    
    let query = 'SELECT * FROM Vista360_Empresas WHERE 1=1';
    const params: any[] = [];
    
    if (sector) {
      params.push(sector);
      query += ` AND sector = $${params.length}`;
    }
    
    if (nivel_actividad) {
      params.push(nivel_actividad);
      query += ` AND nivel_actividad = $${params.length}`;
    }
    
    query += ` ORDER BY ultima_actividad DESC NULLS LAST LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query<Vista360Empresa>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching empresas 360:', error);
    res.status(500).json({ error: 'Error al obtener vistas 360 de empresas' });
  }
};

// Get 360º view of a specific training
export const getFormacion360 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Vista360Formacion>(
      'SELECT * FROM Vista360_Formaciones WHERE formacion_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formación no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching formacion 360:', error);
    res.status(500).json({ error: 'Error al obtener vista 360 de formación' });
  }
};

// Get 360º view of all trainings
export const getAllFormaciones360 = async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await pool.query<Vista360Formacion>(
      'SELECT * FROM Vista360_Formaciones ORDER BY fecha_inicio DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching formaciones 360:', error);
    res.status(500).json({ error: 'Error al obtener vistas 360 de formaciones' });
  }
};

// Get 360º view of a specific event
export const getEvento360 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Vista360Evento>(
      'SELECT * FROM Vista360_Eventos WHERE evento_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching evento 360:', error);
    res.status(500).json({ error: 'Error al obtener vista 360 de evento' });
  }
};

// Get 360º view of all events
export const getAllEventos360 = async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await pool.query<Vista360Evento>(
      'SELECT * FROM Vista360_Eventos ORDER BY fecha_inicio DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching eventos 360:', error);
    res.status(500).json({ error: 'Error al obtener vistas 360 de eventos' });
  }
};

// Get timeline of all activities
export const getTimelineActividades = async (req: Request, res: Response) => {
  try {
    const { 
      limit = 100, 
      offset = 0, 
      tipo_actividad, 
      empresa_id, 
      persona_id,
      fecha_desde,
      fecha_hasta
    } = req.query;
    
    let query = 'SELECT * FROM Vista_Timeline_Actividades WHERE 1=1';
    const params: any[] = [];
    
    if (tipo_actividad) {
      params.push(tipo_actividad);
      query += ` AND tipo_actividad = $${params.length}`;
    }
    
    if (empresa_id) {
      params.push(empresa_id);
      query += ` AND empresa_id = $${params.length}`;
    }
    
    if (persona_id) {
      params.push(persona_id);
      query += ` AND persona_id = $${params.length}`;
    }
    
    if (fecha_desde) {
      params.push(fecha_desde);
      query += ` AND fecha_actividad >= $${params.length}`;
    }
    
    if (fecha_hasta) {
      params.push(fecha_hasta);
      query += ` AND fecha_actividad <= $${params.length}`;
    }
    
    query += ` ORDER BY fecha_actividad DESC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query<VistaTimelineActividad>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Error al obtener timeline de actividades' });
  }
};

// Get general statistics
export const getEstadisticasGenerales = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<VistaEstadisticasGenerales>(
      'SELECT * FROM Vista_Estadisticas_Generales'
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas generales' });
  }
};

// Get all relationships for a person (who they interact with, which companies, etc.)
export const getPersonaRelaciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get all relationships for this person
    const [empresas, interacciones, formaciones, eventos, sesiones] = await Promise.all([
      // Companies where person is a contact
      pool.query(`
        SELECT ce.*, e.nombre_empresa, e.sector
        FROM ContactoEmpresa ce
        JOIN Empresa e ON ce.empresa_id = e.id
        WHERE ce.persona_id = $1
      `, [id]),
      
      // Interactions
      pool.query(`
        SELECT ie.*, e.nombre_empresa, cc.nombre_canal
        FROM InteraccionEntidad ie
        LEFT JOIN Empresa e ON ie.empresa_id = e.id
        LEFT JOIN CatalogoCanal cc ON ie.canal_id = cc.id
        WHERE ie.persona_id = $1
        ORDER BY ie.fecha DESC
        LIMIT 10
      `, [id]),
      
      // Trainings attended
      pool.query(`
        SELECT f.*, af.asistio, e.nombre_empresa
        FROM AsistenciaFormacion af
        JOIN Formacion f ON af.formacion_id = f.id
        LEFT JOIN Empresa e ON af.empresa_id = e.id
        WHERE af.persona_id = $1
        ORDER BY f.fecha_inicio DESC
      `, [id]),
      
      // Events attended
      pool.query(`
        SELECT ev.*, ae.asistio, e.nombre_empresa
        FROM AsistenciaEvento ae
        JOIN Evento ev ON ae.evento_id = ev.id
        LEFT JOIN Empresa e ON ae.empresa_id = e.id
        WHERE ae.persona_id = $1
        ORDER BY ev.fecha_inicio DESC
      `, [id]),
      
      // Advisory sessions
      pool.query(`
        SELECT sa.*, e.nombre_empresa
        FROM SesionAsesoramiento sa
        JOIN Empresa e ON sa.empresa_id = e.id
        WHERE sa.persona_id = $1
        ORDER BY sa.fecha_sesion DESC
        LIMIT 10
      `, [id])
    ]);
    
    res.json({
      empresas: empresas.rows,
      interacciones_recientes: interacciones.rows,
      formaciones: formaciones.rows,
      eventos: eventos.rows,
      sesiones_asesoramiento: sesiones.rows
    });
  } catch (error) {
    console.error('Error fetching persona relaciones:', error);
    res.status(500).json({ error: 'Error al obtener relaciones de persona' });
  }
};

// Get all relationships for a company
export const getEmpresaRelaciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get all relationships for this company
    const [contactos, interacciones, sesiones, planes, formaciones, eventos, entidades] = await Promise.all([
      // Company contacts
      pool.query(`
        SELECT p.*, ce.cargo_rol, ce.contacto_principal
        FROM ContactoEmpresa ce
        JOIN Personas p ON ce.persona_id = p.id
        WHERE ce.empresa_id = $1
        ORDER BY ce.contacto_principal DESC, p.nombre
      `, [id]),
      
      // Recent interactions
      pool.query(`
        SELECT ie.*, p.nombre, p.apellidos, cc.nombre_canal
        FROM InteraccionEntidad ie
        LEFT JOIN Personas p ON ie.persona_id = p.id
        LEFT JOIN CatalogoCanal cc ON ie.canal_id = cc.id
        WHERE ie.empresa_id = $1
        ORDER BY ie.fecha DESC
        LIMIT 10
      `, [id]),
      
      // Advisory sessions
      pool.query(`
        SELECT sa.*, p.nombre, p.apellidos, ce.nombre_estado
        FROM SesionAsesoramiento sa
        LEFT JOIN Personas p ON sa.persona_id = p.id
        LEFT JOIN CatalogoEstado ce ON sa.estado_sesion_id = ce.id
        WHERE sa.empresa_id = $1
        ORDER BY sa.fecha_sesion DESC
      `, [id]),
      
      // Action plans
      pool.query(`
        SELECT pa.*, ce.nombre_estado, cp.nombre_prioridad
        FROM PlanAccion pa
        LEFT JOIN CatalogoEstado ce ON pa.estado_id = ce.id
        LEFT JOIN CatalogoPrioridad cp ON pa.prioridad_id = cp.id
        WHERE pa.empresa_id = $1
        ORDER BY pa.fecha_inicio DESC
      `, [id]),
      
      // Training participations
      pool.query(`
        SELECT f.*, COUNT(af.id) as asistentes
        FROM AsistenciaFormacion af
        JOIN Formacion f ON af.formacion_id = f.id
        WHERE af.empresa_id = $1
        GROUP BY f.id
        ORDER BY f.fecha_inicio DESC
      `, [id]),
      
      // Event participations
      pool.query(`
        SELECT ev.*, COUNT(ae.id) as asistentes
        FROM AsistenciaEvento ae
        JOIN Evento ev ON ae.evento_id = ev.id
        WHERE ae.empresa_id = $1
        GROUP BY ev.id
        ORDER BY ev.fecha_inicio DESC
      `, [id]),
      
      // Collaborating entities
      pool.query(`
        SELECT ec.*, cee.tipo_conexion, cee.activo
        FROM ConexionEmpresaEntidad cee
        JOIN EntidadColaboradora ec ON cee.entidad_colaboradora_id = ec.id
        WHERE cee.empresa_id = $1
      `, [id])
    ]);
    
    res.json({
      contactos: contactos.rows,
      interacciones_recientes: interacciones.rows,
      sesiones_asesoramiento: sesiones.rows,
      planes_accion: planes.rows,
      formaciones: formaciones.rows,
      eventos: eventos.rows,
      entidades_colaboradoras: entidades.rows
    });
  } catch (error) {
    console.error('Error fetching empresa relaciones:', error);
    res.status(500).json({ error: 'Error al obtener relaciones de empresa' });
  }
};
