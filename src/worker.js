import { getManifest } from './manifest.js';
import { handleCatalog } from './catalog.js';
import { indexHtml, configureHtml } from './pages.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
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
    
    // Parse config from URL path
    const configMatch = path.match(/^\/([A-Za-z0-9+/=]+)\//);
    let config = {};
    
    if (configMatch) {
      try {
        config = JSON.parse(atob(configMatch[1]));
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid configuration' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Handle manifest.json
    if (path.endsWith('/manifest.json')) {
      return new Response(
        JSON.stringify(getManifest(config)),
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
      const extra = {};
      
      // Parse query parameters
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
              'Cache-Control': 'public, max-age=3600'
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ metas: [], error: error.message }), 
          { 
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        );
      }
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
