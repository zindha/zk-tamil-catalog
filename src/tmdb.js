const TMDB_BASE = 'https://api.themoviedb.org/3';

export class TMDBClient {
  constructor(apiKey, cacheDuration = 3600) {
    this.apiKey = apiKey;
    this.cacheDuration = cacheDuration;
  }

  async fetchWithCache(url, cacheKey) {
    try {
      // Try to get from cache first
      const cache = caches.default;
      const cacheUrl = new URL(`https://cache.local/${cacheKey}`);
      
      let response = await cache.match(cacheUrl);
      
      if (response) {
        console.log('Cache HIT:', cacheKey);
        return await response.json();
      }
      
      console.log('Cache MISS:', cacheKey);
      
      // Fetch from TMDB
      response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store in cache
      const cacheResponse = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${this.cacheDuration}`
        }
      });
      
      await cache.put(cacheUrl, cacheResponse);
      
      return data;
      
    } catch (error) {
      console.error('TMDB fetch error:', error);
      throw error;
    }
  }

  async getTopRated(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=50&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url, `top_rated_ta_p${page}`);
  }

  async getLatest(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=release_date.desc&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url, `latest_ta_p${page}`);
  }

  async getByYear(year, page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&primary_release_year=${year}&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=40`;
    return this.fetchWithCache(url, `year_${year}_ta_p${page}`);
  }

  async getDubbed(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=hi&with_spoken_languages=ta&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url, `dubbed_ta_p${page}`);
  }

  async search(query, page = 1) {
    const url = `${TMDB_BASE}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`;
    return this.fetchWithCache(url, `search_${query}_p${page}`);
  }

  async getImdbId(tmdbId) {
    try {
      const url = `${TMDB_BASE}/movie/${tmdbId}/external_ids?api_key=${this.apiKey}`;
      const data = await this.fetchWithCache(url, `imdb_${tmdbId}`);
      return data.imdb_id || null;
    } catch (error) {
      console.error('Failed to get IMDB ID for TMDB:', tmdbId);
      return null;
    }
  }

  convertToMeta(movie, imdbId = null) {
    const id = imdbId || `tmdb:${movie.id}`;
    
    const meta = {
      id: id,
      type: 'movie',
      name: movie.title || movie.original_title || 'Unknown',
      poster: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      background: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : undefined,
      description: movie.overview || 'No description available',
      releaseInfo: movie.release_date ? movie.release_date.split('-')[0] : undefined,
      imdbRating: movie.vote_average && movie.vote_average > 0 ? movie.vote_average.toFixed(1) : undefined
    };
    
    Object.keys(meta).forEach(key => meta[key] === undefined && delete meta[key]);
    
    return meta;
  }
}
