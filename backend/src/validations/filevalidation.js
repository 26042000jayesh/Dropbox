const Joi = require("joi");

const uploadUrlSchema = Joi.object({
    file_name: Joi.string().required(),
    content_type: Joi.string().required(),
    size: Joi.number().max(5 * 1024 * 1024).required() 
});

const downloadUrlSchema = Joi.object({
    key: Joi.string().required()
});

const confirmUploadSchema = Joi.object({
    file_id: Joi.number().integer().positive().max(Number.MAX_SAFE_INTEGER).required()
});


module.exports = {
    uploadUrlSchema,
    downloadUrlSchema,
    confirmUploadSchema
};
