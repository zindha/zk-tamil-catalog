const TMDB_BASE = 'https://api.themoviedb.org/3';

export class TMDBClient {
  constructor(apiKey, cacheDuration = 3600) {
    this.apiKey = apiKey;
    this.cacheDuration = cacheDuration;
  }

  async fetchWithCache(url) {
    try {
      console.log('Fetching TMDB URL:', url.replace(this.apiKey, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TMDB API error:', response.status, errorText);
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('TMDB response:', data.total_results, 'total results');
      return data;
      
    } catch (error) {
      console.error('TMDB fetch error:', error);
      throw error;
    }
  }

  async getTopRated(page = 1) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&language=en-US&with_runtime.gte=60&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async getLatest(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=release_date.desc&page=${page}&language=en-US&with_runtime.gte=60&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async getByYear(year, page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&primary_release_year=${year}&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=60`;
    return this.fetchWithCache(url);
  }

  async getDubbed(page = 1) {
    const today = new Date().toISOString().split('T')[0];
    
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=hi&with_spoken_languages=ta&sort_by=popularity.desc&page=${page}&language=en-US&with_runtime.gte=60&release_date.lte=${today}`;
    return this.fetchWithCache(url);
  }

  async search(query, page = 1) {
    const url = `${TMDB_BASE}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`;
    return this.fetchWithCache(url);
  }

  convertToMeta(movie) {
    // Additional client-side filtering
    const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
    const today = new Date();
    
    // Skip if release date is in the future
    if (releaseDate && releaseDate > today) {
      return null;
    }
    
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
      imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : undefined,
      genres: movie.genre_ids || []
    };
    
    // Remove undefined values
    Object.keys(meta).forEach(key => meta[key] === undefined && delete meta[key]);
    
    return meta;
  }
}
