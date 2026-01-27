import { Request, Response } from 'express';
import pool from '../config/database';

export class ExportController {
  // Export projects data
  static async exportData(req: Request, res: Response) {
    try {
      const { entity, format, start_date, end_date, project_id } = req.query;
      
      let query = '';
      const params: any[] = [];
      let paramCount = 1;

      // Build query based on entity type
      switch (entity) {
        case 'projects':
          query = 'SELECT * FROM projects WHERE 1=1';
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
          break;

        case 'objectives':
          query = 'SELECT * FROM objectives WHERE 1=1';
          if (project_id) {
            query += ` AND project_id = $${paramCount}`;
            params.push(project_id);
            paramCount++;
          }
          break;

        case 'activities':
          query = 'SELECT * FROM activities WHERE 1=1';
          if (project_id) {
            query += ` AND project_id = $${paramCount}`;
            params.push(project_id);
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
          break;

        case 'beneficiaries':
          query = 'SELECT * FROM beneficiaries WHERE 1=1';
          if (project_id) {
            query += ` AND project_id = $${paramCount}`;
            params.push(project_id);
            paramCount++;
          }
          break;

        case 'results':
          query = 'SELECT * FROM results WHERE 1=1';
          if (project_id) {
            query += ` AND project_id = $${paramCount}`;
            params.push(project_id);
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
          break;

        case 'kpis':
          query = 'SELECT * FROM kpis WHERE 1=1';
          if (project_id) {
            query += ` AND project_id = $${paramCount}`;
            params.push(project_id);
            paramCount++;
          }
          break;

        default:
          return res.status(400).json({ error: 'Invalid entity type' });
      }

      const result = await pool.query(query, params);
      const data = result.rows;

      // Format response based on requested format
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${entity}_export.csv`);
        res.send(convertToCSV(data));
      } else if (format === 'excel') {
        // For Excel, we'll return JSON with metadata to be processed by frontend
        res.json({
          data,
          metadata: {
            entity,
            export_date: new Date(),
            total_records: data.length
          }
        });
      } else {
        // Default to JSON
        res.json(data);
      }

      // Log the export (optional - only if user authentication is implemented)
      // Comment out until authentication is added
      /* 
      if (req.user && (req.user as any).id) {
        await pool.query(
          'INSERT INTO LogExportacion (usuario, entidad, formato, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4, $5)',
          [(req.user as any).id, entity, format, start_date || null, end_date || null]
        );
      }
      */
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export data' });
    }
  }

  // Export comprehensive report
  static async exportComprehensiveReport(req: Request, res: Response) {
    try {
      const { project_id, start_date, end_date } = req.query;
      
      // Fetch all related data
      const projectQuery = project_id 
        ? 'SELECT * FROM Empresa WHERE id = $1'
        : 'SELECT * FROM Empresa';
      const projectParams = project_id ? [project_id] : [];
      
      const projects = await pool.query(projectQuery, projectParams);
      const projectIds = projects.rows.map((p: any) => p.id);
      
      // Fetch related data
      const formaciones = await pool.query('SELECT * FROM Formacion');
      const eventos = await pool.query('SELECT * FROM Evento');
      const sesiones = await pool.query('SELECT * FROM SesionAsesoramiento WHERE empresa_id = ANY($1)', [projectIds]);

      const comprehensiveReport = {
        generated_at: new Date(),
        period: {
          start_date: start_date || 'N/A',
          end_date: end_date || 'N/A'
        },
        empresas: projects.rows,
        formaciones: formaciones.rows,
        eventos: eventos.rows,
        sesiones_asesoramiento: sesiones.rows,
        summary: {
          total_empresas: projects.rows.length,
          total_formaciones: formaciones.rows.length,
          total_eventos: eventos.rows.length,
          total_sesiones: sesiones.rows.length
        }
      };

      res.json(comprehensiveReport);
    } catch (error) {
      console.error('Export comprehensive report error:', error);
      res.status(500).json({ error: 'Failed to generate comprehensive report' });
    }
  }
}

// Helper function to convert JSON to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}
