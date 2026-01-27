import { Request, Response } from 'express';
import pool from '../config/database';
import { Empresa } from '../models/types';

/**
 * Controller for Empresa (Company) management
 */
export class EmpresaController {
  static async getAll(req: Request, res: Response) {
    try {
      const { limit = 50, offset = 0, sector, municipio } = req.query;
      
      let query = 'SELECT * FROM Empresa WHERE 1=1';
      const params: any[] = [];
      
      if (sector) {
        params.push(sector);
        query += ` AND sector = $${params.length}`;
      }
      
      if (municipio) {
        params.push(municipio);
        query += ` AND municipio = $${params.length}`;
      }
      
      query += ` ORDER BY nombre_empresa ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching empresas:', error);
      res.status(500).json({ error: 'Failed to fetch empresas' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM Empresa WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Empresa not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching empresa:', error);
      res.status(500).json({ error: 'Failed to fetch empresa' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const empresa: Empresa = req.body;
      
      const query = `
        INSERT INTO Empresa (
          nombre_empresa, cif_identificador, sector, direccion, provincia, municipio, 
          codigo_postal, comunidad_autonoma, telefono, email, observaciones
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const values = [
        empresa.nombre_empresa,
        empresa.cif_identificador,
        empresa.sector,
        empresa.direccion,
        empresa.provincia,
        empresa.municipio,
        empresa.codigo_postal,
        empresa.comunidad_autonoma,
        empresa.telefono,
        empresa.email,
        empresa.observaciones
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating empresa:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'CIF already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create empresa' });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const empresa: Partial<Empresa> = req.body;
      
      const query = `
        UPDATE Empresa
        SET
            nombre_empresa = COALESCE($1, nombre_empresa),
            cif_identificador = COALESCE($2, cif_identificador),
            sector = COALESCE($3, sector),
            direccion = COALESCE($4, direccion),
            provincia = COALESCE($5, provincia),
            municipio = COALESCE($6, municipio),
            codigo_postal = COALESCE($7, codigo_postal),
            comunidad_autonoma = COALESCE($8, comunidad_autonoma),
            telefono = COALESCE($9, telefono),
            email = COALESCE($10, email),
            observaciones = COALESCE($11, observaciones),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `;
      
      const values = [
        empresa.nombre_empresa, empresa.cif_identificador, empresa.sector,
        empresa.direccion, empresa.provincia, empresa.municipio, empresa.codigo_postal,
        empresa.comunidad_autonoma, empresa.telefono, empresa.email, empresa.observaciones, id
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Empresa not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating empresa:', error);
      res.status(500).json({ error: 'Failed to update empresa' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM Empresa WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Empresa not found' });
      }
      
      res.json({ message: 'Empresa deleted successfully', empresa: result.rows[0] });
    } catch (error) {
      console.error('Error deleting empresa:', error);
      res.status(500).json({ error: 'Failed to delete empresa' });
    }
  }

  static async getWithStats(req: Request, res: Response) {
    try {
      const query = `
        SELECT 
          e.*,
          (SELECT COUNT(*) FROM ContactoEmpresa ce WHERE ce.empresa_id = e.id) as contactos_count,
          (SELECT COUNT(*) FROM SesionAsesoramiento sa WHERE sa.empresa_id = e.id) as sesiones_count,
          (SELECT COUNT(*) FROM PlanAccion pa WHERE pa.empresa_id = e.id) as planes_count
        FROM Empresa e
        ORDER BY e.nombre_empresa
      `;
      
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching empresas with stats:', error);
      res.status(500).json({ error: 'Failed to fetch empresas with stats' });
    }
  }
}

export default EmpresaController;
