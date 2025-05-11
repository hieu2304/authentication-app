const jwt = require("jsonwebtoken");

const TOKEN_CONFIG = {
	secret: process.env.SESSION_SECRET || "secret_key",
	expiresIn: "1d",
	refreshExpiresIn: "7d",
};

/**
 * Generate a new JWT token
 * @param {Object} payload - The data to be encoded in the token
 * @returns {string} The generated JWT token
 */
const generateToken = (payload) => {
	return jwt.sign(payload, TOKEN_CONFIG.secret, {
		expiresIn: TOKEN_CONFIG.expiresIn,
	});
};

/**
 * Generate a refresh token
 * @param {Object} payload - The data to be encoded in the token
 * @returns {string} The generated refresh token
 */
const generateRefreshToken = (payload) => {
	return jwt.sign(payload, TOKEN_CONFIG.secret, {
		expiresIn: TOKEN_CONFIG.refreshExpiresIn,
	});
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify and decode
 * @returns {Object} The decoded token payload
 * @throws Error if token is invalid or expired
 */
const verifyToken = (token) => {
	try {
		return jwt.verify(token, TOKEN_CONFIG.secret);
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token has expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}
		throw error;
	}
};

/**
 * Decode a token without verification
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded token payload or null if invalid
 */
const decodeToken = (token) => {
	try {
		return jwt.decode(token);
	} catch {
		return null;
	}
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - The Authorization header string
 * @returns {string|null} The extracted token or null if invalid format
 */
const extractTokenFromHeader = (authHeader) => {
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return null;
	}
	return authHeader.split(" ")[1];
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - The data to be encoded in the tokens
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (payload) => {
	return {
		accessToken: generateToken(payload),
		refreshToken: generateRefreshToken(payload),
	};
};

module.exports = {
	generateToken,
	generateRefreshToken,
	verifyToken,
	decodeToken,
	extractTokenFromHeader,
	generateTokenPair,
};
