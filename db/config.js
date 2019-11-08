require('dotenv').config()

module.exports = {
  development: {
    database: 'reach_development',
    host: process.env.DB_SERVER ||  'localhost',
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
  },
  test: {
    database: 'reach_test',
    host: process.env.DB_SERVER ||  'localhost',
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
}
