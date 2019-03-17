'use strict';

var fs = require('fs');

module.exports = {
  secure: {
    ssl: false,
    privateKey: './settings/sslcerts/key.pem',
    certificate: './settings/sslcerts/cert.pem',
    caBundle: './settings/sslcerts/cabundle.crt'
  },
  port: process.env.PORT || 8443,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    name: 'testfileupload',
    password: '... your mySQL Password',
    username: '... your mySQL Username',
    options: {
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD',
        key: process.env.MAILER_KEY || 'MAILER_KEY'
      }
    }
  }
};
