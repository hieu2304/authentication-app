const express = require("express");
const router = express.Router();
const { getTotalUsers } = require("../controllers/user.controller.js");

router.get("/total", getTotalUsers);

module.exports = router;
