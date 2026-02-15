const fileValidations = require('../validations/filevalidation')
const objectStorageService = require('../services/objectstorageservice')

async function getUploadUrl(req, res) {
    try {
        console.log(req.body)
        const { error, value } = fileValidations.uploadUrlSchema.validate(req.body);
        if (error) {
            return res.status(200).json({ status_code: 400, message: error.details[0].message });
        }
        const { file_name, content_type, size } = value;
        const user_id = req.user.user_id
        const result = await objectStorageService.generateUploadUrl(
            user_id,
            file_name,
            content_type,
            size
        );
        if(!result){
            return res.status(200).json({
                status_code: 400,
                message: "File type not supported",
                data: result,
            });
        }
        return res.status(200).json({
            status_code: 200,
            message: "Upload URL generated",
            data: result,
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status_code: 500, message: err.message });
    }
}

async function getDownloadUrl(req, res) {
    try {
        const { error, value } = fileValidations.downloadUrlSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status_code: 400, message: error.details[0].message });
        }

        const { key } = value;

        const result = await objectStorageService.generateDownloadUrl(key);

        return res.status(200).json({
            status_code: 200,
            message: "Download URL generated",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ status_code: 500, message: err.message });
    }
}

async function confirmUpload(req, res) {
    try {
        const { error, value } = fileValidations.confirmUploadSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status_code: 400, message: error.details[0].message });
        }

        const { file_id } = value;
        const user_id = req.user.user_id
        const result = await objectStorageService.confirmUpload(user_id, file_id);

        return res.status(200).json({
            status_code: 200,
            message: "Download URL generated",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({ status_code: 500, message: err.message });
    }
}


module.exports = {
    getUploadUrl,
    getDownloadUrl,
    confirmUpload
}