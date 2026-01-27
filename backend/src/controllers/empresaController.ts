import { Request, Response } from 'express';
import pool from '../config/database';
import { Empresa } from '../models/types';

export class EmpresaController {
  static async getAll(req: Request, res: Response) {
    try {
      const { estado_id, sector, activo } = req.query;
      let query = `
        SELECT e.*, ce.nombre as estado_nombre
        FROM Empresa e
        LEFT JOIN CatalogoEstado ce ON e.estado_id = ce.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (estado_id) {
        query += ` AND e.estado_id = $${paramCount}`;
        params.push(estado_id);
        paramCount++;
      }

      if (sector) {
        query += ` AND e.sector LIKE $${paramCount}`;
        params.push(`%${sector}%`);
        paramCount++;
      }

      if (activo !== undefined) {
        query += ` AND e.activo = $${paramCount}`;
        params.push(activo === 'true');
        paramCount++;
      }

      query += ' ORDER BY e.created_at DESC';

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
      const result = await pool.query(`
        SELECT e.*, ce.nombre as estado_nombre
        FROM Empresa e
        LEFT JOIN CatalogoEstado ce ON e.estado_id = ce.id
        WHERE e.id = $1
      `, [id]);
      
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
          razon_social, nombre_comercial, cif, sector, tamano, numero_empleados,
          facturacion_anual, direccion, provincia, municipio, codigo_postal,
          telefono, email, web, descripcion, estado_id, fecha_alta, activo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;
      const values = [
        empresa.razon_social,
        empresa.nombre_comercial,
        empresa.cif,
        empresa.sector,
        empresa.tamano,
        empresa.numero_empleados,
        empresa.facturacion_anual,
        empresa.direccion,
        empresa.provincia,
        empresa.municipio,
        empresa.codigo_postal,
        empresa.telefono,
        empresa.email,
        empresa.web,
        empresa.descripcion,
        empresa.estado_id,
        empresa.fecha_alta || new Date(),
        empresa.activo !== undefined ? empresa.activo : true
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
        SET razon_social = COALESCE($1, razon_social),
            nombre_comercial = COALESCE($2, nombre_comercial),
            cif = COALESCE($3, cif),
            sector = COALESCE($4, sector),
            tamano = COALESCE($5, tamano),
            numero_empleados = COALESCE($6, numero_empleados),
            facturacion_anual = COALESCE($7, facturacion_anual),
            direccion = COALESCE($8, direccion),
            provincia = COALESCE($9, provincia),
            municipio = COALESCE($10, municipio),
            codigo_postal = COALESCE($11, codigo_postal),
            telefono = COALESCE($12, telefono),
            email = COALESCE($13, email),
            web = COALESCE($14, web),
            descripcion = COALESCE($15, descripcion),
            estado_id = COALESCE($16, estado_id),
            activo = COALESCE($17, activo),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $18
        RETURNING *
      `;
      
      const values = [
        empresa.razon_social, empresa.nombre_comercial, empresa.cif, empresa.sector,
        empresa.tamano, empresa.numero_empleados, empresa.facturacion_anual,
        empresa.direccion, empresa.provincia, empresa.municipio, empresa.codigo_postal,
        empresa.telefono, empresa.email, empresa.web, empresa.descripcion,
        empresa.estado_id, empresa.activo, id
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

  // Get companies with advisory sessions count
  static async getWithAsesoramiento(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT 
          e.*,
          COUNT(sa.id) as total_sesiones,
          MAX(sa.fecha_sesion) as ultima_sesion
        FROM Empresa e
        LEFT JOIN SesionAsesoramiento sa ON e.id = sa.empresa_id
        WHERE e.activo = true
        GROUP BY e.id
        ORDER BY total_sesiones DESC, e.razon_social
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching empresas with asesoramiento:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
}
