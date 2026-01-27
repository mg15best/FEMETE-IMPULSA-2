import { Request, Response } from 'express';
import pool from '../config/database';
import { SesionAsesoramiento } from '../models/types';

export class SesionAsesoramientoController {
  static async getAll(req: Request, res: Response) {
    try {
      const { empresa_id, estado_id, tipo_id } = req.query;
      let query = `
        SELECT sa.*,
               e.razon_social as empresa_nombre,
               p.nombre as persona_contacto_nombre,
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre
        FROM SesionAsesoramiento sa
        JOIN Empresa e ON sa.empresa_id = e.id
        LEFT JOIN Personas p ON sa.persona_contacto_id = p.id
        LEFT JOIN CatalogoTipo ct ON sa.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON sa.estado_id = ce.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (empresa_id) {
        query += ` AND sa.empresa_id = $${paramCount}`;
        params.push(empresa_id);
        paramCount++;
      }

      if (estado_id) {
        query += ` AND sa.estado_id = $${paramCount}`;
        params.push(estado_id);
        paramCount++;
      }

      if (tipo_id) {
        query += ` AND sa.tipo_id = $${paramCount}`;
        params.push(tipo_id);
        paramCount++;
      }

      query += ' ORDER BY sa.fecha_sesion DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching sesiones asesoramiento:', error);
      res.status(500).json({ error: 'Failed to fetch sesiones asesoramiento' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT sa.*,
               e.razon_social as empresa_nombre,
               p.nombre as persona_contacto_nombre,
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre
        FROM SesionAsesoramiento sa
        JOIN Empresa e ON sa.empresa_id = e.id
        LEFT JOIN Personas p ON sa.persona_contacto_id = p.id
        LEFT JOIN CatalogoTipo ct ON sa.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON sa.estado_id = ce.id
        WHERE sa.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Sesión asesoramiento not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching sesión asesoramiento:', error);
      res.status(500).json({ error: 'Failed to fetch sesión asesoramiento' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const sesion: SesionAsesoramiento = req.body;
      const query = `
        INSERT INTO SesionAsesoramiento (
          codigo, empresa_id, persona_contacto_id, tipo_id, fecha_sesion,
          duracion_minutos, modalidad, lugar, asesor, tematica, descripcion,
          objetivos, resultados, recomendaciones, seguimiento_requerido,
          fecha_seguimiento, estado_id, valoracion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;
      const values = [
        sesion.codigo, sesion.empresa_id, sesion.persona_contacto_id, sesion.tipo_id,
        sesion.fecha_sesion, sesion.duracion_minutos, sesion.modalidad, sesion.lugar,
        sesion.asesor, sesion.tematica, sesion.descripcion, sesion.objetivos,
        sesion.resultados, sesion.recomendaciones, sesion.seguimiento_requerido,
        sesion.fecha_seguimiento, sesion.estado_id, sesion.valoracion
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating sesión asesoramiento:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'Código already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create sesión asesoramiento' });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sesion: Partial<SesionAsesoramiento> = req.body;
      
      const query = `
        UPDATE SesionAsesoramiento 
        SET persona_contacto_id = COALESCE($1, persona_contacto_id),
            tipo_id = COALESCE($2, tipo_id),
            fecha_sesion = COALESCE($3, fecha_sesion),
            duracion_minutos = COALESCE($4, duracion_minutos),
            modalidad = COALESCE($5, modalidad),
            lugar = COALESCE($6, lugar),
            asesor = COALESCE($7, asesor),
            tematica = COALESCE($8, tematica),
            descripcion = COALESCE($9, descripcion),
            objetivos = COALESCE($10, objetivos),
            resultados = COALESCE($11, resultados),
            recomendaciones = COALESCE($12, recomendaciones),
            seguimiento_requerido = COALESCE($13, seguimiento_requerido),
            fecha_seguimiento = COALESCE($14, fecha_seguimiento),
            estado_id = COALESCE($15, estado_id),
            valoracion = COALESCE($16, valoracion),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        RETURNING *
      `;
      
      const values = [
        sesion.persona_contacto_id, sesion.tipo_id, sesion.fecha_sesion, sesion.duracion_minutos,
        sesion.modalidad, sesion.lugar, sesion.asesor, sesion.tematica, sesion.descripcion,
        sesion.objetivos, sesion.resultados, sesion.recomendaciones, sesion.seguimiento_requerido,
        sesion.fecha_seguimiento, sesion.estado_id, sesion.valoracion, id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Sesión asesoramiento not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating sesión asesoramiento:', error);
      res.status(500).json({ error: 'Failed to update sesión asesoramiento' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM SesionAsesoramiento WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Sesión asesoramiento not found' });
      }

      res.json({ message: 'Sesión asesoramiento deleted successfully' });
    } catch (error) {
      console.error('Error deleting sesión asesoramiento:', error);
      res.status(500).json({ error: 'Failed to delete sesión asesoramiento' });
    }
  }
}
