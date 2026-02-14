const Joi = require("joi");

const signup_schema = Joi.object({
    first_name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required()
});

const login_schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    signup_schema,
    login_schema
};
