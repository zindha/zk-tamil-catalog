import { getManifest } from './manifest.js';
import { handleCatalog } from './catalog.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve configuration UI
    if (url.pathname === '/' || url.pathname === '/configure') {
      return fetch(request);
    }
    
    // Parse config from URL
    const configMatch = url.pathname.match(/^\/([^\/]+)\//);
    let config = {};
    
    if (configMatch) {
      try {
        config = JSON.parse(atob(configMatch[1]));
      } catch (e) {
        return new Response('Invalid configuration', { status: 400 });
      }
    }
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json'
    };
    
    // Handle manifest
    if (url.pathname.endsWith('/manifest.json')) {
      return new Response(
        JSON.stringify(getManifest(config)),
        { headers }
      );
    }
    
    // Handle catalog requests
    const catalogMatch = url.pathname.match(/\/catalog\/([^\/]+)\/([^\/]+)\.json/);
    if (catalogMatch) {
      const [, type, id] = catalogMatch;
      const extra = Object.fromEntries(url.searchParams);
      
      const result = await handleCatalog(type, id, extra, config);
      return new Response(JSON.stringify(result), { headers });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
