import { getManifest } from './manifest.js';
import { handleCatalog } from './catalog.js';
import { indexHtml, configureHtml } from './pages.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    console.log('Request:', request.method, path);
    
    // Serve home page
    if (path === '/' || path === '/index.html') {
      return new Response(indexHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // Serve configure page
    if (path === '/configure' || path === '/configure.html') {
      return new Response(configureHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // Parse config from URL path (base64 encoded)
    const configMatch = path.match(/^\/([A-Za-z0-9+/=]+)\//);
    let config = {};
    
    if (configMatch) {
      try {
        const decoded = atob(configMatch[1]);
        config = JSON.parse(decoded);
        console.log('Config decoded successfully, has API key:', !!config.apiKey);
      } catch (e) {
        console.error('Config decode error:', e);
        return new Response(JSON.stringify({ error: 'Invalid configuration' }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders 
      });
    }
    
    // Handle manifest.json
    if (path.endsWith('/manifest.json')) {
      console.log('Serving manifest');
      const manifest = getManifest(config);
      return new Response(
        JSON.stringify(manifest, null, 2),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
    }
    
    // Handle catalog requests: /catalog/:type/:id.json
    const catalogMatch = path.match(/\/catalog\/([^\/]+)\/([^\/]+)\.json$/);
    if (catalogMatch) {
      const [, type, id] = catalogMatch;
      console.log('Catalog request:', type, id);
      
      const extra = {};
      for (const [key, value] of url.searchParams) {
        extra[key] = value;
      }
      
      try {
        const result = await handleCatalog(type, id, extra, config);
        
        return new Response(
          JSON.stringify(result), 
          { 
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'public, max-age=1800'
            }
          }
        );
      } catch (error) {
        console.error('Catalog handler error:', error);
        return new Response(
          JSON.stringify({ 
            metas: [], 
            error: error.message 
          }), 
          { 
            status: 200, // Return 200 even on error for Stremio compatibility
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        );
      }
    }
    
    console.log('No route matched, returning 404');
    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'Content-Type': 'text/plain',
        ...corsHeaders
      }
    });
  }
};
