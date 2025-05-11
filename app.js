const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { getHome } = require("./controllers/user.controller");

const app = express();

// Connect to the database
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/interviewApp",
	{ useNewUrlParser: true, useUnifiedTopology: true },
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(
	session({
		secret: process.env.SESSION_SECRET || "secret_key",
		resave: false,
		saveUninitialized: true,
	}),
);

app.set("view engine", "ejs");

// Routes
app.get("/", getHome);

app.get("/signup", (req, res) => {
	res.render("signup");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.use(authRoutes);
app.use("/users", userRoutes);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
