const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    loginFacebook,
    loginGoogle,
} = require("../controllers/auth/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/login-facebook", loginFacebook);
router.post("/login-google", loginGoogle);

module.exports = router;
