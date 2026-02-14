export async function trackRequest(request, env) {
  try {
    const url = new URL(request.url);
    const today = new Date().toISOString().split('T')[0];

    const dailyKey = `stats:daily:${today}`;
    const currentCount = parseInt(await env.ANALYTICS.get(dailyKey) || '0');
    await env.ANALYTICS.put(dailyKey, (currentCount + 1).toString(), {
      expirationTtl: 86400 * 90
    });

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipHash = await hashIP(ip);
    const uniqueKey = `unique:${today}:${ipHash}`;
    const exists = await env.ANALYTICS.get(uniqueKey);

    if (!exists) {
      await env.ANALYTICS.put(uniqueKey, '1', { expirationTtl: 86400 });

      const uniqueCountKey = `stats:unique:${today}`;
      const uniqueCount = parseInt(await env.ANALYTICS.get(uniqueCountKey) || '0');
      await env.ANALYTICS.put(uniqueCountKey, (uniqueCount + 1).toString(), {
        expirationTtl: 86400 * 90
      });
    }

    if (url.pathname.includes('/manifest.json')) {
      const installKey = `stats:installs:${today}`;
      const installCount = parseInt(await env.ANALYTICS.get(installKey) || '0');
      await env.ANALYTICS.put(installKey, (installCount + 1).toString(), {
        expirationTtl: 86400 * 90
      });

      const installUniqueKey = `install:${today}:${ipHash}`;
      const installExists = await env.ANALYTICS.get(installUniqueKey);

      if (!installExists) {
        await env.ANALYTICS.put(installUniqueKey, '1', { expirationTtl: 86400 });

        const uniqueInstallKey = `stats:unique-installs:${today}`;
        const uniqueInstalls = parseInt(await env.ANALYTICS.get(uniqueInstallKey) || '0');
        await env.ANALYTICS.put(uniqueInstallKey, (uniqueInstalls + 1).toString(), {
          expirationTtl: 86400 * 90
        });
      }
    }

    if (url.pathname.includes('/catalog/')) {
      const catalogKey = `stats:catalog:${today}`;
      const catalogCount = parseInt(await env.ANALYTICS.get(catalogKey) || '0');
      await env.ANALYTICS.put(catalogKey, (catalogCount + 1).toString(), {
        expirationTtl: 86400 * 90
      });
    }

    const country = request.cf?.country || 'unknown';
    const countryKey = `stats:country:${today}:${country}`;
    const countryCount = parseInt(await env.ANALYTICS.get(countryKey) || '0');
    await env.ANALYTICS.put(countryKey, (countryCount + 1).toString(), {
      expirationTtl: 86400 * 90
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'zk-tamil-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16);
}

export async function getTodayStats(env) {
  const today = new Date().toISOString().split('T')[0];

  const dailyRequests = await env.ANALYTICS.get(`stats:daily:${today}`) || '0';
  const uniqueUsers = await env.ANALYTICS.get(`stats:unique:${today}`) || '0';
  const installs = await env.ANALYTICS.get(`stats:installs:${today}`) || '0';
  const uniqueInstalls = await env.ANALYTICS.get(`stats:unique-installs:${today}`) || '0';
  const catalogRequests = await env.ANALYTICS.get(`stats:catalog:${today}`) || '0';

  return {
    date: today,
    totalRequests: parseInt(dailyRequests),
    uniqueUsers: parseInt(uniqueUsers),
    totalInstallations: parseInt(installs),
    uniqueInstallations: parseInt(uniqueInstalls),
    catalogRequests: parseInt(catalogRequests)
  };
}

export async function getLast7DaysStats(env) {
  const stats = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dailyRequests = await env.ANALYTICS.get(`stats:daily:${dateStr}`) || '0';
    const uniqueUsers = await env.ANALYTICS.get(`stats:unique:${dateStr}`) || '0';
    const installs = await env.ANALYTICS.get(`stats:installs:${dateStr}`) || '0';
    const uniqueInstalls = await env.ANALYTICS.get(`stats:unique-installs:${dateStr}`) || '0';

    stats.push({
      date: dateStr,
      totalRequests: parseInt(dailyRequests),
      uniqueUsers: parseInt(uniqueUsers),
      totalInstallations: parseInt(installs),
      uniqueInstallations: parseInt(uniqueInstalls)
    });
  }

  return stats;
}

export async function getTopCountries(env) {
  const today = new Date().toISOString().split('T')[0];
  const countries = {};

  const commonCountries = ['IN', 'US', 'GB', 'CA', 'AU', 'SG', 'MY', 'LK', 'AE', 'QA'];

  for (const country of commonCountries) {
    const count = await env.ANALYTICS.get(`stats:country:${today}:${country}`) || '0';
    if (parseInt(count) > 0) {
      countries[country] = parseInt(count);
    }
  }

  return countries;
}

export function generateStatsHTML(todayStats, weekStats, countries) {
  const countryEntries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZK Tamil Catalog - Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: white; text-align: center; margin-bottom: 30px; font-size: 2.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .stat-label { color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .stat-value { color: #333; font-size: 2.5rem; font-weight: bold; }
    .stat-icon { font-size: 2rem; margin-bottom: 10px; }
    .week-stats { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 30px; }
    .week-stats h2 { color: #333; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; color: #666; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
    td { color: #333; }
    .country-stats { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .country-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
    .country-name { font-weight: 600; color: #333; }
    .country-count { color: #667eea; font-weight: bold; font-size: 1.2rem; }
    .refresh-btn { position: fixed; bottom: 30px; right: 30px; background: white; color: #667eea; border: none; padding: 15px 30px; border-radius: 50px; font-weight: 600; cursor: pointer; box-shadow: 0 5px 20px rgba(0,0,0,0.3); transition: all 0.3s; }
    .refresh-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
    .timestamp { text-align: center; color: white; margin-top: 20px; font-size: 0.9rem; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 ZK Tamil Catalog Analytics</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-label">Unique Users Today</div>
        <div class="stat-value">${todayStats.uniqueUsers}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-label">Unique Installs Today</div>
        <div class="stat-value">${todayStats.uniqueInstallations}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-label">Total Requests Today</div>
        <div class="stat-value">${todayStats.totalRequests}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎬</div>
        <div class="stat-label">Catalog Views Today</div>
        <div class="stat-value">${todayStats.catalogRequests}</div>
      </div>
    </div>

    <div class="week-stats">
      <h2>📅 Last 7 Days</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Unique Users</th>
            <th>Installs</th>
            <th>Total Requests</th>
          </tr>
        </thead>
        <tbody>
          ${weekStats.map(day => `
            <tr>
              <td>${day.date}</td>
              <td>${day.uniqueUsers}</td>
              <td>${day.uniqueInstallations}</td>
              <td>${day.totalRequests}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="country-stats">
      <h2>🌍 Top Countries Today</h2>
      ${countryEntries.length > 0 ? countryEntries.map(([country, count]) => `
        <div class="country-item">
          <span class="country-name">${getCountryName(country)}</span>
          <span class="country-count">${count}</span>
        </div>
      `).join('') : '<p style="color: #999; text-align: center;">No data yet</p>'}
    </div>

    <div class="timestamp">
      Last updated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </div>
  </div>

  <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
</body>
</html>`;
}

function getCountryName(code) {
  const countries = {
    'IN': '🇮🇳 India',
    'US': '🇺🇸 United States',
    'GB': '🇬🇧 United Kingdom',
    'CA': '🇨🇦 Canada',
    'AU': '🇦🇺 Australia',
    'SG': '🇸🇬 Singapore',
    'MY': '🇲🇾 Malaysia',
    'LK': '🇱🇰 Sri Lanka',
    'AE': '🇦🇪 UAE',
    'QA': '🇶🇦 Qatar'
  };
  return countries[code] || code;
}
