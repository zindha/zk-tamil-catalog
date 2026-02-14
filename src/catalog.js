import { TMDBClient } from './tmdb.js';

export async function handleCatalog(type, id, extra, config) {
  console.log('Catalog request:', type, id);
  
  if (!config || !config.apiKey) {
    console.error('No API key provided');
    return { metas: [] };
  }
  
  try {
    const tmdb = new TMDBClient(config.apiKey, config.cacheDuration || 3600);
    const page = Math.floor((parseInt(extra.skip) || 0) / 20) + 1;
    
    let data;
    
    switch(id) {
      case 'tamil_top_rated':
        data = await tmdb.getTopRated(page);
        break;
        
      case 'tamil_latest':
        data = await tmdb.getLatest(page);
        break;
        
      case 'tamil_by_year':
        const year = extra.year || new Date().getFullYear();
        data = await tmdb.getByYear(year, page);
        break;
        
      case 'tamil_dubbed':
        if (!config.includeDubbed) {
          return { metas: [] };
        }
        data = await tmdb.getDubbed(page);
        break;
        
      case 'tamil_search':
        if (!extra.search) {
          return { metas: [] };
        }
        data = await tmdb.search(extra.search, page);
        break;
        
      default:
        return { metas: [] };
    }
    
    if (!data || !data.results || data.results.length === 0) {
      return { metas: [] };
    }
    
    // Simple filtering: just poster and basic validation
    const metas = data.results
      .filter(movie => movie.poster_path) // Must have poster
      .map(movie => tmdb.convertToMeta(movie));
    
    console.log('Returning', metas.length, 'movies');
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error.message);
    return { metas: [] };
  }
}
