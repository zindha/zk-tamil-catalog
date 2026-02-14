import { TMDBClient } from './tmdb.js';

export async function handleCatalog(type, id, extra, config) {
  console.log('Catalog request:', { type, id, extra, config: { ...config, apiKey: config.apiKey ? 'SET' : 'NOT SET' } });
  
  // Check if API key exists
  if (!config || !config.apiKey) {
    console.error('No API key provided');
    return { 
      metas: [],
      error: 'TMDB API key not configured'
    };
  }
  
  const tmdb = new TMDBClient(config.apiKey, config.cacheDuration || 3600);
  const page = Math.floor((parseInt(extra.skip) || 0) / 20) + 1;
  
  let data;
  
  try {
    switch(id) {
      case 'tamil_top_rated':
        console.log('Fetching top rated, page:', page);
        data = await tmdb.getTopRated(page);
        break;
        
      case 'tamil_latest':
        console.log('Fetching latest, page:', page);
        data = await tmdb.getLatest(page);
        break;
        
      case 'tamil_by_year':
        const year = extra.year || new Date().getFullYear();
        console.log('Fetching by year:', year, 'page:', page);
        data = await tmdb.getByYear(year, page);
        break;
        
      case 'tamil_dubbed':
        if (!config.includeDubbed) {
          console.log('Dubbed movies disabled in config');
          return { metas: [] };
        }
        console.log('Fetching dubbed, page:', page);
        data = await tmdb.getDubbed(page);
        break;
        
      case 'tamil_search':
        if (!extra.search) {
          return { metas: [] };
        }
        console.log('Searching:', extra.search, 'page:', page);
        data = await tmdb.search(extra.search, page);
        break;
        
      default:
        console.error('Unknown catalog ID:', id);
        return { metas: [] };
    }
    
    if (!data || !data.results) {
      console.error('No results from TMDB:', data);
      return { metas: [] };
    }
    
    console.log('TMDB returned', data.results.length, 'movies');
    
    const metas = data.results
      .filter(movie => movie.poster_path)
      .map(movie => tmdb.convertToMeta(movie));
    
    console.log('Converted to', metas.length, 'metas');
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error.message, error.stack);
    return { 
      metas: [],
      error: error.message 
    };
  }
}
