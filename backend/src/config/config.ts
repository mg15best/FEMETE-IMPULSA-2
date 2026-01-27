export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: '24h',
  powerBI: {
    clientId: process.env.POWERBI_CLIENT_ID,
    clientSecret: process.env.POWERBI_CLIENT_SECRET,
    tenantId: process.env.POWERBI_TENANT_ID,
    workspaceId: process.env.POWERBI_WORKSPACE_ID,
  }
};
