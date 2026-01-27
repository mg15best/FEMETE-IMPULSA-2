import { Request, Response } from 'express';
import pool from '../config/database';
import { Formacion } from '../models/types';

export class FormacionController {
  static async getAll(req: Request, res: Response) {
    try {
      const { tipo_id, estado_id, modalidad } = req.query;
      let query = `
        SELECT f.*, 
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre,
               COUNT(DISTINCT af.id) as total_inscritos
        FROM Formacion f
        LEFT JOIN CatalogoTipo ct ON f.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON f.estado_id = ce.id
        LEFT JOIN AsistenciaFormacion af ON f.id = af.formacion_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (tipo_id) {
        query += ` AND f.tipo_id = $${paramCount}`;
        params.push(tipo_id);
        paramCount++;
      }

      if (estado_id) {
        query += ` AND f.estado_id = $${paramCount}`;
        params.push(estado_id);
        paramCount++;
      }

      if (modalidad) {
        query += ` AND f.modalidad = $${paramCount}`;
        params.push(modalidad);
        paramCount++;
      }

      query += ' GROUP BY f.id, ct.nombre, ce.nombre ORDER BY f.fecha_inicio DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching formaciones:', error);
      res.status(500).json({ error: 'Failed to fetch formaciones' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT f.*, 
               ct.nombre as tipo_nombre,
               ce.nombre as estado_nombre
        FROM Formacion f
        LEFT JOIN CatalogoTipo ct ON f.tipo_id = ct.id
        LEFT JOIN CatalogoEstado ce ON f.estado_id = ce.id
        WHERE f.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Formación not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching formación:', error);
      res.status(500).json({ error: 'Failed to fetch formación' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const formacion: Formacion = req.body;
      const query = `
        INSERT INTO Formacion (
          codigo, titulo, descripcion, tipo_id, modalidad, duracion_horas,
          fecha_inicio, fecha_fin, horario, lugar, plataforma_online,
          capacidad_maxima, formador, contenido, objetivos, estado_id,
          presupuesto, coste_real
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;
      const values = [
        formacion.codigo,
        formacion.titulo,
        formacion.descripcion,
        formacion.tipo_id,
        formacion.modalidad,
        formacion.duracion_horas,
        formacion.fecha_inicio,
        formacion.fecha_fin,
        formacion.horario,
        formacion.lugar,
        formacion.plataforma_online,
        formacion.capacidad_maxima,
        formacion.formador,
        formacion.contenido,
        formacion.objetivos,
        formacion.estado_id,
        formacion.presupuesto,
        formacion.coste_real
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating formación:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'Código already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create formación' });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const formacion: Partial<Formacion> = req.body;
      
      const query = `
        UPDATE Formacion 
        SET titulo = COALESCE($1, titulo),
            descripcion = COALESCE($2, descripcion),
            tipo_id = COALESCE($3, tipo_id),
            modalidad = COALESCE($4, modalidad),
            duracion_horas = COALESCE($5, duracion_horas),
            fecha_inicio = COALESCE($6, fecha_inicio),
            fecha_fin = COALESCE($7, fecha_fin),
            horario = COALESCE($8, horario),
            lugar = COALESCE($9, lugar),
            plataforma_online = COALESCE($10, plataforma_online),
            capacidad_maxima = COALESCE($11, capacidad_maxima),
            formador = COALESCE($12, formador),
            contenido = COALESCE($13, contenido),
            objetivos = COALESCE($14, objetivos),
            estado_id = COALESCE($15, estado_id),
            presupuesto = COALESCE($16, presupuesto),
            coste_real = COALESCE($17, coste_real),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $18
        RETURNING *
      `;
      
      const values = [
        formacion.titulo, formacion.descripcion, formacion.tipo_id, formacion.modalidad,
        formacion.duracion_horas, formacion.fecha_inicio, formacion.fecha_fin, formacion.horario,
        formacion.lugar, formacion.plataforma_online, formacion.capacidad_maxima, formacion.formador,
        formacion.contenido, formacion.objetivos, formacion.estado_id, formacion.presupuesto,
        formacion.coste_real, id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Formación not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating formación:', error);
      res.status(500).json({ error: 'Failed to update formación' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM Formacion WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Formación not found' });
      }

      res.json({ message: 'Formación deleted successfully' });
    } catch (error) {
      console.error('Error deleting formación:', error);
      res.status(500).json({ error: 'Failed to delete formación' });
    }
  }

  // Get attendees for a training
  static async getAsistentes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT 
          af.*,
          p.nombre,
          p.apellidos,
          p.email,
          e.razon_social as empresa
        FROM AsistenciaFormacion af
        JOIN Personas p ON af.persona_id = p.id
        LEFT JOIN Empresa e ON af.empresa_id = e.id
        WHERE af.formacion_id = $1
        ORDER BY af.fecha_inscripcion DESC
      `, [id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching asistentes:', error);
      res.status(500).json({ error: 'Failed to fetch asistentes' });
    }
  }
}
