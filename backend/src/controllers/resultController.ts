import { Request, Response } from 'express';
import pool from '../config/database';
import { Result } from '../models/types';

export class ResultController {
  static async getAll(req: Request, res: Response) {
    try {
      const { project_id, result_type, start_date, end_date } = req.query;
      let query = 'SELECT * FROM results WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (project_id) {
        query += ` AND project_id = $${paramCount}`;
        params.push(project_id);
        paramCount++;
      }

      if (result_type) {
        query += ` AND result_type = $${paramCount}`;
        params.push(result_type);
        paramCount++;
      }

      if (start_date) {
        query += ` AND achievement_date >= $${paramCount}`;
        params.push(start_date);
        paramCount++;
      }

      if (end_date) {
        query += ` AND achievement_date <= $${paramCount}`;
        params.push(end_date);
        paramCount++;
      }

      query += ' ORDER BY achievement_date DESC';
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM results WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Result not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch result' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const resultData: Result = req.body;
      const query = `
        INSERT INTO results (project_id, activity_id, title, description, result_type, metric_name, metric_value, metric_unit, achievement_date, verification_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const values = [
        resultData.project_id,
        resultData.activity_id,
        resultData.title,
        resultData.description,
        resultData.result_type,
        resultData.metric_name,
        resultData.metric_value,
        resultData.metric_unit,
        resultData.achievement_date,
        resultData.verification_method
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create result' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultData: Partial<Result> = req.body;
      
      const query = `
        UPDATE results 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            result_type = COALESCE($3, result_type),
            metric_name = COALESCE($4, metric_name),
            metric_value = COALESCE($5, metric_value),
            metric_unit = COALESCE($6, metric_unit),
            achievement_date = COALESCE($7, achievement_date),
            verification_method = COALESCE($8, verification_method),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `;
      
      const values = [
        resultData.title,
        resultData.description,
        resultData.result_type,
        resultData.metric_name,
        resultData.metric_value,
        resultData.metric_unit,
        resultData.achievement_date,
        resultData.verification_method,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Result not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update result' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM results WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Result not found' });
      }

      res.json({ message: 'Result deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete result' });
    }
  }
}
