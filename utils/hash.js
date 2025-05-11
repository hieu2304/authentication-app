const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SESSION_SECRET || "secret_key";

/**
 * Hashes a plain password.
 * @param {string} plainPassword - The user's raw password
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (plainPassword) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(plainPassword + SECRET_KEY, salt);
	return hashedPassword;
};

/**
 * Compares a plain password with a hashed one.
 * @param {string} plainPassword - The raw password provided by the user
 * @param {string} hashedPassword - The hashed password stored in the database
 * @returns {Promise<boolean>} True if they match, false otherwise
 */
const comparePassword = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
	hashPassword,
	comparePassword,
};
