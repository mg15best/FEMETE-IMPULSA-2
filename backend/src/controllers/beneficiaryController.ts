import { Request, Response } from 'express';
import pool from '../config/database';
import { Beneficiary } from '../models/types';

export class BeneficiaryController {
  static async getAll(req: Request, res: Response) {
    try {
      const { project_id, status, type } = req.query;
      let query = 'SELECT * FROM beneficiaries WHERE 1=1';
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

      if (type) {
        query += ` AND type = $${paramCount}`;
        params.push(type);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch beneficiaries' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM beneficiaries WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Beneficiary not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch beneficiary' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const beneficiary: Beneficiary = req.body;
      const query = `
        INSERT INTO beneficiaries (project_id, name, type, contact_email, contact_phone, organization, beneficiary_since, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [
        beneficiary.project_id,
        beneficiary.name,
        beneficiary.type,
        beneficiary.contact_email,
        beneficiary.contact_phone,
        beneficiary.organization,
        beneficiary.beneficiary_since,
        beneficiary.status || 'active',
        beneficiary.notes
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create beneficiary' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const beneficiary: Partial<Beneficiary> = req.body;
      
      const query = `
        UPDATE beneficiaries 
        SET name = COALESCE($1, name),
            type = COALESCE($2, type),
            contact_email = COALESCE($3, contact_email),
            contact_phone = COALESCE($4, contact_phone),
            organization = COALESCE($5, organization),
            beneficiary_since = COALESCE($6, beneficiary_since),
            status = COALESCE($7, status),
            notes = COALESCE($8, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `;
      
      const values = [
        beneficiary.name,
        beneficiary.type,
        beneficiary.contact_email,
        beneficiary.contact_phone,
        beneficiary.organization,
        beneficiary.beneficiary_since,
        beneficiary.status,
        beneficiary.notes,
        id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Beneficiary not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update beneficiary' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM beneficiaries WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Beneficiary not found' });
      }

      res.json({ message: 'Beneficiary deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete beneficiary' });
    }
  }
}
