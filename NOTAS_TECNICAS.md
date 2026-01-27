# Notas Técnicas y Mejoras Futuras

## 📋 Consideraciones Técnicas

### Rate Limiting

**Implementación Actual**:
- Usa Map en memoria para seguimiento de peticiones
- Funciona perfectamente para instalaciones de una sola instancia
- Límite: 20 requests/minuto en exports
- Límite: 100 requests/minuto por defecto

**Limitación**:
- En despliegues multi-instancia (load balanced), cada instancia mantiene su propio contador
- No persiste entre reinicios del servidor

**Para Producción Escalable**:
```bash
# Opción 1: Usar Redis para rate limiting compartido
npm install redis express-rate-limit rate-limit-redis

# Opción 2: Usar middleware dedicado
npm install express-rate-limit
```

**Implementación Redis (Futuro)**:
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

const limiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rl:'
  }),
  windowMs: 60000,
  max: 100
});

app.use('/api/', limiter);
```

**Mitigación Actual**:
1. Para instalaciones de una sola instancia: ✅ Funciona perfectamente
2. Implementa cleanup automático (no crece indefinidamente):
```typescript
// Añadir en auth.ts
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000); // Limpiar cada 5 minutos
```

### CORS Callback Type

**Implementación Actual**:
```typescript
origin: function (origin: string | undefined, callback: Function)
```

**Mejora Recomendada**:
```typescript
type CorsCallback = (err: Error | null, allow?: boolean) => void;

origin: function (origin: string | undefined, callback: CorsCallback)
```

**Impacto**: 
- Mejora la seguridad de tipos en TypeScript
- No afecta funcionalidad actual
- Puede implementarse en futuras versiones

## 🔄 Mejoras Futuras Recomendadas

### 1. Autenticación OAuth2/JWT

**Actual**: API Keys simples  
**Futuro**: OAuth2 con Azure AD

```typescript
import { Strategy as BearerStrategy } from 'passport-azure-ad';

passport.use(new BearerStrategy({
  identityMetadata: `https://login.microsoftonline.com/${tenantId}/.well-known/openid-configuration`,
  clientID: process.env.CLIENT_ID
}, (token, done) => {
  return done(null, token);
}));
```

**Beneficios**:
- Token-based authentication
- Integración nativa con Azure AD
- Refresh tokens
- Mejor control de permisos

### 2. Cache con Redis

**Actual**: Consultas directas a PostgreSQL  
**Futuro**: Cache de KPIs en Redis

```typescript
import { createClient } from 'redis';

const redis = createClient();

async function getKPIs() {
  const cached = await redis.get('kpis:current');
  if (cached) return JSON.parse(cached);
  
  const kpis = await pool.query('SELECT * FROM VistaKPIActuales');
  await redis.setEx('kpis:current', 300, JSON.stringify(kpis.rows));
  return kpis.rows;
}
```

**Beneficios**:
- Respuestas más rápidas
- Menor carga en PostgreSQL
- Escalabilidad mejorada

### 3. WebSockets para Actualizaciones en Tiempo Real

**Actual**: Polling manual para actualizar datos  
**Futuro**: WebSocket para push de cambios

```typescript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: allowedOrigins }
});

io.on('connection', (socket) => {
  socket.on('subscribe:kpis', () => {
    socket.join('kpis');
  });
});

// Al actualizar KPI
function notifyKPIUpdate(kpi) {
  io.to('kpis').emit('kpi:updated', kpi);
}
```

**Beneficios**:
- Actualizaciones instantáneas
- Menos peticiones al servidor
- Mejor experiencia de usuario

### 4. Búsqueda Full-Text

**Actual**: Búsqueda básica con SQL LIKE  
**Futuro**: ElasticSearch o PostgreSQL Full-Text

```sql
-- PostgreSQL Full-Text Search
ALTER TABLE Empresa ADD COLUMN search_vector tsvector;

CREATE INDEX empresa_search_idx ON Empresa USING GIN(search_vector);

UPDATE Empresa SET search_vector = 
  to_tsvector('spanish', coalesce(razon_social,'') || ' ' || coalesce(descripcion,''));
```

**Beneficios**:
- Búsquedas más rápidas
- Búsqueda difusa (typo-tolerant)
- Ranking de relevancia

### 5. Notificaciones Push

**Actual**: Solo notificaciones por email  
**Futuro**: Push notifications para móvil

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function sendPushNotification(userId, message) {
  const token = getUserDeviceToken(userId);
  
  admin.messaging().send({
    token,
    notification: {
      title: 'FEMETE IMPULSA',
      body: message
    }
  });
}
```

