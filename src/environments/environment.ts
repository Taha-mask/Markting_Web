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
  firebaseConfig: {
    apiKey: 'AIzaSyAekjysbfUmFQF4j4xrsJ5y0jASBDnSveE',
    authDomain: 'brandit-app-fb36d.firebaseapp.com',
    databaseURL: 'https://brandit-app-fb36d-default-rtdb.firebaseio.com',
    projectId: 'brandit-app-fb36d',
    storageBucket: 'brandit-app-fb36d.firebasestorage.app',
    messagingSenderId: '70217701306',
    appId: '1:70217701306:web:56a097f1ad8e10d7172f83',
    measurementId: 'G-ZQV7FB4E3S',
  },
};
