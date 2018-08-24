'use strict';

var fs = require('fs');

module.exports = {
  secure: {
    ssl: true,
    // privateKey: './config/sslcerts/key.pem',
    // certificate: './config/sslcerts/cert.pem',
    // caBundle: './config/sslcerts/ca-bundle.crt'
    privateKey: '/home/bhp/sslcerts/private.key',
    certificate: '/home/bhp/sslcerts/public.crt',
    caBundle: '/home/bhp/sslcerts/ca-bundle.crt'
  },
  sessionSecret: process.env.SESSION_SECRET || 'birthday headlines dot com',
  port: process.env.PORT || 443,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/birthday_app',
    options: {
      user: '',
      pass: ''
      /**
        * Uncomment to enable ssl certificate based authentication to mongodb
        * servers. Adjust the settings below for your specific certificate
        * setup.
        * for connect to a replicaset, rename server:{...} to replset:{...}
      server: {
        ssl: true,
        sslValidate: false,
        checkServerIdentity: false,
        sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
        sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
        sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
        sslPass: '1234'
      }
      */
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'log/birthday_app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'BHP-Admin<admin@birthdayheadlines.com>',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'hostgator',
      host: 'mail.birthdayheadlines.com',
      port: 26,
      ignoreTLS: true,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'admin@birthdayheadlines.com',
        pass: process.env.MAILER_PASSWORD || 'Bx0zgd]5Coew'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'MONGO_SEED_USER_EMAIL',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'MONGO_SEED_ADMIN_EMAIL',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
