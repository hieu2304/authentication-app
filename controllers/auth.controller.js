const User = require("../models/User");
const { generateTokenPair, verifyToken } = require("../middleware/auth");
const { comparePassword, hashPassword } = require("../utils/hash");

const signup = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			res.status(400).json({
				success: false,
				message: "User already exists",
			});
			return;
		}

		const hashedPassword = await hashPassword(password);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		req.session.user = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		const tokens = generateTokenPair({
			id: user.id,
			username: user.username,
			email: user.email,
		});

		res.status(201).json({
			success: true,
			...tokens,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message || "Server error",
		});
	}
};

const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user || !(await user.comparePassword(password))) {
			res.status(401).json({
				success: false,
				message: "Invalid username or password",
			});
			return;
		}

		const tokens = generateTokenPair({
			id: user.id,
			username: user.username,
			email: user.email,
		});

		req.session.user = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		res.status(200).json({
			success: true,
			...tokens,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message || "Server error",
		});
	}
};

const logout = async (req, res) => {
	res.json({
		success: true,
		message: "Logged out successfully",
	});
};

const getCurrentUser = async (req, res) => {
	try {
		if (!req.user) {
			res.status(401).json({
				success: false,
				message: "Not authenticated",
			});
			return;
		}

		const user = await User.findById(req.user.id).select("-password");

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message || "Server error",
		});
	}
};

const refreshToken = async (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		res.status(400).json({
			success: false,
			message: "Refresh token is required",
		});
		return;
	}

	try {
		const decoded = verifyToken(refreshToken);
		const user = await User.findById(decoded.id);

		if (!user) {
			res.status(401).json({
				success: false,
				message: "User not found",
			});
			return;
		}

		const tokens = generateTokenPair({
			id: user.id,
			username: user.username,
			email: user.email,
		});

		res.status(200).json({
			success: true,
			...tokens,
		});
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Invalid refresh token",
		});
	}
};

module.exports = {
	signup,
	login,
	logout,
	refreshToken,
	getCurrentUser,
};
