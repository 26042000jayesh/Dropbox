const authValidations = require('../validations/authvalidation')
const authService = require('../services/authservice')

async function signup(req, res){
    try {
        const { error, value } = authValidations.signup_schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status_code: 400, message: error.details[0].message });
        }
        const { first_name, email, password } = value;
        const result = await authService.signup(first_name, email, password);
        return res.status(200).json({
            status_code: 201,
            message: "User created successfully",
            data: result
        });
    } catch (err) {
        return res.status(400).json({ status_code: 400 ,message: err.message });
    }
}

async function login(req, res){
    try {
        const { error, value } = authValidations.login_schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status_code: 400, message: error.details[0].message });
        }
        const { email, password } = value;
        const result = await authService.login(email, password);
        return res.status(200).json({
            status_code: 200,
            message: "Login successful",
            data: result
        });
    } catch (err) {
        return res.status(401).json({ status_code: 401 ,message: err.message });
    }
}

module.exports = {
    signup,
    login
}