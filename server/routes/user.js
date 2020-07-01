const express = require("express");
const router = express.Router();
// const requireLogin = require("../middleware/requireLogin");
const { addContact } = require("../controllers/contact/contact.controller");
const {
    isAuth,
    follow,
    unfollow,
    searchUser,
    profileUser,
    updateAvatar,
} = require("../controllers/auth/user.controller");
const upload = require("../helper/multer");

router.get("/auth", isAuth);
router.get("/add-contact", addContact);
router.get("/user/:id", profileUser);
router.put("/follow", follow);
router.put("/unfollow", unfollow);
router.put("/updateAvatar", upload.single("file"), updateAvatar);
router.get("/search-users", searchUser);

module.exports = router;
