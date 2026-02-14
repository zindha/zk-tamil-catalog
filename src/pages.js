export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZK Tamil Catalog - Stremio Addon</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary-color: #667eea;
      --secondary-color: #764ba2;
      --text-dark: #2d3748;
      --text-light: #718096;
      --bg-light: #f7fafc;
      --card-bg: #ffffff;
      --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 40px rgba(102, 126, 234, 0.2);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: var(--text-dark);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    .hero {
      min-height: 100vh;
      padding: 40px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      max-width: 1200px;
      width: 100%;
    }

    .brand {
      text-align: center;
      margin-bottom: 60px;
      animation: fadeInDown 0.8s ease;
    }

    .logo-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .brand h1 {
      font-size: 3.5rem;
      color: white;
      margin-bottom: 10px;
      font-weight: 800;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .tagline {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 50px;
      animation: fadeInUp 0.8s ease 0.2s both;
    }

    .feature-card {
      background: var(--card-bg);
      padding: 30px;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      text-align: center;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }

    .feature-card h3 {
      color: var(--text-dark);
      margin-bottom: 10px;
      font-size: 1.3rem;
    }

    .feature-card p {
      color: var(--text-light);
      font-size: 0.95rem;
    }

    .cta-section {
      text-align: center;
      margin: 50px 0;
      animation: fadeInUp 0.8s ease 0.4s both;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: white;
      color: var(--primary-color);
      padding: 18px 40px;
      border-radius: 50px;
      font-size: 1.2rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 15px 50px rgba(255, 255, 255, 0.3);
    }

    .help-text {
      margin-top: 15px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    .info-section {
      background: white;
      padding: 50px;
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
      margin: 50px 0;
      animation: fadeInUp 0.8s ease 0.6s both;
    }

    .info-section h2 {
      text-align: center;
      color: var(--text-dark);
      font-size: 2rem;
      margin-bottom: 40px;
    }

    .info-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .info-item {
      padding: 20px;
      border-left: 4px solid var(--primary-color);
      background: var(--bg-light);
      border-radius: 8px;
    }

    .info-item strong {
      display: block;
      color: var(--primary-color);
      margin-bottom: 8px;
      font-size: 1.1rem;
    }

    .info-item p {
      color: var(--text-light);
      font-size: 0.95rem;
    }

    .tech-stack {
      text-align: center;
      margin-top: 50px;
      animation: fadeInUp 0.8s ease 0.8s both;
    }

    .tech-stack h3 {
      color: white;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
    }

    .badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    footer {
      text-align: center;
      padding: 30px 20px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    .disclaimer {
      margin-top: 10px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .brand h1 { font-size: 2.5rem; }
      .tagline { font-size: 1.1rem; }
      .logo-icon { font-size: 4rem; }
      .features-grid { grid-template-columns: 1fr; }
      .info-section { padding: 30px 20px; }
      .info-content { grid-template-columns: 1fr; }
      .cta-button { padding: 15px 30px; font-size: 1.1rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="brand">
        <div class="logo-icon">🎬</div>
        <h1>ZK Tamil Catalog</h1>
        <p class="tagline">Your Ultimate Tamil Movie Catalog for Stremio</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3>Top Rated</h3>
          <p>Browse highest-rated Tamil movies</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🆕</div>
          <h3>Latest Releases</h3>
          <p>Stay updated with new Tamil movies</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>Year-wise Browse</h3>
          <p>Explore movies by release year</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>Dubbed Movies</h3>
          <p>Separate catalog for Tamil-dubbed content</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Smart Search</h3>
          <p>Find any Tamil movie instantly</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">♾️</div>
          <h3>Infinite Scroll</h3>
          <p>Seamless pagination support</p>
        </div>
      </div>
      
      <div class="cta-section">
        <a href="/configure" class="cta-button">
          <span>🚀 Configure & Install</span>
        </a>
        <p class="help-text">Requires a free TMDB API key</p>
      </div>
      
      <div class="info-section">
        <h2>Why ZK Tamil Catalog?</h2>
        <div class="info-content">
          <div class="info-item">
            <strong>🎯 Pure Tamil Focus</strong>
            <p>Exclusively curated Tamil movies with proper language filtering</p>
          </div>
          <div class="info-item">
            <strong>⚡ Lightning Fast</strong>
            <p>Powered by Cloudflare Workers edge network for instant loading</p>
          </div>
          <div class="info-item">
            <strong>🔒 Privacy First</strong>
            <p>Your TMDB API key stays with you - encoded in your personal addon URL</p>
          </div>
          <div class="info-item">
            <strong>💾 Smart Caching</strong>
            <p>Configurable cache duration to reduce API calls and improve speed</p>
          </div>
        </div>
      </div>
      
      <div class="tech-stack">
        <h3>Built With</h3>
        <div class="tech-badges">
          <span class="badge">Cloudflare Workers</span>
          <span class="badge">TMDB API</span>
          <span class="badge">Stremio Protocol</span>
          <span class="badge">Edge Caching</span>
        </div>
      </div>
    </div>
  </div>
  
  <footer>
    <p>Made with ❤️ for Tamil cinema lovers | Open Source Project</p>
    <p class="disclaimer">This addon does not provide streams. It's a catalog-only addon for movie discovery.</p>
  </footer>
</body>
</html>`;

export const configureHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZK Tamil Catalog - Configuration</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 500px;
      width: 100%;
      padding: 40px;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .logo {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo h1 {
      color: #667eea;
      font-size: 2rem;
      margin-bottom: 5px;
    }

    .logo p {
      color: #666;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 25px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
      font-size: 0.9rem;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="number"]:focus {
      outline: none;
      border-color: #667eea;
    }

    .toggle-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .toggle-switch {
      position: relative;
      width: 60px;
      height: 30px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 30px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #667eea;
    }

    input:checked + .slider:before {
      transform: translateX(30px);
    }

    .install-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .install-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .success-section {
      display: none;
      margin-top: 20px;
      padding: 20px;
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 10px;
    }

    .success-section.show {
      display: block;
    }

    .manifest-url {
      background: white;
      padding: 12px;
      border-radius: 8px;
      word-break: break-all;
      font-size: 0.85rem;
      font-family: monospace;
      margin: 10px 0;
      border: 1px solid #d1d5db;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .copy-btn, .open-btn {
      
