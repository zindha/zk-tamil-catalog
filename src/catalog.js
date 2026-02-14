import { TMDBClient } from './tmdb.js';

export async function handleCatalog(type, id, extra, config) {
  console.log('=== CATALOG HANDLER START ===');
  console.log('Type:', type);
  console.log('ID:', id);
  console.log('Extra:', JSON.stringify(extra));
  console.log('Config keys:', Object.keys(config));
  console.log('Has API key:', !!config?.apiKey);
  
  // Check if API key exists
  if (!config || !config.apiKey) {
    console.error('CRITICAL: No API key in config!');
    console.error('Config object:', JSON.stringify(config));
    return { 
      metas: []
    };
  }
  
  console.log('API key found, length:', config.apiKey.length);
  
  try {
    const tmdb = new TMDBClient(config.apiKey, config.cacheDuration || 3600);
    const page = Math.floor((parseInt(extra.skip) || 0) / 20) + 1;
    
    let data;
    
    switch(id) {
      case 'tamil_top_rated':
        console.log('Fetching TOP RATED, page:', page);
        data = await tmdb.getTopRated(page);
        break;
        
      case 'tamil_latest':
        console.log('Fetching LATEST, page:', page);
        data = await tmdb.getLatest(page);
        break;
        
      case 'tamil_by_year':
        const year = extra.year || new Date().getFullYear();
        console.log('Fetching BY YEAR:', year, 'page:', page);
        data = await tmdb.getByYear(year, page);
        break;
        
      case 'tamil_dubbed':
        if (!config.includeDubbed) {
          console.log('Dubbed movies disabled');
          return { metas: [] };
        }
        console.log('Fetching DUBBED, page:', page);
        data = await tmdb.getDubbed(page);
        break;
        
      case 'tamil_search':
        if (!extra.search) {
          return { metas: [] };
        }
        console.log('SEARCHING:', extra.search, 'page:', page);
        data = await tmdb.search(extra.search, page);
        break;
        
      default:
        console.error('Unknown catalog ID:', id);
        return { metas: [] };
    }
    
    console.log('TMDB response received');
    console.log('Results count:', data?.results?.length || 0);
    
    if (!data || !data.results || data.results.length === 0) {
      console.warn('No results from TMDB');
      return { metas: [] };
    }
    
    const metas = data.results
      .filter(movie => movie.poster_path)
      .map(movie => tmdb.convertToMeta(movie));
    
    console.log('Final metas count:', metas.length);
    console.log('=== CATALOG HANDLER END ===');
    
    return { metas };
    
  } catch (error) {
    console.error('CATALOG ERROR:', error.message);
    console.error('Stack:', error.stack);
    return { 
      metas: []
    };
  }
}
