const mysql = require('mysql');
const connections = require('./database');

const dropbox_db_config = connections.mysqlServer

let pool = null;

try {
    pool = mysql.createPool(dropbox_db_config);
} catch (e) {
    console.error(e.stack ? e.stack.replace(/\n/g," ") : e);
}

module.exports = {
    dropbox_db_pool : pool
}