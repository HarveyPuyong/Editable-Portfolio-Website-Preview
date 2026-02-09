const environmentConfig = {
  development: {
    corsOrigins: [
      'http://127.0.0.1:5500',
      'http://localhost:4500'
    ],
    apiUrl: 'http://localhost:4500',
    logLevel: 'debug'
  },

  production: {
    corsOrigins: [
      'https://editable-portfolio-website.netlify.app'
    ],
    apiUrl: 'https://editable-portfolio-website-1.onrender.com',
    logLevel: 'info'
  },

  test: {
    corsOrigins: [
      'http://localhost:3000'
    ],
    apiUrl: 'http://localhost:3000',
    logLevel: 'silent'
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = environmentConfig[env];
