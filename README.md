# 🎬 ZK Tamil Catalog - Stremio Addon

<p align="center">
  <img src="https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/Logo.png" alt="ZK Tamil Catalog Logo" width="200"/>
</p>

<p align="center">
  <strong>Your gateway to Tamil cinema on Stremio</strong>
</p>

<p align="center">
  <a href="https://zk-tamil-catalog.zindhak1928.workers.dev/">🌐 Live Demo</a> •
  <a href="https://zk-tamil-catalog.zindhak1928.workers.dev/configure">⚙️ Configure & Install</a>
</p>

---

## 📋 Overview

ZK Tamil Catalog is a Stremio addon that provides curated Tamil movie and web series catalogs. Browse Tamil cinema from the 1980s to 2020s, discover trending web series, and search through thousands of Tamil movies - all powered by TMDB API.

### ⚠️ Important Note

This addon provides **catalogs only**. To view full movie/series details (cast, plot, trailers, ratings), you **must** install a TMDB metadata addon:
- Open Stremio → Addons → Community Addons
- Search for "TMDB" and install **"TMDB Catalog"** or **"TMDB Addon"**

---

## ✨ Features

### 🎬 Movies
- **Top Rated** - Highest-rated Tamil movies
- **Latest Releases** - Newest Tamil films
- **Movies by Decade** - Browse by 1980s, 1990s, 2000s, 2010s, 2020s
- **Dubbed Movies** - Tamil dubbed content from other languages (optional)
- **Search** - Find any Tamil movie instantly

### 📺 Series
- **Trending** - Currently hot Tamil web series (last 3 months)
- **Popular** - All-time favorite Tamil series
- **Latest** - Newest Tamil web series releases

### 🛡️ Content Filtering
- ✅ Adult content automatically filtered
- ✅ TV serials excluded (web series only)
- ✅ Reality shows included, talk shows filtered
- ✅ 100% Tamil language content
- ✅ Quality filtering for better recommendations

### ⚡ Performance
- Edge-cached responses for instant loading
- Cloudflare Workers deployment
- Global CDN distribution
- 1-hour cache duration (configurable)

---

## 🚀 Installation

### For Users

