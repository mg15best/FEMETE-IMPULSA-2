#!/bin/bash

# Script de Creación de Paquetes de Despliegue
# FEMETE IMPULSA - STARS 2025

echo "╔═══════════════════════════════════════════════════╗"
echo "║    FEMETE IMPULSA - Package Creator               ║"
echo "║    Creating deployment packages...                ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Create packages directory
PACKAGE_DIR="deployment-packages"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION="1.0.0"

mkdir -p $PACKAGE_DIR

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating deployment packages...${NC}"

# Package 1: Complete Installation
echo -e "\n${YELLOW}[1/4] Creating Complete Installation Package...${NC}"
COMPLETE_PKG="$PACKAGE_DIR/femete-impulsa-complete-${VERSION}-${TIMESTAMP}.tar.gz"

tar -czf $COMPLETE_PKG \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='deployment-packages' \
    --exclude='*.log' \
    backend/ \
    frontend/ \
    database/ \
    docker-compose.yml \
    Dockerfile \
    nginx.conf \
    package.json \
    package-lock.json \
    tsconfig.json \
    .env.example \
    .gitignore \
    README.md \
    POWERBI_INTEGRATION.md \
    POWERAPPS_INTEGRATION.md \
    INTRANET_INTEGRATION.md \
    GUIA_COMPLETA.md

echo -e "${GREEN}✓ Complete package created: $COMPLETE_PKG${NC}"

# Package 2: API Only
echo -e "\n${YELLOW}[2/4] Creating API-Only Package...${NC}"
API_PKG="$PACKAGE_DIR/femete-impulsa-api-${VERSION}-${TIMESTAMP}.tar.gz"

tar -czf $API_PKG \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='*.log' \
    backend/ \
    database/ \
    package.json \
    package-lock.json \
    tsconfig.json \
    .env.example \
    README.md \
    POWERBI_INTEGRATION.md \
    POWERAPPS_INTEGRATION.md

echo -e "${GREEN}✓ API package created: $API_PKG${NC}"

# Package 3: Frontend Only
echo -e "\n${YELLOW}[3/4] Creating Frontend-Only Package...${NC}"
FRONTEND_PKG="$PACKAGE_DIR/femete-impulsa-frontend-${VERSION}-${TIMESTAMP}.tar.gz"

tar -czf $FRONTEND_PKG \
    frontend/ \
    nginx.conf \
    README.md \
    GUIA_COMPLETA.md

echo -e "${GREEN}✓ Frontend package created: $FRONTEND_PKG${NC}"

# Package 4: Documentation
echo -e "\n${YELLOW}[4/4] Creating Documentation Package...${NC}"
DOCS_PKG="$PACKAGE_DIR/femete-impulsa-docs-${VERSION}-${TIMESTAMP}.tar.gz"

tar -czf $DOCS_PKG \
    README.md \
    GUIA_COMPLETA.md \
    POWERBI_INTEGRATION.md \
    POWERAPPS_INTEGRATION.md \
    INTRANET_INTEGRATION.md \
    database/schema.sql \
    database/kpis_powerbi.sql

echo -e "${GREEN}✓ Documentation package created: $DOCS_PKG${NC}"

# Create installation guide
echo -e "\n${YELLOW}Creating installation guide...${NC}"
cat > $PACKAGE_DIR/INSTALLATION_GUIDE.txt << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║     FEMETE IMPULSA - INSTALLATION GUIDE                       ║
║     Version 1.0.0                                             ║
╚═══════════════════════════════════════════════════════════════╝

PACKAGES INCLUDED:
==================

1. femete-impulsa-complete-*.tar.gz
   - Complete application (backend + frontend + database)
   - Docker configuration
   - All documentation
   - Use this for new installations

2. femete-impulsa-api-*.tar.gz
   - Backend API only
   - Database schemas
   - Use this for API-only deployments

3. femete-impulsa-frontend-*.tar.gz
   - Frontend web interface only
   - Nginx configuration
   - Use this to embed in existing portal

4. femete-impulsa-docs-*.tar.gz
   - All documentation
   - Database schemas
   - Integration guides

QUICK START - Complete Installation with Docker:
================================================

1. Extract the complete package:
   tar -xzf femete-impulsa-complete-*.tar.gz
   cd femete-impulsa-complete

2. Configure environment:
   cp .env.example .env
   nano .env
   (Edit database credentials and URLs)

3. Start with Docker:
   docker-compose up -d

4. Initialize database:
   docker-compose exec postgres psql -U femete_admin -d femete_impulsa -f /docker-entrypoint-initdb.d/schema.sql
   docker-compose exec postgres psql -U femete_admin -d femete_impulsa -f /docker-entrypoint-initdb.d/kpis_powerbi.sql

5. Access the application:
   Frontend: http://localhost
   API: http://localhost:3000
   API Docs: http://localhost:3000/api-docs
   Health: http://localhost:3000/health

QUICK START - Manual Installation:
===================================

1. Install prerequisites:
   - Node.js 18+
   - PostgreSQL 15+
   - Nginx (optional)

2. Extract package:
   tar -xzf femete-impulsa-complete-*.tar.gz
   cd femete-impulsa-complete

3. Install dependencies:
   npm install

4. Setup PostgreSQL:
   sudo -u postgres psql
   CREATE DATABASE femete_impulsa;
   CREATE USER femete_admin WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE femete_impulsa TO femete_admin;
   \q

5. Load database schema:
   psql -U femete_admin -d femete_impulsa -f database/schema.sql
   psql -U femete_admin -d femete_impulsa -f database/kpis_powerbi.sql

6. Configure application:
   cp .env.example .env
   nano .env
   (Set your database credentials)

7. Build and start:
   npm run build
   npm start

INTEGRATION GUIDES:
===================

- Power BI: See POWERBI_INTEGRATION.md
- Power Apps: See POWERAPPS_INTEGRATION.md
- Intranet: See INTRANET_INTEGRATION.md
- Complete User Guide: See GUIA_COMPLETA.md

FEATURES:
=========

✓ 19 application sections
✓ 24 database tables
✓ 8 STARS 2025 KPIs
✓ Power BI ready
✓ Power Apps compatible
✓ OpenAPI/Swagger documentation
✓ Export in JSON, CSV, Excel
✓ Responsive web interface
✓ Docker deployment
✓ Intranet integration ready

SUPPORT:
========

Documentation: http://localhost:3000/api-docs
Email: admin@femete-impulsa.com
Version: 1.0.0
Date: January 2025

EOF

echo -e "${GREEN}✓ Installation guide created${NC}"

# Create checksum file
echo -e "\n${YELLOW}Creating checksums...${NC}"
cd $PACKAGE_DIR
sha256sum *.tar.gz > checksums.sha256
cd ..
echo -e "${GREEN}✓ Checksums created${NC}"

# Summary
echo -e "\n${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           PACKAGE CREATION COMPLETE               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Packages created in: $PACKAGE_DIR${NC}"
echo ""
echo "Files:"
ls -lh $PACKAGE_DIR/
echo ""
echo -e "${YELLOW}Installation guide:${NC} $PACKAGE_DIR/INSTALLATION_GUIDE.txt"
echo -e "${YELLOW}Checksums:${NC} $PACKAGE_DIR/checksums.sha256"
echo ""
echo -e "${GREEN}Ready for deployment!${NC}"
