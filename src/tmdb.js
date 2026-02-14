const TMDB_BASE = 'https://api.themoviedb.org/3';
const ITEMS_PER_PAGE = 20;

export class TMDBClient {
  constructor(apiKey, cacheDuration = 3600) {
    this.apiKey = apiKey;
    this.cacheDuration = cacheDuration;
  }

  async fetchWithCache(url, cacheKey) {
    // Cloudflare Workers KV or Cache API
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached.json();

    const response = await fetch(url);
    const data = await response.json();
    
    const cacheResponse = new Response(JSON.stringify(data), {
      headers: { 'Cache-Control': `s-maxage=${this.cacheDuration}` }
    });
    await caches.default.put(cacheKey, cacheResponse);
    
    return data;
  }

  async getTopRated(page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`;
    return this.fetchWithCache(url, `top_rated_${page}`);
  }

  async getLatest(page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&sort_by=release_date.desc&page=${page}`;
    return this.fetchWithCache(url, `latest_${page}`);
  }

  async getByYear(year, page = 1) {
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language=ta&primary_release_year=${year}&page=${page}`;
    return this.fetchWithCache(url, `year_${year}_${page}`);
  }

  async getDubbed(page = 1) {
    // Movies dubbed in Tamil (original language != Tamil but available in Tamil)
    const url = `${TMDB_BASE}/discover/movie?api_key=${this.apiKey}&with_original_language_not=ta&with_spoken_languages=ta&sort_by=popularity.desc&page=${page}`;
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
      name: movie.title,
      poster: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      background: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
      description: movie.overview,
      releaseInfo: movie.release_date?.split('-')[0],
      imdbRating: movie.vote_average?.toFixed(1)
    };
  }
}
