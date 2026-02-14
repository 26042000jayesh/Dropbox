const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

async function hash(key){
    console.log("key--->", key)
    return bcrypt.hash(key, SALT_ROUNDS);
}

async function compare(key, hashed_key){
    return bcrypt.compare(key, hashed_key);
}

module.exports = {
    hash,
    compare
}