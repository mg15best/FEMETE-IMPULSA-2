import { Request, Response } from 'express';
import pool from '../config/database';
import { Evento } from '../models/types';

export class EventoController {
  static async getAll(req: Request, res: Response) {
    try {
      const { tipo_id, estado_id, modalidad } = req.query;
      let query = `
        SELECT e.*, 
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre,
               COUNT(DISTINCT ae.id) as total_inscritos
        FROM Evento e
        LEFT JOIN CatalogoTipo ct ON e.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON e.estado_id = ce.id
        LEFT JOIN AsistenciaEvento ae ON e.id = ae.evento_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (tipo_id) {
        query += ` AND e.tipo_id = $${paramCount}`;
        params.push(tipo_id);
        paramCount++;
      }

      if (estado_id) {
        query += ` AND e.estado_id = $${paramCount}`;
        params.push(estado_id);
        paramCount++;
      }

      if (modalidad) {
        query += ` AND e.modalidad = $${paramCount}`;
        params.push(modalidad);
        paramCount++;
      }

      query += ' GROUP BY e.id, ct.nombre, ce.nombre ORDER BY e.fecha_inicio DESC';

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
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre
        FROM Evento e
        LEFT JOIN CatalogoTipo ct ON e.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON e.estado_id = ce.id
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
          codigo, titulo, descripcion, tipo_id, fecha_inicio, fecha_fin,
          lugar, direccion, modalidad, plataforma_online, capacidad_maxima,
          aforo_actual, organizador, ponentes, agenda, estado_id,
          presupuesto, coste_real, publico_objetivo, requisitos
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const values = [
        evento.codigo, evento.titulo, evento.descripcion, evento.tipo_id,
        evento.fecha_inicio, evento.fecha_fin, evento.lugar, evento.direccion,
        evento.modalidad, evento.plataforma_online, evento.capacidad_maxima,
        evento.aforo_actual || 0, evento.organizador, evento.ponentes,
        evento.agenda, evento.estado_id, evento.presupuesto, evento.coste_real,
        evento.publico_objetivo, evento.requisitos
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating evento:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'Código already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create evento' });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evento: Partial<Evento> = req.body;
      
      const query = `
        UPDATE Evento 
        SET titulo = COALESCE($1, titulo),
            descripcion = COALESCE($2, descripcion),
            tipo_id = COALESCE($3, tipo_id),
            fecha_inicio = COALESCE($4, fecha_inicio),
            fecha_fin = COALESCE($5, fecha_fin),
            lugar = COALESCE($6, lugar),
            direccion = COALESCE($7, direccion),
            modalidad = COALESCE($8, modalidad),
            plataforma_online = COALESCE($9, plataforma_online),
            capacidad_maxima = COALESCE($10, capacidad_maxima),
            aforo_actual = COALESCE($11, aforo_actual),
            organizador = COALESCE($12, organizador),
            ponentes = COALESCE($13, ponentes),
            agenda = COALESCE($14, agenda),
            estado_id = COALESCE($15, estado_id),
            presupuesto = COALESCE($16, presupuesto),
            coste_real = COALESCE($17, coste_real),
            publico_objetivo = COALESCE($18, publico_objetivo),
            requisitos = COALESCE($19, requisitos),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $20
        RETURNING *
      `;
      
      const values = [
        evento.titulo, evento.descripcion, evento.tipo_id, evento.fecha_inicio,
        evento.fecha_fin, evento.lugar, evento.direccion, evento.modalidad,
        evento.plataforma_online, evento.capacidad_maxima, evento.aforo_actual,
        evento.organizador, evento.ponentes, evento.agenda, evento.estado_id,
        evento.presupuesto, evento.coste_real, evento.publico_objetivo,
        evento.requisitos, id
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
          e.razon_social as empresa
        FROM AsistenciaEvento ae
        JOIN Personas p ON ae.persona_id = p.id
        LEFT JOIN Empresa e ON ae.empresa_id = e.id
        WHERE ae.evento_id = $1
        ORDER BY ae.fecha_inscripcion DESC
      `, [id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching asistentes:', error);
      res.status(500).json({ error: 'Failed to fetch asistentes' });
    }
  }
}
