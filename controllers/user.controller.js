const User = require("../models/User");

const getTotalUsers = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		res.status(200).json({
			success: true,
			totalUsers: totalUsers,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Server error",
		});
	}
};

const getHome = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		let userData = null;
		if (req.session.user) {
			userData = await User.findById(req.session.user.id).select("-password");
		}

		res.status(200).render("home", {
			user: userData,
			totalUsers: totalUsers || 0,
		});
	} catch (error) {
		console.error("Home page error:", error);
		res.status(500).render("home", {
			user: null,
			totalUsers: 0,
		});
	}
};

module.exports = {
	getTotalUsers,
	getHome,
};
