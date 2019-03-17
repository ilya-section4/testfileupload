'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
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
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
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
  },
  livereload: true,
};
