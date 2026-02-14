export function getManifest(config) {
  const apiKey = config?.apiKey || '';
  
  return {
    id: 'org.zktamil.catalog',
    version: '1.0.0',
    name: 'ZK Tamil Catalog',
    description: 'Pure Tamil movie catalog with dubbed separation',
    logo: 'https://your-logo-url.png',
    background: 'https://your-background-url.png',
    
    resources: ['catalog'],
    types: ['movie'],
    
    catalogs: [
      {
        type: 'movie',
        id: 'tamil_top_rated',
        name: 'Tamil - Top Rated',
        extra: [
          { name: 'skip', isRequired: false },
          { name: 'genre' }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_latest',
        name: 'Tamil - Latest',
        extra: [
          { name: 'skip', isRequired: false },
          { name: 'genre' }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_by_year',
        name: 'Tamil - By Year',
        extra: [
          { name: 'skip', isRequired: false },
          { name: 'genre' }
        ]
      },
      {
        type: 'movie',
        id: 'tamil_dubbed',
        name: 'Tamil Dubbed Movies',
        extra: [
          { name: 'skip', isRequired: false },
          { name: 'genre' }
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
      }
    ],
    
    idPrefixes: ['tmdb:'],
    behaviorHints: {
      configurable: true,
      configurationRequired: true
    }
  };
}
