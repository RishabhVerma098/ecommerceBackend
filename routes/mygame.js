const express = require("express");
const { getMyGames } = require("../controllers/mygame");

const router = express.Router();

//imports
const { protectRoute } = require("../middleware/auth.js");

router.route("/").get(protectRoute, getMyGames);

module.exports = router;
