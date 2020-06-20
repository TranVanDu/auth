const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const { addContact } = require("../controllers/contact/contact.controller");
const { isAuth } = require("../controllers/auth/user.controller");

router.get("/auth", requireLogin, isAuth);
router.get("/add-contact", addContact);

module.exports = router;
