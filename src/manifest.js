export function getManifest(config) {
  return {
    id: 'org.zktamil.catalog',
    version: '1.1.1',
    name: 'ZK Tamil Catalog',
    description: 'Pure Tamil movie & series catalog with dubbed separation. Install a TMDB metadata addon for full details.',
    
    logo: 'https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/Logo.png',
    background: 'https://raw.githubusercontent.com/zindha/zk-tamil-catalog/refs/heads/main/assets/Logo.png',
    
    resources: ['catalog'],
    types: ['movie', 'series'],
    
    catalogs: [
      // Movies
      {
        type: 'movie',
        id: 'tamil_top_rated',
        name: 'Tamil - Top Rated',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_latest',
        name: 'Tamil - Latest',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_1980s',
        name: 'Tamil - 1980s',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_1990s',
        name: 'Tamil - 1990s',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_2000s',
        name: 'Tamil - 2000s',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_2010s',
        name: 'Tamil - 2010s',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_2020s',
        name: 'Tamil - 2020s',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_dubbed',
        name: 'Tamil Dubbed Movies',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_search',
        name: 'Search Tamil Movies',
        extra: [
          { name: 'search', isRequired: true },
          { name: 'skip', isRequired: false }
        ]
      },
      
      // Series
      {
        type: 'series',
        id: 'tamil_series_trending',
        name: 'Tamil Series - Trending',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'series',
        id: 'tamil_series_popular',
        name: 'Tamil Series - Popular',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      },
      {
        type: 'series',
        id: 'tamil_series_latest',
        name: 'Tamil Series - Latest',
        extra: [
          { name: 'skip', isRequired: false }
        ]
      }
    ],
    
    idPrefixes: ['tmdb:']
  };
}
