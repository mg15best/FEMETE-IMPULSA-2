# Guía de Integración en Intranet Corporativa

## 🌐 Integración Completa en Intranet de la Entidad

Esta guía explica cómo integrar el sistema FEMETE IMPULSA en la intranet corporativa existente, permitiendo acceso unificado y gestión centralizada.

## 📦 Paquetes de Implementación Disponibles

### Paquete 1: Instalación Completa (Recomendado)
**Contenido**:
- Servidor backend (Node.js + Express)
- Base de datos PostgreSQL
- Frontend web responsivo
- Configuración Docker completa

**Ideal para**: Implementación independiente o en servidor dedicado

### Paquete 2: Solo API
**Contenido**:
- Servidor backend
- Base de datos
- Documentación OpenAPI

**Ideal para**: Integración con intranet existente que consume la API

### Paquete 3: Frontend Embebible
**Contenido**:
- Interfaz web como módulo independiente
- Configuración para iframe/embedding
- CSS personalizable

**Ideal para**: Incrustar en portal existente

## 🚀 Método 1: Instalación Completa en Servidor Intranet

### Requisitos del Servidor

```
Sistema Operativo: Linux (Ubuntu 20.04+ / CentOS 8+) o Windows Server
Memoria RAM: Mínimo 4GB, Recomendado 8GB
Disco: Mínimo 20GB libres
CPU: 2 cores mínimo
Red: Acceso a red interna + opcional acceso externo
```

### Opción A: Con Docker (Más Fácil)

1. **Instalar Docker y Docker Compose**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo apt install docker-compose
   
   # CentOS/RHEL
   sudo yum install docker docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Descargar el Proyecto**:
   ```bash
   git clone https://github.com/mg15best/FEMETE-IMPULSA-2.git
   cd FEMETE-IMPULSA-2
   ```

3. **Configurar Variables de Entorno**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Editar con los datos de la intranet:
   ```env
   # Base de datos
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=femete_impulsa
   DB_USER=femete_admin
   DB_PASSWORD=TuPasswordSegura123!
   
   # Servidor
   PORT=3000
   NODE_ENV=production
   
   # URLs de la intranet
   FRONTEND_URL=http://intranet.empresa.local/femete
   API_URL=http://intranet.empresa.local/femete-api
   
   # CORS - Dominios permitidos
   ALLOWED_ORIGINS=http://intranet.empresa.local,https://intranet.empresa.local
   ```

4. **Iniciar Servicios**:
   ```bash
   docker-compose up -d
   ```

5. **Verificar Instalación**:
   ```bash
   docker-compose ps
   curl http://localhost:3000/health
   ```

6. **Inicializar Base de Datos**:
   ```bash
   docker-compose exec postgres psql -U femete_admin -d femete_impulsa -f /docker-entrypoint-initdb.d/schema.sql
   docker-compose exec postgres psql -U femete_admin -d femete_impulsa -f /docker-entrypoint-initdb.d/kpis_powerbi.sql
   ```

### Opción B: Instalación Manual

1. **Instalar Dependencias**:
   ```bash
   # Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs
   
   # PostgreSQL 15+
   sudo apt install postgresql postgresql-contrib
   ```

