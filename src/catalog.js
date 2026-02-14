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
        
      case 'tamil_1980s':
        data = await tmdb.get1980s(page);
        break;
        
      case 'tamil_1990s':
        data = await tmdb.get1990s(page);
        break;
        
      case 'tamil_2000s':
        data = await tmdb.get2000s(page);
        break;
        
      case 'tamil_2010s':
        data = await tmdb.get2010s(page);
        break;
        
      case 'tamil_2020s':
        data = await tmdb.get2020s(page);
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
    
    console.log('TMDB returned', data.results.length, 'movies');
    
    const metas = data.results
      .filter(movie => movie.poster_path)
      .map(movie => tmdb.convertToMeta(movie));
    
    console.log('Returning', metas.length, 'movies');
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error.message);
    return { metas: [] };
  }
}
