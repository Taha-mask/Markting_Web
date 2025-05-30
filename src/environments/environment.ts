interface Environment {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  supabase: {
    url: string;
    key: string;
  };
}

export const environment: Environment = {


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
  supabase: {
    url: 'https://kepydzjtwaelfahuxfpu.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcHlkemp0d2FlbGZhaHV4ZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzI4MDYsImV4cCI6MjA2NDE0ODgwNn0.JPbnkp1OlGivY5w0pBlytKTeETc0ztSkB3aro-Bq-YE'
  }
};
