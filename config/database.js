'use strict';

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');
const Url = require('url-parse');
const databaseUrl = new Url(Env.get('DATABASE_URL'));

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'pg'),

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', databaseUrl.hostname),
      port: Env.get('DB_PORT', databaseUrl.port),
      user: Env.get('DB_USER', databaseUrl.username),
      password: Env.get('DB_PASSWORD', databaseUrl.password),
      database: Env.get('DB_DATABASE', databaseUrl.pathname.substr(1)),
      ssl: Env.get('DB_SSL_DISABLE', false)
        ? false
        : {
            rejectUnauthorized: false
          }
    },
    debug: true
  },

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  }
};
