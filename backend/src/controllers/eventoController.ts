import { Request, Response } from 'express';
import pool from '../config/database';
import { Evento } from '../models/types';

export class EventoController {
  static async getAll(req: Request, res: Response) {
    try {
      const { tipo_id, modalidad } = req.query;
      let query = `
        SELECT e.*, 
               ct.nombre_tipo as tipo_nombre,
               COUNT(DISTINCT ae.id) as total_inscritos
        FROM Evento e
        LEFT JOIN CatalogoTipo ct ON e.tipo_evento_id = ct.id
        LEFT JOIN AsistenciaEvento ae ON e.id = ae.evento_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (tipo_id) {
        query += ` AND e.tipo_evento_id = $${paramCount}`;
        params.push(tipo_id);
        paramCount++;
      }

      if (modalidad) {
        query += ` AND e.modalidad = $${paramCount}`;
        params.push(modalidad);
        paramCount++;
      }

      query += ' GROUP BY e.id, ct.nombre_tipo ORDER BY e.fecha_inicio DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching eventos:', error);
      res.status(500).json({ error: 'Failed to fetch eventos' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT e.*, 
               ct.nombre_tipo as tipo_nombre
        FROM Evento e
        LEFT JOIN CatalogoTipo ct ON e.tipo_evento_id = ct.id
        WHERE e.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching evento:', error);
      res.status(500).json({ error: 'Failed to fetch evento' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const evento: Evento = req.body;
      const query = `
        INSERT INTO Evento (
          nombre_evento, descripcion, tipo_evento_id, fecha_inicio, fecha_fin,
          lugar, modalidad, entidad_organizadora
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        evento.nombre_evento,
        evento.descripcion,
        evento.tipo_evento_id,
        evento.fecha_inicio,
        evento.fecha_fin,
        evento.lugar,
        evento.modalidad,
        evento.entidad_organizadora
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating evento:', error);
      res.status(500).json({ error: 'Failed to create evento' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evento: Partial<Evento> = req.body;
      
      const query = `
        UPDATE Evento 
        SET nombre_evento = COALESCE($1, nombre_evento),
            descripcion = COALESCE($2, descripcion),
            tipo_evento_id = COALESCE($3, tipo_evento_id),
            fecha_inicio = COALESCE($4, fecha_inicio),
            fecha_fin = COALESCE($5, fecha_fin),
            lugar = COALESCE($6, lugar),
            modalidad = COALESCE($7, modalidad),
            entidad_organizadora = COALESCE($8, entidad_organizadora),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `;
      
      const values = [
        evento.nombre_evento,
        evento.descripcion,
        evento.tipo_evento_id,
        evento.fecha_inicio,
        evento.fecha_fin,
        evento.lugar,
        evento.modalidad,
        evento.entidad_organizadora,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating evento:', error);
      res.status(500).json({ error: 'Failed to update evento' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM Evento WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento not found' });
      }

      res.json({ message: 'Evento deleted successfully' });
    } catch (error) {
      console.error('Error deleting evento:', error);
      res.status(500).json({ error: 'Failed to delete evento' });
    }
  }

  // Get attendees for an event
  static async getAsistentes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT 
          ae.*,
          p.nombre,
          p.apellidos,
          p.email,
          e.nombre_empresa as empresa
        FROM AsistenciaEvento ae
        JOIN Personas p ON ae.persona_id = p.id
        LEFT JOIN Empresa e ON ae.empresa_id = e.id
        WHERE ae.evento_id = $1
        ORDER BY ae.created_at DESC
      `, [id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching asistentes:', error);
      res.status(500).json({ error: 'Failed to fetch asistentes' });
    }
  }
}
