const hashUtil = require('../utils/hash')
const jwtService = require('../services/jwtservice')
const queryService = require('../services/queryservice')

async function signup(first_name, email, password) {
    const existing_user = await queryService.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existing_user.length) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashUtil.hash(password);

    const result = await queryService.query(
        "INSERT INTO users (first_name, email, hashed_password, created_dt, updated_dt) VALUES (?, ?, ?, ?, ?)",
        [first_name, email, hashedPassword, Math.floor(Date.now()/1000), Math.floor(Date.now()/1000)]
    );

    const user_id = result.insertId;

    const token = jwtService.signJwt({user_id})

    return { user_id, token };
}

async function login(email, password) {
    const users = await queryService.query(
        "SELECT id, hashed_password FROM users WHERE email = ?",
        [email]
    );

    if (!users.length) {
        throw new Error("Invalid credentials");
    }

    const user = users[0];

    const is_match = await hashUtil.compare(password, user.hashed_password);

    if (!is_match) {
        throw new Error("Invalid credentials");
    }

    const token = jwtService.signJwt({ user_id: user.id });

    return { user_id: user.id, token };
}

module.exports = {
    signup,
    login
};