2. **Configurar PostgreSQL**:
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE femete_impulsa;
   CREATE USER femete_admin WITH PASSWORD 'TuPasswordSegura123!';
   GRANT ALL PRIVILEGES ON DATABASE femete_impulsa TO femete_admin;
   \q
   ```

3. **Cargar Esquema de Base de Datos**:
   ```bash
   psql -U femete_admin -d femete_impulsa -f database/schema.sql
   psql -U femete_admin -d femete_impulsa -f database/kpis_powerbi.sql
   ```

4. **Instalar Aplicación**:
   ```bash
   cd FEMETE-IMPULSA-2
   npm install
   npm run build
   ```

5. **Configurar como Servicio Systemd**:
   ```bash
   sudo nano /etc/systemd/system/femete-impulsa.service
   ```
   
   Contenido:
   ```ini
   [Unit]
   Description=FEMETE IMPULSA API
   After=network.target postgresql.service
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/femete-impulsa
   ExecStart=/usr/bin/node /var/www/femete-impulsa/dist/server.js
   Restart=on-failure
   Environment=NODE_ENV=production
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Activar:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable femete-impulsa
   sudo systemctl start femete-impulsa
   ```

## 🔗 Método 2: Integración con Reverse Proxy (Nginx/Apache)

### Con Nginx

1. **Configurar Nginx**:
   ```nginx
   # /etc/nginx/sites-available/intranet
   
   server {
       listen 80;
       server_name intranet.empresa.local;
       
       # Frontend de FEMETE IMPULSA
       location /femete {
           alias /var/www/femete-impulsa/frontend;
           index index.html;
           try_files $uri $uri/ /femete/index.html;
       }
       
       # API de FEMETE IMPULSA
       location /femete-api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           
           # CORS headers
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
           add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
       }
       
       # Swagger UI
       location /femete-api/api-docs {
           proxy_pass http://localhost:3000/api-docs;
           proxy_set_header Host $host;
       }
   }
   ```

2. **Activar Configuración**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/intranet /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Con Apache

1. **Habilitar Módulos**:
   ```bash
   sudo a2enmod proxy proxy_http rewrite headers
   ```

2. **Configurar VirtualHost**:
   ```apache
   # /etc/apache2/sites-available/intranet.conf
   
   <VirtualHost *:80>
       ServerName intranet.empresa.local
       
       # Frontend
       Alias /femete /var/www/femete-impulsa/frontend
       <Directory /var/www/femete-impulsa/frontend>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       # API
       ProxyPreserveHost On
       ProxyPass /femete-api http://localhost:3000
       ProxyPassReverse /femete-api http://localhost:3000
       
       # CORS
       Header always set Access-Control-Allow-Origin "*"
       Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
       Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
   </VirtualHost>
   ```

3. **Activar**:
   ```bash
   sudo a2ensite intranet
   sudo systemctl reload apache2
   ```

## 📱 Método 3: Embedding en Portal Existente

### Opción A: Iframe

```html
<!-- En tu página de intranet -->
<div class="femete-container">
    <h2>Gestión FEMETE IMPULSA</h2>
    <iframe 
        src="http://localhost:3000" 
        width="100%" 
        height="800px"
        frameborder="0"
        id="femete-iframe"
    ></iframe>
</div>

<style>
.femete-container {
    padding: 20px;
    background: #f5f5f5;
}
#femete-iframe {
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
```

### Opción B: Componente Web

```html
<!-- Incluir la aplicación como módulo -->
<div id="femete-app"></div>

<script src="http://localhost:3000/app.js"></script>
<script>
// Inicializar aplicación
FemeteApp.init({
    container: '#femete-app',
    apiUrl: 'http://localhost:3000/api',
    theme: 'corporate', // o 'light', 'dark'
    language: 'es'
});
</script>
```

### Opción C: Módulo React/Vue (Para Intranets Modernas)

```javascript
// Si tu intranet usa React
import FemeteApp from './femete-impulsa-module';

function IntranetPage() {
    return (
        <div>
            <h1>Portal de Gestión</h1>
            <FemeteApp 
                apiUrl="http://localhost:3000/api"
                defaultSection="inicio"
            />
        </div>
    );
}
```

## 🔐 Single Sign-On (SSO) con Active Directory

### Configuración LDAP/Active Directory

1. **Instalar Dependencia**:
   ```bash
   npm install passport passport-ldapauth
   ```

2. **Configurar en Backend**:
   ```typescript
   // backend/src/config/ldap.ts
   import passport from 'passport';
   import { Strategy as LdapStrategy } from 'passport-ldapauth';
   
   const LDAP_OPTIONS = {
       server: {
           url: 'ldap://dc.empresa.local:389',
           bindDN: 'cn=admin,dc=empresa,dc=local',
           bindCredentials: 'admin-password',
           searchBase: 'ou=users,dc=empresa,dc=local',
           searchFilter: '(uid={{username}})'
       }
   };
   
   passport.use(new LdapStrategy(LDAP_OPTIONS));
   ```

3. **Proteger Rutas**:
   ```typescript
   app.post('/api/auth/login', 
       passport.authenticate('ldapauth', { session: false }),
       (req, res) => {
           // Usuario autenticado
           res.json({ success: true, user: req.user });
       }
   );
   ```

### Configuración SAML (Azure AD, ADFS)

1. **Instalar**:
   ```bash
   npm install passport-saml
   ```

2. **Configurar**:
   ```typescript
   import { Strategy as SamlStrategy } from 'passport-saml';
   
   passport.use(new SamlStrategy({
       path: '/api/auth/saml/callback',
       entryPoint: 'https://login.microsoftonline.com/.../saml2',
       issuer: 'femete-impulsa',
       cert: process.env.SAML_CERT
   }, (profile, done) => {
       // Crear/actualizar usuario
       return done(null, profile);
   }));
   ```

## 📊 Integración con SharePoint

### Subir Evidencias a SharePoint

```typescript
// backend/src/services/sharepoint.ts
import { graph } from '@microsoft/microsoft-graph-client';

