const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "cmpt372",
    host: "34.145.35.44",
    database: "postgres"
})

pool.connect();
 
module.exports = pool
async function selectQuery() {
    try {
        var myquery = await pool.query("SELECT * FROM students")
        console.log("1", myquery.rows)
        pool.end()
        process.exit()
    }
    catch (e) {
        console.log("2", e)
    }
}

//selectQuery()