1. **Visit the configuration page**: [Configure ZK Tamil Catalog](https://zk-tamil-catalog.zindhak1928.workers.dev/configure)

2. **Get a TMDB API Key**:
   - Go to [TMDB API Settings](https://www.themoviedb.org/settings/api)
   - Sign up/Login and request an API key
   - Copy your API key

3. **Configure the addon**:
   - Paste your TMDB API key
   - Set cache duration (default: 3600 seconds)
   - Toggle "Include Dubbed Movies" if desired
   - Click "Generate Install Link"

4. **Install to Stremio**:
   - Click "Install to Stremio" button
   - Or copy the manifest URL and paste in Stremio

5. **Install TMDB Metadata Addon** (Required):
   - Open Stremio → Addons → Community Addons
   - Search "TMDB"
   - Install "TMDB Catalog" or "TMDB Addon"

---

## 🛠️ Development

### Prerequisites
- Node.js 16+ (for local development)
- Cloudflare account (for deployment)
- TMDB API key

### Project Structure
zk-tamil-catalog/
├── src/
│ ├── worker.js # Main Cloudflare Worker entry point
│ ├── manifest.js # Stremio manifest definition
│ ├── catalog.js # Catalog handler with filtering logic
│ ├── tmdb.js # TMDB API client with caching
│ └── pages.js # Landing page HTML templates
├── assets/
│ ├── Logo.png # Addon logo
│ └── zk_tamil_catalog_favicon.ico # Favicon
├── wrangler.toml # Cloudflare Workers configuration
└── package.json # Node.js dependencies

text

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/zindha/zk-tamil-catalog.git
cd zk-tamil-catalog
Install dependencies:

bash
npm install
Run locally (with Wrangler):

bash
npx wrangler dev
Test the addon:

Visit http://localhost:8787/

Configure with your TMDB API key

Test manifest: http://localhost:8787/YOUR_CONFIG/manifest.json

Deployment
Deploy to Cloudflare Workers
Login to Cloudflare:

bash
npx wrangler login
Deploy:

bash
npx wrangler deploy
Your addon is live!

text
https://zk-tamil-catalog.YOUR_SUBDOMAIN.workers.dev/
Deploy via GitHub Actions (Automated)
This repository is configured for automatic deployment on push to main branch.

Set up GitHub Secrets:

Go to Repository Settings → Secrets and Variables → Actions

Add CLOUDFLARE_API_TOKEN with your Cloudflare API token

Add CLOUDFLARE_ACCOUNT_ID with your Cloudflare account ID

Push to main branch:

bash
git push origin main
Automatic deployment will trigger via GitHub Actions

🔧 Configuration
Manifest Configuration
Users configure the addon with:

TMDB API Key (required) - Your TMDB API v3 key

Cache Duration (optional) - Default: 3600 seconds (1 hour)

Include Dubbed Movies (optional) - Toggle Tamil dubbed content

Content Filters
The addon applies several filters to ensure quality content:

Movie Filters:
Adult content keywords in title/description

Movies with <15 votes AND <3.5 rating

Movies with <1.0 popularity AND <10 votes

Explicit adult film markers

Series Filters:
Non-Tamil language content

TV serials with 100+ episodes

Long-running scripted series (3+ seasons)

Talk shows and interview programs

Reality shows are included (Bigg Boss, Cooku with Comali, etc.)

📊 API Endpoints
Landing Page
text
GET /
Returns the main landing page with addon information.

Configuration Page
text
GET /configure
Returns the configuration form for users to set up the addon.

Manifest
text
GET /{base64Config}/manifest.json
Returns the Stremio manifest with user configuration.

Catalog
text
GET /{base64Config}/catalog/{type}/{id}.json
GET /{base64Config}/catalog/{type}/{id}/skip={offset}.json
GET /{base64Config}/catalog/{type}/{id}/search={query}.json
Returns catalog results (movies or series).

🎨 Catalogs
Movie Catalogs
ID	Name	Description
tamil_top_rated	Tamil - Top Rated	Highest-rated Tamil movies (50+ votes)
tamil_latest	Tamil - Latest	Latest Tamil movie releases
tamil_1980s	Tamil - 1980s	Tamil movies from 1980-1989
tamil_1990s	Tamil - 1990s	Tamil movies from 1990-1999
tamil_2000s	Tamil - 2000s	Tamil movies from 2000-2009
tamil_2010s	Tamil - 2010s	Tamil movies from 2010-2019
tamil_2020s	Tamil - 2020s	Tamil movies from 2020-2029
tamil_dubbed	Tamil Dubbed Movies	Tamil dubbed from other languages
tamil_search	Search Tamil Movies	Search functionality
Series Catalogs
ID	Name	Description
tamil_series_trending	Tamil Series - Trending	Hot series from last 3 months
tamil_series_popular	Tamil Series - Popular	All-time popular Tamil series
tamil_series_latest	Tamil Series - Latest	Newest Tamil series releases
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

How to Contribute:
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Ideas for Contributions:
Add more decade-based catalogs

Improve content filtering algorithms

Add support for other regional Indian languages

Enhance UI/UX of landing pages

Add more series categories

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
TMDB - For providing the movie/series database API

Stremio - For the amazing streaming platform

Cloudflare Workers - For serverless edge computing

Tamil Cinema - For decades of amazing content

📞 Support
Issues: GitHub Issues

Discussions: GitHub Discussions

⚖️ Disclaimer
This product uses the TMDB API but is not endorsed or certified by TMDB. This addon is a catalog provider only and does not host, stream, or provide any copyrighted content. Users are responsible for ensuring they have the legal right to access content through their own streaming providers.

<p align="center"> Made with ❤️ for Tamil cinema fans </p> <p align="center"> <a href="https://www.themoviedb.org/"> <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" width="100"/> </a> </p> ```
This README includes:

✅ Clear overview and features

✅ Step-by-step installation instructions

✅ Development setup guide

✅ Deployment instructions

✅ API documentation

✅ Catalog reference table

✅ Contributing guidelines

✅ Professional formatting with badges and images

✅ Proper acknowledgments and disclaimers