export async function uploadToSharePoint(file: Buffer, filename: string) {
    const client = graph.Client.init({
        authProvider: // ... configuración OAuth
    });
    
    await client
        .api('/sites/{site-id}/drive/root:/Evidencias/' + filename + ':/content')
        .put(file);
}
```

### Sincronizar Documentos

```typescript
// Sincronizar evidencias cada hora
cron.schedule('0 * * * *', async () => {
    const evidencias = await db.query('SELECT * FROM AdjuntoEvidencia WHERE sincronizado_sharepoint = false');
    
    for (const ev of evidencias.rows) {
        await uploadToSharePoint(ev.archivo, ev.nombre_archivo);
        await db.query('UPDATE AdjuntoEvidencia SET sincronizado_sharepoint = true WHERE id = $1', [ev.id]);
    }
});
```

## 🎨 Personalización de Tema Corporativo

### Crear CSS Personalizado

```css
/* /frontend/custom-theme.css */

:root {
    /* Colores corporativos */
    --primary-color: #003366;      /* Azul corporativo */
    --secondary-color: #FF6600;    /* Naranja corporativo */
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    
    /* Tipografía corporativa */
    --font-family: 'Roboto', 'Arial', sans-serif;
    --font-size-base: 14px;
    
    /* Logo */
    --logo-url: url('/assets/logo-empresa.png');
}

/* Header personalizado */
.navbar {
    background-color: var(--primary-color) !important;
}

.navbar-brand::before {
    content: '';
    display: inline-block;
    width: 120px;
    height: 40px;
    background-image: var(--logo-url);
    background-size: contain;
    background-repeat: no-repeat;
}

/* Botones corporativos */
.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
}
```

### Aplicar Tema

```html
<!-- En index.html -->
<link rel="stylesheet" href="/custom-theme.css">
```

## 📧 Integración con Exchange/Outlook

### Enviar Notificaciones por Email

```typescript
// backend/src/services/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.empresa.local',
    port: 587,
    secure: false,
    auth: {
        user: 'femete@empresa.local',
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function enviarNotificacion(destinatario: string, asunto: string, contenido: string) {
    await transporter.sendMail({
        from: '"FEMETE IMPULSA" <femete@empresa.local>',
        to: destinatario,
        subject: asunto,
        html: contenido
    });
}
```

### Crear Eventos en Calendario

```typescript
import { graph } from '@microsoft/microsoft-graph-client';

export async function crearEventoCalendario(evento: any) {
    const client = graph.Client.init({ /* ... */ });
    
    await client.api('/me/events').post({
        subject: evento.titulo,
        start: {
            dateTime: evento.fecha_inicio,
            timeZone: 'Europe/Madrid'
        },
        end: {
            dateTime: evento.fecha_fin,
            timeZone: 'Europe/Madrid'
        },
        location: {
            displayName: evento.lugar
        }
    });
}
```

## 🔒 Configuración de Seguridad

### Firewall

```bash
# Permitir solo desde red interna
sudo ufw allow from 192.168.1.0/24 to any port 3000
sudo ufw allow from 10.0.0.0/8 to any port 3000

# Denegar acceso externo
sudo ufw deny 3000
```

### HTTPS con Certificado Interno

```nginx
server {
    listen 443 ssl;
    server_name intranet.empresa.local;
    
    ssl_certificate /etc/ssl/certs/empresa-intranet.crt;
    ssl_certificate_key /etc/ssl/private/empresa-intranet.key;
    
    # ... resto de configuración
}
```

## 📦 Exportación de Datos para Backup

### Script de Backup Automático

```bash
#!/bin/bash
# /opt/scripts/backup-femete.sh

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/femete"

# Backup de base de datos
pg_dump -U femete_admin femete_impulsa > $BACKUP_DIR/db_$FECHA.sql

# Backup de evidencias
tar -czf $BACKUP_DIR/evidencias_$FECHA.tar.gz /var/www/femete-impulsa/uploads

# Limpiar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Cron para Ejecución Diaria

```bash
# Editar crontab
sudo crontab -e

# Backup diario a las 2 AM
0 2 * * * /opt/scripts/backup-femete.sh
```

## 📊 Monitorización

### Health Check Endpoint

```bash
# Monitorizar con curl
*/5 * * * * curl -f http://localhost:3000/health || echo "FEMETE IMPULSA DOWN" | mail -s "Alert" admin@empresa.local
```

### Integración con Nagios/Zabbix

```bash
# Script de check
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ $response -eq 200 ]; then
    echo "OK - FEMETE IMPULSA running"
    exit 0
else
    echo "CRITICAL - FEMETE IMPULSA down"
    exit 2
fi
```

## 📞 Soporte Técnico

Para consultas sobre integración en intranet:
- Documentación API: http://localhost:3000/api-docs
- Guía Power Apps: POWERAPPS_INTEGRATION.md
- Guía Power BI: POWERBI_INTEGRATION.md
- Email: admin@femete-impulsa.com

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Compatible con**: IIS, Apache, Nginx, SharePoint, Active Directory, Exchange
