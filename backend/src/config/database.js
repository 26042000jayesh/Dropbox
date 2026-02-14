const { db_config } = require('../../env');


module.exports = {
    mysqlServer: {
        host: db_config.host,
        port: db_config.port,
        user: db_config.user,
        password: db_config.password,
        database: db_config.name,
    }
}