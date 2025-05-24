export const environment = {
  production: false,
  // Server connection settings - use proxy URLs to avoid CORS issues
  apiUrl: 'https://brandit.runasp.net/api', // Proxy path that will be forwarded to the backend
  chatHubUrl: '/chatHub', // Proxy path for SignalR hub
  imageUrl: 'https://brandit.runasp.net/images',

  // Connection settings
  useFallbackMode: false, // Set to true to use mock data when server is unavailable
  connectionRetryAttempts: 3,
  connectionRetryDelay: 2000, // ms

  // Remote server URLs (for production)
  // Uncomment these and comment out the localhost URLs when deploying to production
  // apiUrl: 'https://brandit.runasp.net/api',
  // chatHubUrl: 'https://brandit.runasp.net/chatHub'
};
