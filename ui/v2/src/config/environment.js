const environment = () => {
  switch (window.location.hostname) {
    case 'dev.heymirza.dev':
      return 'development';
    case 'beta.heymirza.dev':
      return 'beta';
    case 'app.heymirza.com':
      return 'production';
    case 'localhost':
      return 'local_development';
    default:
      return 'unknown';
  }
};

export default environment;
