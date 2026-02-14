import { TMDBClient } from './tmdb.js';

export async function handleCatalog(type, id, extra, config) {
  const tmdb = new TMDBClient(config.apiKey, config.cacheDuration || 3600);
  
  const page = Math.floor((extra.skip || 0) / 20) + 1;
  
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
      data = await tmdb.getDubbed(page);
      break;
      
    case 'tamil_search':
      if (!extra.search) return { metas: [] };
      data = await tmdb.search(extra.search, page);
      break;
      
    default:
      return { metas: [] };
  }
  
  const metas = data.results.map(movie => tmdb.convertToMeta(movie));
  
  return { metas };
}
