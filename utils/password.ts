import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scrypt = promisify(_scrypt)
const HASH_PREFIX = "scrypt"

export const hashPassword = async (password: string) => {
    const salt = randomBytes(16).toString("hex")
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer
    return `${HASH_PREFIX}$${salt}$${derivedKey.toString("hex")}`
}

export const verifyPassword = async (password: string, storedHash: string) => {
    const [prefix, salt, encodedKey] = storedHash.split("$")
    if (prefix !== HASH_PREFIX || !salt || !encodedKey) {
        return false
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer
    const storedKey = Buffer.from(encodedKey, "hex")

    if (storedKey.length !== derivedKey.length) {
        return false
    }

    return timingSafeEqual(storedKey, derivedKey)
}
