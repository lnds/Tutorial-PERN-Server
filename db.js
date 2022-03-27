// db.js

const Pool = require("pg").Pool

const connUrl = process.env.CONNECTION_URL

const pool = new Pool({
    connUrl,
})

module.exports = pool
