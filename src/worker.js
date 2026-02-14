import { getManifest } from './manifest.js';
import { handleCatalog } from './catalog.js';
import { indexHtml, configureHtml } from './pages.js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      console.log('Request path:', path);
      
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
      
      // Extract config from path
      let config = {};
      const pathSegments = path.split('/').filter(Boolean);
      
      if (pathSegments.length > 0) {
        const potentialConfig = pathSegments[0];
        
        // Check if first segment looks like base64
        if (potentialConfig.length > 20 && potentialConfig !== 'configure') {
          try {
            const decoded = atob(potentialConfig);
            config = JSON.parse(decoded);
            console.log('Config decoded - Has API key:', !!config.apiKey);
            console.log('API key length:', config.apiKey ? config.apiKey.length : 0);
          } catch (e) {
            console.error('Failed to decode config:', e.message);
          }
        }
      }
      
      // Handle manifest.json
      if (path.includes('manifest.json')) {
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
      
      // Handle catalog requests
      const catalogPattern = /\/catalog\/([^\/]+)\/([^\/]+)\.json/;
      const catalogMatch = path.match(catalogPattern);
      
      if (catalogMatch) {
        const [, type, id] = catalogMatch;
        console.log('Catalog request - Type:', type, 'ID:', id);
        console.log('Config in catalog handler:', JSON.stringify(config));
        
        const extra = {};
        url.searchParams.forEach((value, key) => {
          extra[key] = value;
        });
        
        const result = await handleCatalog(type, id, extra, config);
        console.log('Catalog result - Metas count:', result.metas?.length || 0);
        
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
      }
      
      return new Response('Not Found', { 
        status: 404,
        headers: { 
          'Content-Type': 'text/plain',
          ...corsHeaders
        }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: error.message, stack: error.stack }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  }
};
