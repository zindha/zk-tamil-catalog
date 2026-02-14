import { handleCatalog } from './catalog.js';
import { getManifest } from './manifest.js';
import { indexHtml, configureHtml } from './pages.js';
import { trackRequest, getTodayStats, getLast7DaysStats, getTopCountries, generateStatsHTML } from './analytics.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Track all requests (non-blocking)
    ctx.waitUntil(trackRequest(request, env));

    // Stats endpoint (protected with password)
    if (url.pathname === '/stats') {
      const password = url.searchParams.get('key');
      // Change this password to something secure!
      if (password !== 'Admin@ZK') {
        return new Response('Unauthorized - Add ?key=your-password to URL', { 
          status: 401,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      const todayStats = await getTodayStats(env);
      const weekStats = await getLast7DaysStats(env);
      const countries = await getTopCountries(env);

      const html = generateStatsHTML(todayStats, weekStats, countries);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // JSON stats endpoint
    if (url.pathname === '/stats.json') {
      const password = url.searchParams.get('key');
      if (password !== 'Admin@ZK') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const todayStats = await getTodayStats(env);
      const weekStats = await getLast7DaysStats(env);

      return new Response(JSON.stringify({
        today: todayStats,
        last7Days: weekStats
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Landing page
    if (url.pathname === '/') {
      return new Response(indexHtml, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Configure page
    if (url.pathname === '/configure') {
      return new Response(configureHtml, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Extract config from URL
    const pathParts = url.pathname.split('/').filter(p => p);
    if (pathParts.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    let config;
    try {
      const configJson = atob(pathParts[0]);
      config = JSON.parse(configJson);
    } catch (e) {
      return new Response('Invalid configuration', { status: 400 });
    }

    // Manifest endpoint
    if (pathParts[1] === 'manifest.json') {
      const manifest = getManifest(config);
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Catalog endpoint
    if (pathParts[1] === 'catalog' && pathParts[2] && pathParts[3]) {
      const type = pathParts[2];
      const idWithParams = pathParts[3].replace('.json', '');
      const [id, ...extraParts] = idWithParams.split('/');

      const extra = {};
      extraParts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) {
          extra[key] = value;
        }
      });

      const result = await handleCatalog(type, id, extra, config);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
