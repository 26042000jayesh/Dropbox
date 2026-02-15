const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { aws_config } = require('../config/env')
const BUCKET = aws_config.bucket_name
const { ALLOWED_FILE_TYPES } = require('../constants/filetypes')
const queryService = require('./queryservice')

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


async function generateUploadUrl(user_id, file_name, content_type, size) {

    if (ALLOWED_FILE_TYPES.includes(content_type) == false) {
        return null;
    }

    const s3 = await getS3Client()

    const key = generateFileKey(user_id, file_name);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: content_type,
        ContentLength: size
    });

    const upload_url = await getSignedUrl(s3, command, {
        expiresIn: 300,
    });

    const now = Date.now();

    const result = await queryService.query(
        `INSERT INTO files 
        (user_id, object_key, original_name, content_type, size, status, created_dt, updated_dt)
        VALUES (?, ?, ?, ?, ?, 'UPLOADING', ?, ?)`,
        [user_id, key, file_name, content_type, size, now, now]
    );

    return { upload_url, key, file_id: result.insertId };
}

async function generateDownloadUrl(user_id, file_id) {

    const [file] = await queryService.query(
        `SELECT object_key 
         FROM files 
         WHERE id = ? 
         AND user_id = ? 
         AND status = 'ACTIVE'`,
        [file_id, user_id]
    );

    if (!file) {
        const err = new Error("File not found");
        err.statusCode = 404;
        throw err;
    }

    const s3 = await getS3Client()

    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: file.object_key,
    });

    const download_url = await getSignedUrl(s3, command, {
        expiresIn: 300,
    });

    return { download_url };
}

async function confirmUpload(user_id, file_id) {
    const [file] = await queryService.query(
        `SELECT * FROM files WHERE id = ? AND user_id = ? AND status = 'UPLOADING'`,
        [file_id, user_id]
    );
    if(!file){
        const err = new Error("File not found or already confirmed");
        err.statusCode = 404;
        throw err;
    }
    const command = new HeadObjectCommand({
        Bucket: BUCKET,
        Key: file.object_key,
    });
    const s3 = await getS3Client()
    try {
        await s3.send(command)
    } catch (e) {
        const err = new Error("File not uploaded to S3");
        err.statusCode = 400;
        throw err;
    }

    const now = Math.floor(Date.now() / 1000);

    const result = await queryService.query(
        `UPDATE files 
        SET status = 'ACTIVE', updated_dt = ?
        WHERE id = ?`,
        [now, file_id]
    );

    return {
        message: "File upload confirmed",
        file_id
    };
}

async function listFiles(user_id, page = 1, limit = 10, search = "") {
    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    let whereClause = `WHERE user_id = ? AND status = 'ACTIVE'`;
    let values = [user_id];

    if (search) {
        whereClause += ` AND original_name LIKE ?`;
        values.push(`%${search}%`);
    }

    const [countResult] = await queryService.query(
        `SELECT COUNT(*) as total FROM files ${whereClause}`,
        values
    );

    const total = countResult.total;
    console.log([...values, limit, offset])
    const files = await queryService.query(
        `SELECT id, original_name, content_type, size, created_dt
         FROM files
         ${whereClause}
         ORDER BY created_dt DESC
         LIMIT ${limit} OFFSET ${offset}`,
        values
    );

    return {
        files,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
}


async function deleteFile(user_id, file_id) {

    const [file] = await queryService.query(
        `SELECT object_key 
         FROM files 
         WHERE id = ? 
         AND user_id = ? 
         AND status = 'ACTIVE'`,
        [file_id, user_id]
    );

    if (!file) {
        const err = new Error("File not found or already deleted");
        err.statusCode = 404;
        throw err;
    }
    const s3 = await getS3Client();
    const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: file.object_key,
    });
    try {
        await s3.send(command);
    } catch (e) {
        console.log(e)
        const err = new Error("Failed to delete file from storage");
        err.statusCode = 500;
        throw err;
    }

    const now = Math.floor(Date.now() / 1000);

    await queryService.query(
        `UPDATE files 
         SET status = 'DELETED', updated_dt = ?
         WHERE id = ?`,
        [now, file_id]
    );

    return { file_id };
}


async function renameFile(user_id, file_id, new_name) {

    const [file] = await queryService.query(
        `SELECT id 
         FROM files 
         WHERE id = ? 
         AND user_id = ? 
         AND status = 'ACTIVE'`,
        [file_id, user_id]
    );

    if (!file) {
        const err = new Error("File not found");
        err.statusCode = 404;
        throw err;
    }

    const [duplicate] = await queryService.query(
        `SELECT id FROM files
         WHERE user_id = ?
         AND original_name = ?
         AND status = 'ACTIVE'
         AND id != ?`,
        [user_id, new_name, file_id]
    );

    if (duplicate) {
        const err = new Error("File with same name already exists");
        err.statusCode = 400;
        throw err;
    }

    const now = Math.floor(Date.now() / 1000);

    await queryService.query(
        `UPDATE files 
         SET original_name = ?, updated_dt = ?
         WHERE id = ?`,
        [new_name, now, file_id]
    );

    return { file_id, new_name };
}


module.exports = {
    getS3Client,
    generateDownloadUrl,
    generateUploadUrl,
    confirmUpload,
    listFiles,
    deleteFile,
    renameFile
}