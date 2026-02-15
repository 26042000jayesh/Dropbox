const dotenv = require('dotenv');
const path = require('path')
dotenv.config({
    path: path.join(process.cwd(), '.env'),
});
const {
    APP_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    JWT_SECRET,
    AWS_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET_NAME,
    AWS_ENDPOINT
} = process.env;

if (!APP_PORT || !DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME ||!DB_PORT ||!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_BUCKET_NAME) {
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
    },
    auth_config:{
        jwt_secret: JWT_SECRET
    },
    aws_config:{
        aws_region: AWS_REGION,
        aws_access_key: AWS_ACCESS_KEY,
        aws_secret_key: AWS_SECRET_KEY,
        bucket_name: AWS_BUCKET_NAME,
        endpoint: AWS_ENDPOINT,
        public_endpoint: process.env.AWS_PUBLIC_ENDPOINT || AWS_ENDPOINT
    }
};
