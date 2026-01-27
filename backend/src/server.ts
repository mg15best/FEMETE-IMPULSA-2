import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config';

// Import routes
import kpiStarsRoutes from './routes/kpi-stars';
import exportRoutes from './routes/export';
import empresaRoutes from './routes/empresas';
import formacionRoutes from './routes/formaciones';
import eventoRoutes from './routes/eventos';
import sesionAsesoramientoRoutes from './routes/sesiones-asesoramiento';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/kpi-stars', kpiStarsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/formaciones', formacionRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/sesiones-asesoramiento', sesionAsesoramientoRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API documentation endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'FEMETE IMPULSA API',
    version: '1.0.0',
    description: 'Project Management and Monitoring API for STARS 2025 Innovation Program',
    endpoints: {
      // STARS 2025 Main Endpoints
      kpiStars: '/api/kpi-stars',
      empresas: '/api/empresas',
      formaciones: '/api/formaciones',
      eventos: '/api/eventos',
      sesionesAsesoramiento: '/api/sesiones-asesoramiento',
      export: '/api/export',
      health: '/health'
    },
    kpi_endpoints: {
      dashboard: '/api/kpi-stars/dashboard',
      powerbi: '/api/kpi-stars/powerbi',
      historico: '/api/kpi-stars/historico',
      detalle: '/api/kpi-stars/detalle/:codigo',
      breakdown: '/api/kpi-stars/breakdown/:codigo',
      snapshot: '/api/kpi-stars/snapshot (POST)'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     FEMETE IMPULSA - Project Management API      ║
║              STARS 2025 Program                   ║
╚═══════════════════════════════════════════════════╝

Server running on port ${PORT}
Environment: ${config.nodeEnv}
API Documentation: http://localhost:${PORT}/api
Health Check: http://localhost:${PORT}/health

Available endpoints:
  - Empresas:      http://localhost:${PORT}/api/empresas
  - Formaciones:   http://localhost:${PORT}/api/formaciones
  - Eventos:       http://localhost:${PORT}/api/eventos
  - Asesoramiento: http://localhost:${PORT}/api/sesiones-asesoramiento
  - KPI STARS:     http://localhost:${PORT}/api/kpi-stars
  - Power BI:      http://localhost:${PORT}/api/kpi-stars/powerbi
  - Export:        http://localhost:${PORT}/api/export
  `);
});

export default app;