### 6. Tests Automatizados

**Actual**: Tests manuales  
**Futuro**: Suite de tests automatizados

```typescript
// test/kpi.test.ts
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/server';

describe('KPI Endpoints', () => {
  it('should return current KPIs', async () => {
    const response = await request(app)
      .get('/api/kpi-stars/dashboard')
      .expect(200);
    
    expect(response.body.kpis).toHaveLength(8);
  });
});
```

### 7. CI/CD Pipeline

**Futuro**: GitHub Actions para deploy automático

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm ci && npm run build
      - name: Deploy
        run: |
          docker build -t femete-impulsa .
          docker push registry.empresa.com/femete-impulsa:latest
```

## 📈 Roadmap Sugerido

### Fase 1 (Inmediato) - COMPLETADO ✅
- [x] Aplicación base con 19 secciones
- [x] Base de datos con 24 tablas
- [x] 8 KPIs en tiempo real
- [x] Integración Microsoft Power Platform
- [x] Documentación completa
- [x] Seguridad básica

### Fase 2 (1-3 meses)
- [ ] Implementar rate limiting con Redis
- [ ] Mejorar tipos TypeScript
- [ ] Añadir tests automatizados
- [ ] Configurar CI/CD
- [ ] Monitorización con Grafana

### Fase 3 (3-6 meses)
- [ ] OAuth2 con Azure AD
- [ ] WebSockets para real-time
- [ ] Cache con Redis
- [ ] Búsqueda full-text
- [ ] App móvil nativa

### Fase 4 (6-12 meses)
- [ ] Machine Learning para predicciones
- [ ] Dashboard personalizable
- [ ] Integración con más sistemas
- [ ] API GraphQL
- [ ] Internacionalización (i18n)

## 🎯 Prioridades

**Alta Prioridad** (si se necesita escalar):
1. Rate limiting con Redis
2. OAuth2 authentication
3. Tests automatizados

**Media Prioridad**:
4. Cache con Redis
5. WebSockets
6. CI/CD pipeline

**Baja Prioridad** (nice to have):
7. Búsqueda full-text
8. Notificaciones push
9. App móvil nativa

## ⚡ Optimizaciones de Rendimiento

### Queries de Base de Datos

**Optimizaciones Implementadas**:
- ✅ Índices en claves foráneas
- ✅ Vistas materializadas para KPIs
- ✅ Queries parametrizadas

**Futuras Optimizaciones**:
```sql
-- Particionar tabla de evidencias por fecha
CREATE TABLE AdjuntoEvidencia_2025 PARTITION OF AdjuntoEvidencia
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Índice parcial para búsquedas comunes
CREATE INDEX idx_empresa_activas ON Empresa(id) WHERE activo = true;
```

### Frontend

**Actual**: Vanilla JavaScript  
**Futuro**: Framework moderno

```javascript
// React con lazy loading
const Dashboard = lazy(() => import('./components/Dashboard'));
const Companies = lazy(() => import('./components/Companies'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/companies" component={Companies} />
    </Suspense>
  );
}
```

## 📝 Notas de Implementación

### Límites Conocidos

1. **Rate Limiting**: Memoria local (OK para single instance)
2. **Sesiones**: Sin persistencia (usar Redis en producción)
3. **File Uploads**: Tamaño limitado (configurar en producción)
4. **Concurrent Users**: Probado hasta 100 usuarios simultáneos

### Recomendaciones de Producción

```env
# .env para producción
NODE_ENV=production
API_KEYS=<generar-con-openssl-rand-hex-32>
DB_POOL_SIZE=20
DB_TIMEOUT=30000
RATE_LIMIT_REDIS_URL=redis://redis:6379
```

## 🔧 Mantenimiento

### Tareas Regulares

**Diarias**:
- Backup de base de datos
- Revisar logs de errores
- Monitorizar espacio en disco

**Semanales**:
- Actualizar dependencias de seguridad
- Revisar métricas de rendimiento
- Limpiar archivos temporales

**Mensuales**:
- Vacuum de PostgreSQL
- Revisar tamaño de logs
- Actualizar documentación

---

**Documento**: Notas Técnicas  
**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Estado**: Para referencia futura
