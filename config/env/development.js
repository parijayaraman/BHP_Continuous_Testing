'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/birthday_app-dev',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'log/birthday_app-dev.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'BHP-Admin<admin@birthdayheadlines.com>',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
      //  username: process.env.MONGO_SEED_USER_USERNAME || 'riveruser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@riverstonetech.com',
        firstName: 'User',
        lastName: 'River',
        displayName: 'User River',
        roles: ['user']
      },
      seedAdmin: {
     //   username: process.env.MONGO_SEED_ADMIN_USERNAME || 'adminuser',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@riverstonetech.com',
        firstName: 'Admin',
        lastName: 'River',
        displayName: 'Admin River',
        roles: ['user', 'admin']
      }
    }
  }
};
