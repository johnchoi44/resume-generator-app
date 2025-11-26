import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle CORS and API authentication for cross-origin requests
 * Allows portfolio site to call the resume generator API
 */
export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    // Get allowed origins from environment variable
    const allowedOriginsStr = process.env.ALLOWED_ORIGINS || '';
    const allowedOrigins = allowedOriginsStr.split(',').map(o => o.trim()).filter(Boolean);

    // Add localhost for development
    const defaultAllowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default port
      'http://localhost:5174', // Portfolio dev server
    ];

    const allAllowedOrigins = [...defaultAllowedOrigins, ...allowedOrigins];

    // Check if origin is allowed
    const isAllowedOrigin = origin && allAllowedOrigins.includes(origin);

    // Handle preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 200 });

      if (isAllowedOrigin) {
        preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
      }

      preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      preflightResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

      return preflightResponse;
    }

    // For actual requests, check API key (if configured)
    const apiKey = request.headers.get('X-API-Key');
    const validApiKey = process.env.RESUME_API_KEY;

    // Only require API key if it's configured in environment
    // This allows gradual rollout - set RESUME_API_KEY in production to enable
    if (validApiKey && validApiKey.length > 0) {
      // Skip API key check for health/info endpoints
      const publicEndpoints = [
        '/api/generate-resume', // Allow GET for API info
      ];

      const isPublicEndpoint = publicEndpoints.some(endpoint =>
        request.nextUrl.pathname === endpoint && request.method === 'GET'
      );

      if (!isPublicEndpoint) {
        if (!apiKey || apiKey !== validApiKey) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid or missing API key. Please include X-API-Key header.'
              }
            },
            { status: 401 }
          );
        }
      }
    }

    // Proceed with the request
    const response = NextResponse.next();

    // Add CORS headers to response
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  }

  // For non-API routes, continue normally
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/api/:path*',
};
