const express = require("express");
const router = express.Router();
const upload = require("../helper/multer");
// const requireLogin = require("../middleware/requireLogin");
const {
    getAllPosts,
    getSubPost,
    myPost,
    likePost,
    unLikePost,
    commentPost,
    createPost,
    deletePost,
    getPost,
} = require("../controllers/post/post.controller");

router.get("/allposts", getAllPosts);
router.get("/getsubposts", getSubPost);
router.get("/myposts", myPost);
router.get("/post/:postId", getPost);
router.post("/createpost", upload.array("image", 6), createPost);
router.delete("/deletepost/:postId", deletePost);
router.put("/like", likePost);
router.put("/unlike", unLikePost);
router.put("/comments", commentPost);

module.exports = router;
