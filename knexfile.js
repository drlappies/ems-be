const knexConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_NAME,
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
    },
  }
};

module.exports = knexConfig