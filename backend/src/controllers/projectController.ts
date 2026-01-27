import { Request, Response } from 'express';
import pool from '../config/database';
import { Project } from '../models/types';

export class ProjectController {
  // Get all projects
  static async getAll(req: Request, res: Response) {
    try {
      const { status, start_date, end_date } = req.query;
      let query = 'SELECT * FROM projects WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

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

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // Get single project
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }

  // Create project
  static async create(req: Request, res: Response) {
    try {
      const project: Project = req.body;
      const query = `
        INSERT INTO projects (project_code, name, description, start_date, end_date, status, budget, program)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        project.project_code,
        project.name,
        project.description,
        project.start_date,
        project.end_date,
        project.status || 'active',
        project.budget,
        project.program || 'STARS 2025'
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating project:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'Project code already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create project' });
      }
    }
  }

  // Update project
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project: Partial<Project> = req.body;
      
      const query = `
        UPDATE projects 
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            start_date = COALESCE($3, start_date),
            end_date = COALESCE($4, end_date),
            status = COALESCE($5, status),
            budget = COALESCE($6, budget),
            program = COALESCE($7, program),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      
      const values = [
        project.name,
        project.description,
        project.start_date,
        project.end_date,
        project.status,
        project.budget,
        project.program,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  // Delete project
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ message: 'Project deleted successfully', project: result.rows[0] });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}
