import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { config } from './config/config';

// Import routes
import kpiStarsRoutes from './routes/kpi-stars';
import exportRoutes from './routes/export';
import empresaRoutes from './routes/empresas';
import formacionRoutes from './routes/formaciones';
import eventoRoutes from './routes/eventos';
import sesionAsesoramientoRoutes from './routes/sesiones-asesoramiento';
import vistas360Routes from './routes/vistas360';

dotenv.config();

const app: Application = express();

// Enhanced CORS for Microsoft Power Platform
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests from Microsoft Power Platform and localhost
    const allowedOrigins = [
      /\.powerapps\.com$/,
      /\.powerbi\.com$/,
      /\.microsoft\.com$/,
      /\.office\.com$/,
      /\.dynamics\.com$/,
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:80'
    ];
    
    // In production, only allow Microsoft domains and configured origins
    if (config.nodeEnv === 'production') {
      const allowedProductionOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      const allAllowed = [...allowedOrigins, ...allowedProductionOrigins];
      
      if (!origin || allAllowed.some(pattern => 
        typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
      )) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: allow all
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-API-Key'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(cors(corsOptions));
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
app.use('/api/vistas360', vistas360Routes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FEMETE IMPULSA API Documentation'
}));

// OpenAPI JSON for Power Apps Custom Connector
app.get('/api/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
    documentation: {
      swagger: '/api-docs',
      openapi: '/api/openapi.json'
    },
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
    },
    microsoft_integration: {
      power_apps: 'Use /api/openapi.json for Custom Connector',
      power_bi: 'Use /api/kpi-stars/powerbi for data connection',
      cors: 'Configured for *.powerapps.com, *.powerbi.com, *.microsoft.com'
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
API Documentation: http://localhost:${PORT}/api-docs
OpenAPI Spec: http://localhost:${PORT}/api/openapi.json
Health Check: http://localhost:${PORT}/health

Microsoft Integration:
  - Power Apps: Use /api/openapi.json for Custom Connector
  - Power BI: Use /api/kpi-stars/powerbi for data
  - CORS: Configured for Microsoft domains

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
