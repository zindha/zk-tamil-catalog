export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZK Tamil Catalog - Stremio Addon</title>
  <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/zk_tamil_catalog_favicon.ico">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
    .container { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 600px; width: 100%; padding: 50px; text-align: center; }
    .logo-img { width: 200px; height: auto; margin-bottom: 20px; }
    .title { color: #333; font-size: 2.5rem; margin-bottom: 10px; font-weight: 800; }
    .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 40px; }
    .btn { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem; transition: all 0.3s; margin: 10px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6); }
    .features { margin-top: 50px; text-align: left; }
    .feature { display: flex; align-items: start; margin-bottom: 20px; }
    .feature-icon { font-size: 1.5rem; margin-right: 15px; }
    .feature-text h3 { color: #333; font-size: 1.1rem; margin-bottom: 5px; }
    .feature-text p { color: #666; font-size: 0.9rem; line-height: 1.5; }
    .footer { margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; color: #999; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/Logo.png" alt="ZK Tamil Catalog Logo" class="logo-img">
    <h1 class="title">ZK Tamil Catalog</h1>
    <p class="subtitle">Your gateway to Tamil cinema on Stremio</p>
    
    <a href="/configure" class="btn">⚙️ Configure & Install</a>
    
    <div class="features">
      <div class="feature">
        <div class="feature-icon">🎬</div>
        <div class="feature-text">
          <h3>Curated Tamil Movies</h3>
          <p>Browse top-rated, latest releases, and movies organized by decade (1980s-2020s)</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🌐</div>
        <div class="feature-text">
          <h3>Dubbed Content Separation</h3>
          <p>Optional catalog for Tamil dubbed movies from other languages</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🔍</div>
        <div class="feature-text">
          <h3>Search Capability</h3>
          <p>Find any Tamil movie instantly with integrated search</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🚫</div>
        <div class="feature-text">
          <h3>Family Friendly</h3>
          <p>Adult content automatically filtered, safe for all audiences</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <div class="feature-text">
          <h3>Fast & Cached</h3>
          <p>Edge-cached responses for instant loading</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Note:</strong> Install a TMDB metadata addon in Stremio for full movie details</p>
      <p style="margin-top: 10px;">Powered by TMDB • Made with ❤️ for Tamil cinema fans</p>
    </div>
  </div>
</body>
</html>`;

export const configureHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZK Tamil Catalog - Configuration</title>
  <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/zk_tamil_catalog_favicon.ico">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
    .container { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 100%; padding: 40px; }
    .back-link { display: inline-block; margin-bottom: 20px; color: #667eea; text-decoration: none; font-weight: 600; }
    .back-link:hover { text-decoration: underline; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-img { width: 120px; height: auto; margin-bottom: 10px; }
    .logo h1 { color: #667eea; font-size: 2rem; margin-bottom: 5px; }
    .logo p { color: #666; font-size: 0.9rem; }
    .form-group { margin-bottom: 25px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 0.9rem; }
    input[type="text"], input[type="number"] { width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem; transition: border-color 0.3s; }
    input[type="text"]:focus, input[type="number"]:focus { outline: none; border-color: #667eea; }
    .toggle-group { display: flex; align-items: center; justify-content: space-between; }
    .toggle-switch { position: relative; width: 60px; height: 30px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.4s; border-radius: 30px; }
    .slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: white; transition: 0.4s; border-radius: 50%; }
    input:checked + .slider { background-color: #667eea; }
    input:checked + .slider:before { transform: translateX(30px); }
    .install-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .install-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); }
    .success-section { display: none; margin-top: 20px; padding: 20px; background: #f0fdf4; border: 2px solid #86efac; border-radius: 10px; }
    .success-section.show { display: block; }
    .manifest-url { background: white; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 0.85rem; font-family: monospace; margin: 10px 0; border: 1px solid #d1d5db; }
    .button-group { display: flex; gap: 10px; margin-top: 15px; }
    .copy-btn, .open-btn { flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 0.95rem; }
    .copy-btn { background: #667eea; color: white; }
    .copy-btn:hover { background: #5568d3; transform: translateY(-2px); }
    .copy-btn.copied { background: #10b981; }
    .open-btn { background: #764ba2; color: white; }
    .open-btn:hover { background: #653a8a; transform: translateY(-2px); }
    .info { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 10px; font-size: 0.85rem; color: #666; }
    .info a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">← Back to Home</a>
    <div class="logo">
      <img src="https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/Logo.png" alt="ZK Logo" class="logo-img">
      <h1>ZK Tamil Catalog</h1>
      <p>Configure your Tamil movie catalog</p>
    </div>
    <form id="configForm">
      <div class="form-group">
        <label for="apiKey">TMDB API Key *</label>
        <input type="text" id="apiKey" placeholder="Enter your TMDB API key" required>
      </div>
      <div class="form-group">
        <label for="cacheDuration">Cache Duration (seconds)</label>
        <input type="number" id="cacheDuration" value="3600" min="300">
      </div>
      <div class="form-group">
        <div class="toggle-group">
          <label>Include Dubbed Movies</label>
          <label class="toggle-switch">
            <input type="checkbox" id="includeDubbed" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <button type="submit" class="install-btn">📦 Generate Install Link</button>
    </form>
    <div id="successSection" class="success-section">
      <strong>✅ Configuration Ready!</strong>
      <p style="margin: 10px 0; color: #059669;">Your addon manifest URL:</p>
      <div class="manifest-url" id="manifestUrl"></div>
      <div class="button-group">
        <button class="copy-btn" id="copyBtn" type="button">📋 Copy Link</button>
        <button class="open-btn" id="openBtn" type="button">🚀 Install to Stremio</button>
      </div>
    </div>
    <div class="info">
      <strong>ℹ️ How to get TMDB API Key:</strong><br>
      1. Go to <a href="https://www.themoviedb.org/settings/api" target="_blank">TMDB API Settings</a><br>
      2. Sign up/Login and request an API key<br>
      3. Copy and paste it above
    </div>
  </div>
  <script>
    let manifestUrl = '';
    
    document.getElementById('configForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      var config = {
        apiKey: document.getElementById('apiKey').value.trim(),
        cacheDuration: parseInt(document.getElementById('cacheDuration').value),
        includeDubbed: document.getElementById('includeDubbed').checked
      };
      
      var configJson = JSON.stringify(config);
      var encodedConfig = btoa(configJson);
      var workerUrl = window.location.origin;
      manifestUrl = workerUrl + '/' + encodedConfig + '/manifest.json';
      
      document.getElementById('successSection').classList.add('show');
      document.getElementById('manifestUrl').textContent = manifestUrl;
      document.getElementById('successSection').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('copyBtn').addEventListener('click', function() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(manifestUrl).then(function() {
          var btn = document.getElementById('copyBtn');
          var originalText = btn.innerHTML;
          btn.innerHTML = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(function() {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function(err) {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
      
      function fallbackCopy() {
        var textArea = document.createElement('textarea');
        textArea.value = manifestUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Link copied to clipboard!');
        } catch (err) {
          alert('Failed to copy. Please copy manually: ' + manifestUrl);
        }
        document.body.removeChild(textArea);
      }
    });
    
    document.getElementById('openBtn').addEventListener('click', function() {
      var stremioUrl = manifestUrl.replace('https://', '').replace('http://', '');
      window.location.href = 'stremio://' + stremioUrl;
    });
  </script>
</body>
</html>`;
