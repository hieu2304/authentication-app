const mongoose = require("mongoose");
const Counter = require("./Counter");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	autoIncrementId: { type: Number, unique: true },
});

userSchema.pre("save", async function (next) {
	if (this.isNew) {
		try {
			const counter = await Counter.findOneAndUpdate(
				{ collectionName: "users" },
				{ $inc: { currentValue: 1 } },
				{ new: true, upsert: true },
			);

			this.autoIncrementId = counter.currentValue;
			next();
		} catch (error) {
			next(error);
		}
	} else {
		next();
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
