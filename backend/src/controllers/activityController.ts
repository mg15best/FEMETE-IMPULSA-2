import { Request, Response } from 'express';
import pool from '../config/database';
import { Activity } from '../models/types';

export class ActivityController {
  static async getAll(req: Request, res: Response) {
    try {
      const { project_id, status, start_date, end_date } = req.query;
      let query = 'SELECT * FROM activities WHERE 1=1';
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

      if (start_date) {
        query += ` AND start_date >= $${paramCount}`;
        params.push(start_date);
        paramCount++;
      }

      if (end_date) {
        query += ` AND end_date <= $${paramCount}`;
        params.push(end_date);
        paramCount++;
      }

      query += ' ORDER BY start_date DESC';
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const activity: Activity = req.body;
      const query = `
        INSERT INTO activities (project_id, objective_id, title, description, activity_type, start_date, end_date, status, responsible, budget, actual_cost)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const values = [
        activity.project_id,
        activity.objective_id,
        activity.title,
        activity.description,
        activity.activity_type,
        activity.start_date,
        activity.end_date,
        activity.status || 'planned',
        activity.responsible,
        activity.budget,
        activity.actual_cost || 0
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activity' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity: Partial<Activity> = req.body;
      
      const query = `
        UPDATE activities 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            activity_type = COALESCE($3, activity_type),
            start_date = COALESCE($4, start_date),
            end_date = COALESCE($5, end_date),
            status = COALESCE($6, status),
            responsible = COALESCE($7, responsible),
            budget = COALESCE($8, budget),
            actual_cost = COALESCE($9, actual_cost),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      
      const values = [
        activity.title,
        activity.description,
        activity.activity_type,
        activity.start_date,
        activity.end_date,
        activity.status,
        activity.responsible,
        activity.budget,
        activity.actual_cost,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update activity' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete activity' });
    }
  }
}
