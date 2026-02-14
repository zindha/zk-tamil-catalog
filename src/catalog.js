import { TMDBClient } from './tmdb.js';

// Comprehensive adult content filter
const ADULT_KEYWORDS = [
  // Explicit terms
  'erotic', 'erotica', 'softcore', 'hardcore', 'porn', 'pornographic',
  'xxx', 'adult film', 'sex film', 'blue film',
  
  // Specific known adult Tamil movies
  'shanthi appuram nithya', 'anagarigam', 'anaagarigam',
  'hot night', 'midnight', 'masala', 'b grade', 'b-grade',
  
  // Suggestive patterns
  'affair', 'bedroom', 'seduction', 'temptation',
  'desire', 'lust', 'passion', 'intimate',
  
  // Common adult movie title patterns
  'hot', 'sexy', 'bold', 'uncensored', 'uncut',
  'after dark', 'forbidden',
  
  // Director/production patterns known for adult content
  'bala singh', 'ram gopal varma ki aag'
];

// Additional check: movies with very specific genre combinations
const SUSPICIOUS_PATTERNS = [
  // Very low vote count + low rating
  { maxVotes: 20, maxRating: 4.0 },
  // Romance + Thriller with very low popularity
  { genreCheck: [10749, 53], maxPopularity: 2.0 }
];

function isAdultContent(movie) {
  // 1. Check explicit adult flag
  if (movie.adult === true) {
    console.log('Adult flag:', movie.title);
    return true;
  }
  
  // 2. Check title for adult keywords
  const title = (movie.title || movie.original_title || '').toLowerCase();
  for (const keyword of ADULT_KEYWORDS) {
    if (title.includes(keyword)) {
      console.log('Adult keyword in title:', movie.title, '- keyword:', keyword);
      return true;
    }
  }
  
  // 3. Check description for adult keywords
  const overview = (movie.overview || '').toLowerCase();
  const explicitKeywords = ['erotic', 'erotica', 'softcore', 'hardcore', 'porn', 'xxx', 'adult film', 'sex'];
  for (const keyword of explicitKeywords) {
    if (overview.includes(keyword)) {
      console.log('Adult keyword in overview:', movie.title, '- keyword:', keyword);
      return true;
    }
  }
  
  // 4. Very low quality filter (likely poor quality or adult B-movies)
  // Movies with very few votes AND very low rating
  if (movie.vote_count && movie.vote_count < 15 && movie.vote_average && movie.vote_average < 3.5) {
    console.log('Low quality/obscure:', movie.title, '- votes:', movie.vote_count, 'rating:', movie.vote_average);
    return true;
  }
  
  // 5. Check for suspicious patterns: very low popularity + specific genre mix
  if (movie.popularity && movie.popularity < 1.0 && movie.vote_count && movie.vote_count < 10) {
    console.log('Very low popularity/obscure:', movie.title, '- popularity:', movie.popularity);
    return true;
  }
  
  return false;
}

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
    
    // Comprehensive filtering
    const metas = data.results
      .filter(movie => {
        // Must have poster
        if (!movie.poster_path) {
          return false;
        }
        
        // Check for adult content using multiple criteria
        if (isAdultContent(movie)) {
          return false;
        }
        
        return true;
      })
      .map(movie => tmdb.convertToMeta(movie));
    
    const filteredCount = data.results.length - metas.length;
    console.log('Returning', metas.length, 'movies');
    console.log('Filtered out', filteredCount, 'movies');
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error.message);
    return { metas: [] };
  }
}
