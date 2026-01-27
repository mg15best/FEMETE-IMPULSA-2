import { Request, Response, NextFunction } from 'express';

/**
 * Simple API Key authentication middleware
 * For production, replace with proper OAuth2 or JWT authentication
 */
export function authenticateAPIKey(req: Request, res: Response, next: NextFunction) {
  // Skip authentication in development mode
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const validApiKeys = process.env.API_KEYS?.split(',') || [];

  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide X-API-Key header or api_key query parameter' 
    });
  }

  if (!validApiKeys.includes(apiKey as string)) {
    return res.status(403).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is not valid' 
    });
  }

  next();
}

/**
 * Optional authentication - allows unauthenticated access but validates if key is provided
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (apiKey) {
    const validApiKeys = process.env.API_KEYS?.split(',') || [];
    if (!validApiKeys.includes(apiKey as string)) {
      return res.status(403).json({ 
        error: 'Invalid API key' 
      });
    }
  }
  
  next();
}

/**
 * Rate limiting middleware (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();
    
    const record = rateLimitMap.get(identifier);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds` 
      });
    }
    
    record.count++;
    next();
  };
}
