const TMDB_BASE = 'https://api.themoviedb.org/3';

export class TMDBClient {
  constructor(apiKey, cacheDuration = 3600) {
    this.apiKey = apiKey;
    this.cacheDuration = cacheDuration;
  }

  async fetchWithCache(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('TMDB fetch error:', error);
      throw error;
    }
  }

  async getTopRated(page = 1) {
    // Only filter: released movies, runtime 40+ min (to exclude shorts), minimum votes
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=50&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async getLatest(page = 1) {
    // Less strict: 40+ minutes, released movies
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=release_date.desc&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async getByYear(year, page = 1) {
    // Year-based, 40+ minutes
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&primary_release_year=${year}&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=40`;
    return this.fetchWithCache(url);
  }

  async getDubbed(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=hi&with_spoken_languages=ta&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=40&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async search(query, page = 1) {
    // Search doesn't filter by runtime or release date initially
    const url = `${TMDB_BASE}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`;
    return this.fetchWithCache(url);
  }

  convertToMeta(movie) {
    const meta = {
      id: `tmdb:${movie.id}`,
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
    
    // Remove undefined values
    Object.keys(meta).forEach(key => meta[key] === undefined && delete meta[key]);
    
    return meta;
  }
}
