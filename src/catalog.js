import { TMDBClient } from './tmdb.js';

// Adult content filter
const ADULT_KEYWORDS = [
  // Explicit terms
  'erotic', 'erotica', 'softcore', 'hardcore', 'porn', 'pornographic',
  'xxx', 'adult film', 'sex film', 'blue film',
  
  // Specific known adult Tamil movies
  'shanthi appuram nithya', 'anaagarigam',
  'hot night', 'midnight', 'masala', 'b grade', 'b-grade',
  
  // Suggestive patterns
  'affair', 'bedroom', 'seduction', 'temptation',
  'desire', 'lust', 'passion', 'intimate',
  
  // Common adult movie title patterns
  'hot', 'sexy', 'bold', 'uncensored', 'uncut',
  'after dark', 'midnight', 'forbidden'
];

// Talk shows and interview programs to filter
const TALK_SHOW_KEYWORDS = [
  // Talk shows and interviews
  'neeya naana', 'koffee with', 'coffee with',
  'interview with', 'in conversation',
  'special interview', 'exclusive interview',
  
  // Award shows and special events
  'vijay television awards', 'zee tamil awards',
  'filmfare awards', 'awards ceremony',
  
  // Making of / Behind the scenes
  'making of', 'behind the scenes',
  'special', 'tribute to'
];

// TV serial patterns (daily soaps)
const TV_SERIAL_KEYWORDS = [
  // Common Tamil TV serial words
  'serial', 'sun tv', 'vijay tv', 'zee tamil',
  'colors tamil', 'star vijay',
  
  // Typical serial title patterns
  'vamsam', 'bharathi kannamma', 'pandian stores',
  'raja rani', 'baakiyalakshmi', 'sembaruthi',
  'mullum malarum', 'chinna thambi', 'ganga',
  'vanathai pola', 'eeramana rojave', 'roja',
  'deivam thandha veedu', 'saravanan meenatchi'
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
  
  // 4. Very low quality filter
  if (movie.vote_count && movie.vote_count < 15 && movie.vote_average && movie.vote_average < 3.5) {
    console.log('Low quality/obscure:', movie.title, '- votes:', movie.vote_count, 'rating:', movie.vote_average);
    return true;
  }
  
  // 5. Very low popularity filter
  if (movie.popularity && movie.popularity < 1.0 && movie.vote_count && movie.vote_count < 10) {
    console.log('Very low popularity/obscure:', movie.title, '- popularity:', movie.popularity);
    return true;
  }
  
  return false;
}

function isTalkShowOrSerial(series) {
  const name = (series.name || series.original_name || '').toLowerCase();
  const overview = (series.overview || '').toLowerCase();
  
  // 1. Check for talk shows
  for (const keyword of TALK_SHOW_KEYWORDS) {
    if (name.includes(keyword) || overview.includes(keyword)) {
      console.log('Talk show filtered:', series.name, '- keyword:', keyword);
      return true;
    }
  }
  
  // 2. Check for TV serials (daily soaps)
  for (const keyword of TV_SERIAL_KEYWORDS) {
    if (name.includes(keyword)) {
      console.log('TV serial filtered:', series.name, '- keyword:', keyword);
      return true;
    }
  }
  
  // 3. Filter by episode count - TV serials typically have 100+ episodes
  if (series.number_of_episodes && series.number_of_episodes > 100) {
    console.log('TV serial filtered (too many episodes):', series.name, '- episodes:', series.number_of_episodes);
    return true;
  }
  
  // 4. Filter by type - exclude scripted TV shows, keep only limited series/miniseries
  // Scripted series = 0 (Scripted), Documentary = 1, Reality = 2, Talk Show = 3
  // We want to keep Reality (2) and filter Talk Show (3)
  if (series.type === 'Scripted' && series.number_of_seasons && series.number_of_seasons > 3) {
    console.log('Long-running scripted series filtered:', series.name, '- seasons:', series.number_of_seasons);
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
    let isSeries = false;
    
    switch(id) {
      // Movies
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
        
      // Series
      case 'tamil_series_trending':
        data = await tmdb.getSeriesTrending(page);
        isSeries = true;
        break;
        
      case 'tamil_series_popular':
        data = await tmdb.getSeriesPopular(page);
        isSeries = true;
        break;
        
      case 'tamil_series_latest':
        data = await tmdb.getSeriesLatest(page);
        isSeries = true;
        break;
        
      default:
        return { metas: [] };
    }
    
    if (!data || !data.results || data.results.length === 0) {
      return { metas: [] };
    }
    
    console.log('TMDB returned', data.results.length, isSeries ? 'series' : 'movies');
    
    // Filter and convert
    let metas;
    
    if (isSeries) {
      metas = data.results
        .filter(series => {
          // Must have poster
          if (!series.poster_path) return false;
          
          // Filter talk shows and TV serials
          if (isTalkShowOrSerial(series)) return false;
          
          return true;
        })
        .map(series => tmdb.convertToSeriesMeta(series));
    } else {
      metas = data.results
        .filter(movie => {
          // Must have poster
          if (!movie.poster_path) return false;
          
          // Check for adult content
          if (isAdultContent(movie)) return false;
          
          return true;
        })
        .map(movie => tmdb.convertToMeta(movie));
    }
    
    const filteredCount = data.results.length - metas.length;
    console.log('Returning', metas.length, isSeries ? 'series' : 'movies');
    console.log('Filtered out', filteredCount, 'items');
    
    return { metas };
    
  } catch (error) {
    console.error('Catalog error:', error.message);
    return { metas: [] };
  }
}
