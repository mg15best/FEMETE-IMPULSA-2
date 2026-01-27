import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config';

// Import routes
import projectRoutes from './routes/projects';
import objectiveRoutes from './routes/objectives';
import activityRoutes from './routes/activities';
import beneficiaryRoutes from './routes/beneficiaries';
import resultRoutes from './routes/results';
import kpiRoutes from './routes/kpis';
import kpiStarsRoutes from './routes/kpi-stars';
import exportRoutes from './routes/export';

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
app.use('/api/projects', projectRoutes);
app.use('/api/objectives', objectiveRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/kpis', kpiRoutes);
app.use('/api/kpi-stars', kpiStarsRoutes);
app.use('/api/export', exportRoutes);

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
      projects: '/api/projects',
      objectives: '/api/objectives',
      activities: '/api/activities',
      beneficiaries: '/api/beneficiaries',
      results: '/api/results',
      kpis: '/api/kpis',
      kpiStars: '/api/kpi-stars',
      export: '/api/export',
      health: '/health'
    },
    kpi_endpoints: {
      dashboard: '/api/kpi-stars/dashboard',
      powerbi: '/api/kpi-stars/powerbi',
      historico: '/api/kpi-stars/historico',
      detalle: '/api/kpi-stars/detalle/:codigo',
      breakdown: '/api/kpi-stars/breakdown/:codigo'
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
  - Projects:      http://localhost:${PORT}/api/projects
  - Objectives:    http://localhost:${PORT}/api/objectives
  - Activities:    http://localhost:${PORT}/api/activities
  - Beneficiaries: http://localhost:${PORT}/api/beneficiaries
  - Results:       http://localhost:${PORT}/api/results
  - KPIs:          http://localhost:${PORT}/api/kpis
  - Export:        http://localhost:${PORT}/api/export
  `);
});

export default app;
