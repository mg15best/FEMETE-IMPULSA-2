-- ============================================
-- KPI Configuration and Tracking for STARS 2025
-- Power BI Dashboard Integration
-- ============================================

-- KPI Configuration Table
CREATE TABLE IF NOT EXISTS KPIConfiguracion (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    valor_objetivo INTEGER NOT NULL,
    unidad VARCHAR(50),
    categoria VARCHAR(100),
    tabla_origen VARCHAR(100),
    condicion_calculo TEXT,
    activo BOOLEAN DEFAULT true,
    orden_visualizacion INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert STARS 2025 KPIs
INSERT INTO KPIConfiguracion (codigo, nombre, descripcion, valor_objetivo, unidad, categoria, tabla_origen, condicion_calculo, orden_visualizacion) VALUES
('KPI-MAT-001', 'Material de apoyo', 'Materiales de apoyo creados para el programa', 5, 'unidades', 'Recursos', 'Material', 'categoria = ''Apoyo''', 1),
('KPI-PBI-001', 'Cuadro de mando PowerBI©', 'Cuadros de mando PowerBI creados', 1, 'unidades', 'Herramientas', 'Informe', 'tipo_id = PowerBI', 2),
('KPI-ENT-001', 'Entidades de interés contactadas', 'Entidades colaboradoras contactadas', 8, 'entidades', 'Networking', 'EntidadColaboradora', 'activo = true', 3),
('KPI-EMP-001', 'Empresas asesoradas', 'Empresas que han recibido asesoramiento', 20, 'empresas', 'Asesoramiento', 'SesionAsesoramiento', 'DISTINCT empresa_id', 4),
('KPI-INF-001', 'Informe individualizado de empresa emergente', 'Informes individualizados de empresas emergentes', 15, 'informes', 'Reporting', 'Informe', 'tipo = ''Individualizado''', 5),
('KPI-FOR-001', 'Píldoras formativas', 'Píldoras formativas impartidas', 6, 'píldoras', 'Formación', 'Formacion', 'tipo = ''Píldora''', 6),
('KPI-EVE-001', 'Eventos', 'Eventos realizados', 2, 'eventos', 'Eventos', 'Evento', 'estado_id = ''Completado''', 7),
('KPI-DIF-001', 'Impactos de difusión', 'Impactos de difusión realizados', 15, 'impactos', 'Comunicación', 'DifusionImpacto', 'COUNT(*)', 8);

-- KPI Current Values View (Real-time calculation)
CREATE OR REPLACE VIEW VistaKPIActuales AS
SELECT 
    k.id,
    k.codigo,
    k.nombre,
    k.descripcion,
    k.valor_objetivo,
    k.unidad,
    k.categoria,
    CASE k.codigo
        -- Material de apoyo
        WHEN 'KPI-MAT-001' THEN (
            SELECT COUNT(*) FROM Material 
            WHERE categoria = 'Apoyo' OR categoria LIKE '%apoyo%'
        )
        -- Cuadro de mando PowerBI
        WHEN 'KPI-PBI-001' THEN (
            SELECT COUNT(*) FROM Informe i
            JOIN CatalogoTipo ct ON i.tipo_id = ct.id
            WHERE ct.nombre LIKE '%PowerBI%' OR ct.nombre LIKE '%Power BI%'
        )
        -- Entidades contactadas
        WHEN 'KPI-ENT-001' THEN (
            SELECT COUNT(*) FROM EntidadColaboradora
            WHERE activo = true
        )
        -- Empresas asesoradas
        WHEN 'KPI-EMP-001' THEN (
            SELECT COUNT(DISTINCT empresa_id) FROM SesionAsesoramiento
        )
        -- Informes individualizados
        WHEN 'KPI-INF-001' THEN (
            SELECT COUNT(*) FROM Informe i
            JOIN CatalogoTipo ct ON i.tipo_id = ct.id
            WHERE ct.nombre LIKE '%Individualizado%' OR ct.nombre LIKE '%Empresa Emergente%'
        )
        -- Píldoras formativas
        WHEN 'KPI-FOR-001' THEN (
            SELECT COUNT(*) FROM Formacion f
            JOIN CatalogoTipo ct ON f.tipo_id = ct.id
            WHERE ct.nombre LIKE '%Píldora%' OR f.titulo LIKE '%Píldora%'
        )
        -- Eventos
        WHEN 'KPI-EVE-001' THEN (
            SELECT COUNT(*) FROM Evento e
            JOIN CatalogoEstado ce ON e.estado_id = ce.id
            WHERE ce.nombre = 'Completado' OR ce.nombre = 'Activo'
        )
        -- Impactos de difusión
        WHEN 'KPI-DIF-001' THEN (
            SELECT COUNT(*) FROM DifusionImpacto
        )
        ELSE 0
    END as valor_actual,
    CASE 
        WHEN k.valor_objetivo > 0 THEN 
            ROUND((CASE k.codigo
                WHEN 'KPI-MAT-001' THEN (SELECT COUNT(*)::numeric FROM Material WHERE categoria = 'Apoyo' OR categoria LIKE '%apoyo%')
                WHEN 'KPI-PBI-001' THEN (SELECT COUNT(*)::numeric FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%PowerBI%' OR ct.nombre LIKE '%Power BI%')
                WHEN 'KPI-ENT-001' THEN (SELECT COUNT(*)::numeric FROM EntidadColaboradora WHERE activo = true)
                WHEN 'KPI-EMP-001' THEN (SELECT COUNT(DISTINCT empresa_id)::numeric FROM SesionAsesoramiento)
                WHEN 'KPI-INF-001' THEN (SELECT COUNT(*)::numeric FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%Individualizado%' OR ct.nombre LIKE '%Empresa Emergente%')
                WHEN 'KPI-FOR-001' THEN (SELECT COUNT(*)::numeric FROM Formacion f JOIN CatalogoTipo ct ON f.tipo_id = ct.id WHERE ct.nombre LIKE '%Píldora%' OR f.titulo LIKE '%Píldora%')
                WHEN 'KPI-EVE-001' THEN (SELECT COUNT(*)::numeric FROM Evento e JOIN CatalogoEstado ce ON e.estado_id = ce.id WHERE ce.nombre = 'Completado' OR ce.nombre = 'Activo')
                WHEN 'KPI-DIF-001' THEN (SELECT COUNT(*)::numeric FROM DifusionImpacto)
                ELSE 0
            END / k.valor_objetivo::numeric * 100), 2)
        ELSE 0
    END as porcentaje_cumplimiento,
    CASE 
        WHEN (CASE k.codigo
            WHEN 'KPI-MAT-001' THEN (SELECT COUNT(*) FROM Material WHERE categoria = 'Apoyo' OR categoria LIKE '%apoyo%')
            WHEN 'KPI-PBI-001' THEN (SELECT COUNT(*) FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%PowerBI%' OR ct.nombre LIKE '%Power BI%')
            WHEN 'KPI-ENT-001' THEN (SELECT COUNT(*) FROM EntidadColaboradora WHERE activo = true)
            WHEN 'KPI-EMP-001' THEN (SELECT COUNT(DISTINCT empresa_id) FROM SesionAsesoramiento)
            WHEN 'KPI-INF-001' THEN (SELECT COUNT(*) FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%Individualizado%' OR ct.nombre LIKE '%Empresa Emergente%')
            WHEN 'KPI-FOR-001' THEN (SELECT COUNT(*) FROM Formacion f JOIN CatalogoTipo ct ON f.tipo_id = ct.id WHERE ct.nombre LIKE '%Píldora%' OR f.titulo LIKE '%Píldora%')
            WHEN 'KPI-EVE-001' THEN (SELECT COUNT(*) FROM Evento e JOIN CatalogoEstado ce ON e.estado_id = ce.id WHERE ce.nombre = 'Completado' OR ce.nombre = 'Activo')
            WHEN 'KPI-DIF-001' THEN (SELECT COUNT(*) FROM DifusionImpacto)
            ELSE 0
        END) >= k.valor_objetivo THEN 'Cumplido'
        WHEN (CASE k.codigo
            WHEN 'KPI-MAT-001' THEN (SELECT COUNT(*) FROM Material WHERE categoria = 'Apoyo' OR categoria LIKE '%apoyo%')
            WHEN 'KPI-PBI-001' THEN (SELECT COUNT(*) FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%PowerBI%' OR ct.nombre LIKE '%Power BI%')
            WHEN 'KPI-ENT-001' THEN (SELECT COUNT(*) FROM EntidadColaboradora WHERE activo = true)
            WHEN 'KPI-EMP-001' THEN (SELECT COUNT(DISTINCT empresa_id) FROM SesionAsesoramiento)
            WHEN 'KPI-INF-001' THEN (SELECT COUNT(*) FROM Informe i JOIN CatalogoTipo ct ON i.tipo_id = ct.id WHERE ct.nombre LIKE '%Individualizado%' OR ct.nombre LIKE '%Empresa Emergente%')
            WHEN 'KPI-FOR-001' THEN (SELECT COUNT(*) FROM Formacion f JOIN CatalogoTipo ct ON f.tipo_id = ct.id WHERE ct.nombre LIKE '%Píldora%' OR f.titulo LIKE '%Píldora%')
            WHEN 'KPI-EVE-001' THEN (SELECT COUNT(*) FROM Evento e JOIN CatalogoEstado ce ON e.estado_id = ce.id WHERE ce.nombre = 'Completado' OR ce.nombre = 'Activo')
            WHEN 'KPI-DIF-001' THEN (SELECT COUNT(*) FROM DifusionImpacto)
            ELSE 0
        END) >= (k.valor_objetivo * 0.7) THEN 'En Progreso'
        ELSE 'Pendiente'
    END as estado,
    k.orden_visualizacion,
    CURRENT_TIMESTAMP as fecha_calculo
FROM KPIConfiguracion k
WHERE k.activo = true
ORDER BY k.orden_visualizacion;

-- Add more specific types for the new KPIs
INSERT INTO CatalogoTipo (categoria, nombre, descripcion) VALUES
('Material', 'Apoyo', 'Material de apoyo'),
('Informe', 'PowerBI', 'Cuadro de mando PowerBI'),
('Informe', 'Individualizado', 'Informe individualizado de empresa'),
('Informe', 'Empresa Emergente', 'Informe de empresa emergente'),
('Formacion', 'Píldora', 'Píldora formativa')
ON CONFLICT (categoria, nombre) DO NOTHING;

-- Create indexes for KPI calculations
CREATE INDEX idx_material_categoria ON Material(categoria);
CREATE INDEX idx_entidad_activo ON EntidadColaboradora(activo);
CREATE INDEX idx_sesion_empresa ON SesionAsesoramiento(empresa_id);
CREATE INDEX idx_difusion_fecha ON DifusionImpacto(fecha_publicacion);

-- Function to get KPI summary for Power BI
CREATE OR REPLACE FUNCTION obtener_resumen_kpis()
RETURNS TABLE (
    kpi_codigo VARCHAR,
    kpi_nombre VARCHAR,
    valor_objetivo INTEGER,
    valor_actual BIGINT,
    porcentaje NUMERIC,
    estado VARCHAR,
    unidad VARCHAR,
    categoria VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        codigo::VARCHAR,
        nombre::VARCHAR,
        valor_objetivo,
        valor_actual,
        porcentaje_cumplimiento,
        estado::VARCHAR,
        unidad::VARCHAR,
        categoria::VARCHAR
    FROM VistaKPIActuales
    ORDER BY orden_visualizacion;
END;
$$ LANGUAGE plpgsql;

-- Table for KPI historical tracking
CREATE TABLE IF NOT EXISTS KPIHistorico (
    id SERIAL PRIMARY KEY,
    kpi_configuracion_id INTEGER REFERENCES KPIConfiguracion(id),
    valor INTEGER NOT NULL,
    porcentaje_cumplimiento NUMERIC(5,2),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for historical KPI queries
CREATE INDEX idx_kpi_historico_fecha ON KPIHistorico(fecha_registro);
CREATE INDEX idx_kpi_historico_config ON KPIHistorico(kpi_configuracion_id);

-- Function to record daily KPI snapshot
CREATE OR REPLACE FUNCTION registrar_snapshot_kpis()
RETURNS void AS $$
BEGIN
    INSERT INTO KPIHistorico (kpi_configuracion_id, valor, porcentaje_cumplimiento, fecha_registro)
    SELECT 
        id,
        valor_actual,
        porcentaje_cumplimiento,
        CURRENT_DATE
    FROM VistaKPIActuales
    WHERE NOT EXISTS (
        SELECT 1 FROM KPIHistorico 
        WHERE kpi_configuracion_id = VistaKPIActuales.id 
        AND fecha_registro = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;

-- Comments for Power BI documentation
COMMENT ON VIEW VistaKPIActuales IS 'Vista en tiempo real de KPIs para integración con Power BI - STARS 2025';
COMMENT ON FUNCTION obtener_resumen_kpis() IS 'Función que retorna resumen de KPIs para Power BI Dashboard';
COMMENT ON TABLE KPIConfiguracion IS 'Configuración de KPIs del proyecto STARS 2025';
COMMENT ON TABLE KPIHistorico IS 'Histórico de valores de KPIs para análisis de tendencias en Power BI';
