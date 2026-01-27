import { Request, Response } from 'express';
import pool from '../config/database';
import { Objective } from '../models/types';

export class ObjectiveController {
  static async getAll(req: Request, res: Response) {
    try {
      const { project_id, status } = req.query;
      let query = 'SELECT * FROM objectives WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (project_id) {
        query += ` AND project_id = $${paramCount}`;
        params.push(project_id);
        paramCount++;
      }

      if (status) {
        query += ` AND status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch objectives' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM objectives WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Objective not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch objective' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const objective: Objective = req.body;
      const query = `
        INSERT INTO objectives (project_id, title, description, target_value, current_value, unit, deadline, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        objective.project_id,
        objective.title,
        objective.description,
        objective.target_value,
        objective.current_value || 0,
        objective.unit,
        objective.deadline,
        objective.status || 'pending'
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create objective' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const objective: Partial<Objective> = req.body;
      
      const query = `
        UPDATE objectives 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            target_value = COALESCE($3, target_value),
            current_value = COALESCE($4, current_value),
            unit = COALESCE($5, unit),
            deadline = COALESCE($6, deadline),
            status = COALESCE($7, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      
      const values = [
        objective.title,
        objective.description,
        objective.target_value,
        objective.current_value,
        objective.unit,
        objective.deadline,
        objective.status,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Objective not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update objective' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM objectives WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Objective not found' });
      }

      res.json({ message: 'Objective deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete objective' });
    }
  }
}
