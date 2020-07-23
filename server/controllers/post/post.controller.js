const Post = require("../../models/post");
const upload = require("../../helper/multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const cloudinary = require("../../helper/cloudinary");

//get all post
module.exports.getAllPosts = (req, res) => {
    Post.find()
        .populate("postedBy", "_id name avatar")
        .populate("comments.postedBy", "_id name avatar")
        .sort({ updatedAt: -1 })
        .limit(10)
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                Post.countDocuments({}).exec((err, count) => {
                    if (err) {
                        return res.status(422).json({
                            status: "error",
                            status_code: 422,
                            message: err,
                        });
                    } else {
                        res.status(200).json({
                            status: "success",
                            status_code: "200",
                            message: "success",
                            data: result,
                            total: count,
                        });
                    }
                });
            }
        });
};

//create new post

module.exports.createPost = async (req, res) => {
    try {
        const body = req.body.body === "undefined" ? "" : req.body.body;
        const uploader = async (path) =>
            await cloudinary.uploads(path, "Images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path.split(/[\\\/]/).join("/"));
            urls.push(newPath);
            fs.unlinkSync(path.split(/[\\\/]/).join("\\"));
        }
        let user = JSON.parse(JSON.stringify(req.user));
        delete user.password;
        const post = new Post({
            body,
            photos: urls,
            postedBy: user,
        });

        const result = await post.save();
        if (result) {
            res.status(200).json({
                status: "succes",
                status_code: 200,
                message: "success",
                data: {
                    post: result,
                },
            });
        }
    } catch (error) {
        return res.status(422).json({
            status: "error",
            status_code: "422",
            message: error,
        });
    }
};

//get my post
module.exports.myPost = (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name  avatar")
        .limit(10)
        .sort({ updatedAt: -1 })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: "422",
                    message: err,
                });
            } else {
                Post.countDocuments({ postedBy: req.user._id }).exec(
                    (err, count) => {
                        if (err) {
                            return res.status(422).json({
                                status: "error",
                                status_code: 422,
                                message: err,
                            });
                        } else {
                            res.status(200).json({
                                status: "success",
                                status_code: "200",
                                message: "success",
                                data: result,
                                total: count,
                            });
                        }
                    }
                );
            }
        });
};

//like post
module.exports.likePost = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { likes: req.user._id },
        },
        { new: true }
    )
        .populate("postedBy", "_id name avatar")
        .populate("comments.postedBy", "_id name avatar")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: result,
                });
            }
        });
};

// unlike post
module.exports.unLikePost = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $pull: { likes: req.user._id },
        },
        { new: true }
    )
        .populate("postedBy", "_id name avatar")
        .populate("comments.postedBy", "_id name avatar")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: result,
                });
            }
        });
};

//comment post
module.exports.commentPost = (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    };

    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { comments: comment },
        },
        { new: true }
    )
        .populate("comments.postedBy", "_id name avatar")
        .populate("postedBy", "_id name avatar")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: result,
                });
            }
        });
};

//get subcrise post
module.exports.getSubPost = (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name avatar")
        .populate("comments.postedBy", "_id name avatar")
        .sort({ updatedAt: -1 })
        .limit(10)
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                Post.countDocuments({
                    postedBy: { $in: req.user.following },
                }).exec((err, count) => {
                    if (err) {
                        return res.status(422).json({
                            status: "error",
                            status_code: 422,
                            message: err,
                        });
                    } else {
                        res.status(200).json({
                            status: "success",
                            status_code: "200",
                            message: "success",
                            data: result,
                            total: count,
                        });
                    }
                });
            }
        });
};

module.exports.getPost = (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id name avatar")
        .populate("comments.postedBy", "_id name avatar")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: result,
                });
            }
        });
};

//delete Post
module.exports.deletePost = async (req, res) => {
    try {
        const deleteImage = async (public_id) =>
            await cloudinary.deletes(public_id);
        const post = await Post.findOne({ _id: req.params.postId }).populate(
            "postedBy",
            "_id "
        );
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            for (let photo of post.photos) {
                let public_id = photo.pic_id;
                await deleteImage(public_id);
            }
            const data = await post.remove();

            res.status(200).json({
                status: "success",
                status_code: "200",
                message: "success",
                data: data,
            });
        } else {
            return res.status(422).json({
                status: "error",
                status_code: 422,
                message: "Bạn không có quyền xóa bài của người khác",
            });
        }
    } catch (error) {
        return res.status(422).json({
            status: "error",
            status_code: 422,
            message: "error",
        });
    }
};
