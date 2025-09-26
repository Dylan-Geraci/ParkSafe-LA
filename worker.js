// Cloudflare Worker for ParkSafe-LA API
// Replaces Railway Flask backend with identical endpoints

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Predict endpoint (placeholder - will implement in PR #2)
    if (url.pathname === '/predict' && request.method === 'POST') {
      return new Response(JSON.stringify({
        error: 'Endpoint not implemented yet - coming in PR #2'
      }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 404 for all other routes
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};