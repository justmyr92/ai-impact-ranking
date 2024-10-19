// PORT=9000
// DB_HOST=localhost
// DB_PORT=5432
// DB_NAME=commission
// DB_USER=postgres

const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

module.exports = pool;
