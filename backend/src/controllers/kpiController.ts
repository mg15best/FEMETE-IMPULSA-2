import { Request, Response } from 'express';
import pool from '../config/database';
import { KPI } from '../models/types';

export class KPIController {
  static async getAll(req: Request, res: Response) {
    try {
      const { project_id, category } = req.query;
      let query = 'SELECT * FROM kpis WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (project_id) {
        query += ` AND project_id = $${paramCount}`;
        params.push(project_id);
        paramCount++;
      }

      if (category) {
        query += ` AND category = $${paramCount}`;
        params.push(category);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch KPIs' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM kpis WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'KPI not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch KPI' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const kpi: KPI = req.body;
      const query = `
        INSERT INTO kpis (project_id, name, description, category, target_value, current_value, unit, measurement_frequency, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [
        kpi.project_id,
        kpi.name,
        kpi.description,
        kpi.category,
        kpi.target_value,
        kpi.current_value || 0,
        kpi.unit,
        kpi.measurement_frequency,
        kpi.last_updated
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create KPI' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const kpi: Partial<KPI> = req.body;
      
      const query = `
        UPDATE kpis 
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            category = COALESCE($3, category),
            target_value = COALESCE($4, target_value),
            current_value = COALESCE($5, current_value),
            unit = COALESCE($6, unit),
            measurement_frequency = COALESCE($7, measurement_frequency),
            last_updated = COALESCE($8, last_updated),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `;
      
      const values = [
        kpi.name,
        kpi.description,
        kpi.category,
        kpi.target_value,
        kpi.current_value,
        kpi.unit,
        kpi.measurement_frequency,
        kpi.last_updated,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'KPI not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update KPI' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM kpis WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'KPI not found' });
      }

      res.json({ message: 'KPI deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete KPI' });
    }
  }

  // Get KPI dashboard data
  static async getDashboard(req: Request, res: Response) {
    try {
      const { project_id } = req.query;
      
      let query = `
        SELECT 
          k.*,
          CASE 
            WHEN k.target_value > 0 THEN (k.current_value / k.target_value) * 100
            ELSE 0
          END as progress_percentage
        FROM kpis k
        WHERE 1=1
      `;
      const params: any[] = [];

      if (project_id) {
        query += ` AND k.project_id = $1`;
        params.push(project_id);
      }

      query += ' ORDER BY k.category, k.name';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch KPI dashboard' });
    }
  }
}
