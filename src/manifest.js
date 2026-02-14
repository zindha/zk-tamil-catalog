export function getManifest(config) {
  return {
    id: 'org.zktamil.catalog',
    version: '1.0.2',
    name: 'ZK Tamil Catalog',
    description: 'Pure Tamil movie catalog with dubbed separation',
    logo: 'https://i.imgur.com/your-logo.png',
    
    resources: ['catalog'],
    types: ['movie'],
    
    catalogs: [
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
        id: 'tamil_by_year',
        name: 'Tamil - By Year',
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
      }
    ],
    
    // Support both IMDB IDs and TMDB IDs
    idPrefixes: ['tt', 'tmdb:']
  };
}
