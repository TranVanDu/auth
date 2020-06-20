const express = require("express");
const router = express.Router();
const {
    confirmEmail,
    collectEmail,
} = require("../controllers/email/email.controller");

router.post("/register", collectEmail);
router.get("/register/confirm/:id", confirmEmail);

module.exports = router;
