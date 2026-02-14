const {dropbox_db_pool} = require('../config/connections')

async function query(query_string, escaped_values = []){
    try {
        const [rows] = await dropbox_db_pool.execute(query_string, escaped_values);
        return rows;
    } catch (error) {
        console.error("DB Query Error:", error);
        throw new Error("Error while executing query");
    }
}

module.exports = {
    query
}