const envConfig = require('./environment-config');

const corsOptions = {
  origin: (origin, callback) => {
    if (envConfig.corsOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;