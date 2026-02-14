const TMDB_BASE = 'https://api.themoviedb.org/3';

export class TMDBClient {
  constructor(apiKey, cacheDuration = 3600) {
    this.apiKey = apiKey;
    this.cacheDuration = cacheDuration;
  }

  async fetchWithCache(url, cacheKey) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB fetch error:', error);
      throw error;
    }
  }

  async getTopRated(page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=50&page=${page}`;
    return this.fetchWithCache(url, `top_rated_${page}`);
  }

  async getLatest(page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=release_date.desc&page=${page}`;
    return this.fetchWithCache(url, `latest_${page}`);
  }

  async getByYear(year, page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`;
    return this.fetchWithCache(url, `year_${year}_${page}`);
  }

  async getDubbed(page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=hi&with_translations=ta&sort_by=popularity.desc&page=${page}`;
    return this.fetchWithCache(url, `dubbed_${page}`);
  }

  async search(query, page = 1) {
    const url = `${TMDB_BASE}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=ta&page=${page}`;
    return this.fetchWithCache(url, `search_${query}_${page}`);
  }

  convertToMeta(movie) {
    return {
      id: `tmdb:${movie.id}`,
      type: 'movie',
      name: movie.title || movie.original_title,
      poster: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      background: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : undefined,
      description: movie.overview || 'No description available',
      releaseInfo: movie.release_date ? movie.release_date.split('-')[0] : undefined,
      imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : undefined
    };
  }
}
