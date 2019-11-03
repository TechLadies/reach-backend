require('dotenv').config()

module.exports = {
  development: {
    database: 'starterkit_development',
    host: 'localhost',
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
  },
  test: {
    database: 'starterkit_test',
    host: 'localhost',
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