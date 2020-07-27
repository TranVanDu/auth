const express = require("express");
const router = express.Router();
const {
    confirmEmail,
    collectEmail,
    forgotPassword,
    confirmPassword,
} = require("../controllers/email/email.controller");

router.post("/register", collectEmail);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-password", confirmPassword);
router.get("/register/confirm/:id", confirmEmail);

module.exports = router;
