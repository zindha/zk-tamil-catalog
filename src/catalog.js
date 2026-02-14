import { TMDBClient } from './tmdb.js';

export async function handleCatalog(type, id, extra, config) {
  if (!config.apiKey) {
    return { metas: [] };
  }
  
  const tmdb = new TMDBClient(config.apiKey, config.cacheDuration || 3600);
  
  const page = Math.floor((parseInt(extra.skip) || 0) / 20) + 1;
  
  let data;
  
  try {
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
    
    if (!data || !data.results) {
      return { metas: [] };
    }
    
    const metas = data.results
      .filter(movie => movie.poster_path) // Only movies with posters
      .map(movie => tmdb.convertToMeta(movie));
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error);
    return { metas: [] };
  }
}
