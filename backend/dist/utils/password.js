"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
const HASH_PREFIX = "scrypt";
const hashPassword = async (password) => {
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64));
    return `${HASH_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, storedHash) => {
    const [prefix, salt, encodedKey] = storedHash.split("$");
    if (prefix !== HASH_PREFIX || !salt || !encodedKey) {
        return false;
    }
    const derivedKey = (await scrypt(password, salt, 64));
    const storedKey = Buffer.from(encodedKey, "hex");
    if (storedKey.length !== derivedKey.length) {
        return false;
    }
    return (0, crypto_1.timingSafeEqual)(storedKey, derivedKey);
};
exports.verifyPassword = verifyPassword;
