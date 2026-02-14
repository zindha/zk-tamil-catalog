import { getManifest } from './manifest.js';
import { handleCatalog } from './catalog.js';

// Import static assets
import indexHtml from '../public/index.html';
import configureHtml from '../public/configure.html';
import styleCss from '../public/style.css';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Serve static files
    if (path === '/' || path === '/index.html') {
      return new Response(indexHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    if (path === '/configure' || path === '/configure.html') {
      return new Response(configureHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    if (path === '/style.css') {
      return new Response(styleCss, {
        headers: { 'Content-Type': 'text/css; charset=utf-8' }
      });
    }
    
    // Parse config from URL
    const configMatch = path.match(/^\/([^\/]+)\//);
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
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    // Handle manifest
    if (path.endsWith('/manifest.json')) {
      return new Response(
        JSON.stringify(getManifest(config)),
        { headers }
      );
    }
    
    // Handle catalog requests
    const catalogMatch = path.match(/\/catalog\/([^\/]+)\/([^\/]+)\.json/);
    if (catalogMatch) {
      const [, type, id] = catalogMatch;
      const extra = Object.fromEntries(url.searchParams);
      
      try {
        const result = await handleCatalog(type, id, extra, config);
        return new Response(JSON.stringify(result), { headers });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }), 
          { status: 500, headers }
        );
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
