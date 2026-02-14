const dotenv = require('dotenv');
const path = require('path')
dotenv.config({
    path: path.join(process.cwd(), '.env'),
    override: true
});
const {
    APP_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} = process.env;

if (!APP_PORT || !DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME ||!DB_PORT) {
    throw new Error('Missing required environment variables');
}
module.exports = {
    app_config: {
        port: Number(APP_PORT),
    },
    db_config: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        name: DB_NAME,
        port: DB_PORT
    }
};
