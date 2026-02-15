const Joi = require("joi");

const uploadUrlSchema = Joi.object({
    file_name: Joi.string().required(),
    content_type: Joi.string().required(),
    size: Joi.number().max(5 * 1024 * 1024).required() 
});

const downloadUrlSchema = Joi.object({
    file_id: Joi.number().required()
});

const confirmUploadSchema = Joi.object({
    file_id: Joi.number().integer().positive().max(Number.MAX_SAFE_INTEGER).required()
});

const listFilesSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),
    search: Joi.string().allow("").optional()
});

const deleteFileSchema = Joi.object({
    file_id: Joi.number().required()
});

const renameFileSchema = Joi.object({
    file_id: Joi.number().required(),
    new_name: Joi.string().min(1).max(255).required()
});


module.exports = {
    uploadUrlSchema,
    downloadUrlSchema,
    confirmUploadSchema,
    listFilesSchema,
    deleteFileSchema,
    renameFileSchema
};
