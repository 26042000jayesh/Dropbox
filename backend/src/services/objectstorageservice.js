const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const {aws_config} = require('../config/env')
const BUCKET = aws_config.bucket_name

async function getS3Client() {
    return new S3Client({
        region: aws_config.aws_region,
        endpoint: "http://localhost:4566", // remove in prod
        forcePathStyle: true,
        credentials: {
            accessKeyId: aws_config.aws_access_key,
            secretAccessKey: aws_config.aws_secret_key,
        },
    });
}

function generateFileKey(user_id, file_name) {
    const unique_id = crypto.randomUUID();
    return `users/${user_id}/${unique_id}-${file_name}`;
}


async function generateUploadUrl(user_id, file_name, content_type) {
    const s3 = await getS3Client()
    const key = generateFileKey(user_id, file_name);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: content_type,
    });

    const upload_url = await getSignedUrl(s3, command, {
        expiresIn: 300,
    });

    return { upload_url, key };
}

async function generateDownloadUrl(key){

    const s3 = await getS3Client()

    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });

    const download_url = await getSignedUrl(s3, command, {
        expiresIn: 300,
    });

    return { download_url };
}

module.exports = {
    getS3Client,
    generateDownloadUrl,
    generateUploadUrl
}