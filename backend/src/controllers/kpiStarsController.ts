import { Request, Response } from 'express';
import pool from '../config/database';

export class KPIStarsController {
  // Get all STARS 2025 KPIs with real-time values
  static async getKPIDashboard(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT * FROM VistaKPIActuales
        ORDER BY orden_visualizacion
      `);
      
      res.json({
        programa: 'STARS 2025',
        fecha_actualizacion: new Date(),
        kpis: result.rows,
        resumen: {
          total_kpis: result.rows.length,
          kpis_cumplidos: result.rows.filter((k: any) => k.estado === 'Cumplido').length,
          kpis_en_progreso: result.rows.filter((k: any) => k.estado === 'En Progreso').length,
          kpis_pendientes: result.rows.filter((k: any) => k.estado === 'Pendiente').length,
          porcentaje_cumplimiento_global: result.rows.reduce((acc: number, k: any) => 
            acc + parseFloat(k.porcentaje_cumplimiento || 0), 0) / result.rows.length
        }
      });
    } catch (error) {
      console.error('Error fetching KPI dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch KPI dashboard' });
    }
  }

  // Get KPI historical data for trends
  static async getKPIHistorico(req: Request, res: Response) {
    try {
      const { kpi_id, fecha_inicio, fecha_fin } = req.query;
      
      let query = `
        SELECT 
          h.*,
          k.codigo,
          k.nombre,
          k.valor_objetivo,
          k.unidad
        FROM KPIHistorico h
        JOIN KPIConfiguracion k ON h.kpi_configuracion_id = k.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (kpi_id) {
        query += ` AND h.kpi_configuracion_id = $${paramCount}`;
        params.push(kpi_id);
        paramCount++;
      }

      if (fecha_inicio) {
        query += ` AND h.fecha_registro >= $${paramCount}`;
        params.push(fecha_inicio);
        paramCount++;
      }

      if (fecha_fin) {
        query += ` AND h.fecha_registro <= $${paramCount}`;
        params.push(fecha_fin);
        paramCount++;
      }

      query += ' ORDER BY h.fecha_registro DESC, k.orden_visualizacion';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching KPI historical data:', error);
      res.status(500).json({ error: 'Failed to fetch KPI historical data' });
    }
  }

  // Get individual KPI detail
  static async getKPIDetalle(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM VistaKPIActuales
        WHERE codigo = $1
      `, [codigo]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'KPI not found' });
      }

      // Get historical trend for this KPI
      const historico = await pool.query(`
        SELECT 
          h.valor,
          h.porcentaje_cumplimiento,
          h.fecha_registro
        FROM KPIHistorico h
        JOIN KPIConfiguracion k ON h.kpi_configuracion_id = k.id
        WHERE k.codigo = $1
        ORDER BY h.fecha_registro DESC
        LIMIT 30
      `, [codigo]);

      res.json({
        kpi: result.rows[0],
        tendencia: historico.rows
      });
    } catch (error) {
      console.error('Error fetching KPI detail:', error);
      res.status(500).json({ error: 'Failed to fetch KPI detail' });
    }
  }

  // Record daily KPI snapshot
  static async registrarSnapshot(req: Request, res: Response) {
    try {
      await pool.query('SELECT registrar_snapshot_kpis()');
      res.json({ 
        message: 'KPI snapshot registered successfully',
        fecha: new Date()
      });
    } catch (error) {
      console.error('Error registering KPI snapshot:', error);
      res.status(500).json({ error: 'Failed to register KPI snapshot' });
    }
  }

  // Get Power BI integration data
  static async getPowerBIData(req: Request, res: Response) {
    try {
      // Get current KPIs
      const kpis = await pool.query('SELECT * FROM obtener_resumen_kpis()');
      
      // Get summary statistics
      const empresas = await pool.query('SELECT COUNT(*) as total FROM Empresa WHERE activo = true');
      const formaciones = await pool.query('SELECT COUNT(*) as total FROM Formacion');
      const eventos = await pool.query('SELECT COUNT(*) as total FROM Evento');
      const asesoramientos = await pool.query('SELECT COUNT(*) as total FROM SesionAsesoramiento');
      
      // Get recent activity
      const actividadReciente = await pool.query(`
        SELECT 
          'formacion' as tipo,
          titulo as nombre,
          fecha_inicio as fecha
        FROM Formacion
        WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
        UNION ALL
        SELECT 
          'evento' as tipo,
          titulo as nombre,
          fecha_inicio::date as fecha
        FROM Evento
        WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
        UNION ALL
        SELECT 
          'asesoramiento' as tipo,
          codigo as nombre,
          fecha_sesion::date as fecha
        FROM SesionAsesoramiento
        WHERE fecha_sesion >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY fecha DESC
        LIMIT 20
      `);

      res.json({
        metadata: {
          programa: 'FEMETE IMPULSA - STARS 2025',
          fecha_generacion: new Date(),
          version: '1.0'
        },
        kpis: kpis.rows,
        estadisticas_globales: {
          total_empresas: parseInt(empresas.rows[0].total),
          total_formaciones: parseInt(formaciones.rows[0].total),
          total_eventos: parseInt(eventos.rows[0].total),
          total_asesoramientos: parseInt(asesoramientos.rows[0].total)
        },
        actividad_reciente: actividadReciente.rows
      });
    } catch (error) {
      console.error('Error fetching Power BI data:', error);
      res.status(500).json({ error: 'Failed to fetch Power BI data' });
    }
  }

  // Get detailed breakdown for a specific KPI
  static async getKPIBreakdown(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      let data: any = {};

      switch(codigo) {
        case 'KPI-MAT-001': // Material de apoyo
          const materiales = await pool.query(`
            SELECT titulo, categoria, formato, fecha_publicacion, descargas
            FROM Material
            WHERE categoria = 'Apoyo' OR categoria LIKE '%apoyo%'
            ORDER BY fecha_publicacion DESC
          `);
          data = { items: materiales.rows };
          break;

        case 'KPI-ENT-001': // Entidades contactadas
          const entidades = await pool.query(`
            SELECT nombre, tipo, fecha_colaboracion, activo
            FROM EntidadColaboradora
            WHERE activo = true
            ORDER BY fecha_colaboracion DESC
          `);
          data = { items: entidades.rows };
          break;

        case 'KPI-EMP-001': // Empresas asesoradas
          const empresas = await pool.query(`
            SELECT DISTINCT 
              e.razon_social,
              e.sector,
              COUNT(sa.id) as num_sesiones,
              MAX(sa.fecha_sesion) as ultima_sesion
            FROM SesionAsesoramiento sa
            JOIN Empresa e ON sa.empresa_id = e.id
            GROUP BY e.id, e.razon_social, e.sector
            ORDER BY ultima_sesion DESC
          `);
          data = { items: empresas.rows };
          break;

        case 'KPI-INF-001': // Informes individualizados
          const informes = await pool.query(`
            SELECT i.titulo, i.fecha_generacion, ct.nombre as tipo
            FROM Informe i
            JOIN CatalogoTipo ct ON i.tipo_id = ct.id
            WHERE ct.nombre LIKE '%Individualizado%' OR ct.nombre LIKE '%Empresa Emergente%'
            ORDER BY i.fecha_generacion DESC
          `);
          data = { items: informes.rows };
          break;

        case 'KPI-FOR-001': // Píldoras formativas
          const pildoras = await pool.query(`
            SELECT f.titulo, f.fecha_inicio, f.duracion_horas, ct.nombre as tipo,
                   COUNT(af.id) as num_asistentes
            FROM Formacion f
            JOIN CatalogoTipo ct ON f.tipo_id = ct.id
            LEFT JOIN AsistenciaFormacion af ON f.id = af.formacion_id
            WHERE ct.nombre LIKE '%Píldora%' OR f.titulo LIKE '%Píldora%'
            GROUP BY f.id, f.titulo, f.fecha_inicio, f.duracion_horas, ct.nombre
            ORDER BY f.fecha_inicio DESC
          `);
          data = { items: pildoras.rows };
          break;

        case 'KPI-EVE-001': // Eventos
          const eventos = await pool.query(`
            SELECT e.titulo, e.fecha_inicio, e.modalidad, ce.nombre as estado,
                   e.aforo_actual, e.capacidad_maxima
            FROM Evento e
            JOIN CatalogoEstado ce ON e.estado_id = ce.id
            WHERE ce.nombre IN ('Completado', 'Activo')
            ORDER BY e.fecha_inicio DESC
          `);
          data = { items: eventos.rows };
          break;

        case 'KPI-DIF-001': // Impactos de difusión
          const impactos = await pool.query(`
            SELECT titulo, fecha_publicacion, alcance, impresiones, 
                   interacciones, cc.nombre as canal
            FROM DifusionImpacto di
            LEFT JOIN CatalogoCanal cc ON di.canal_id = cc.id
            ORDER BY fecha_publicacion DESC
          `);
          data = { items: impactos.rows };
          break;

        default:
          return res.status(404).json({ error: 'KPI code not found' });
      }

      res.json({
        codigo,
        ...data
      });
    } catch (error) {
      console.error('Error fetching KPI breakdown:', error);
      res.status(500).json({ error: 'Failed to fetch KPI breakdown' });
    }
  }
}
