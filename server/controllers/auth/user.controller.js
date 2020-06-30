const User = require("../../models/user");
const Post = require("../../models/post");
const fs = require("fs");

exports.isAuth = (req, res) => {
    if (req.user) {
        let user = JSON.parse(JSON.stringify(req.user));
        delete user.password;

        Post.find({ postedBy: req.user._id })
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
                                    data: { user, posts: result, isAuth: true },
                                    total: count,
                                });
                            }
                        }
                    );
                }
            });
    } else {
        return res.status(404).json({
            status: "error",
            status_code: 404,
            message: "Erorr",
            data: {},
        });
    }
};

exports.profileUser = (req, res) => {
    User.findById(req.params.id)
        .select("-password")
        .exec((err, user) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            } else {
                Post.find({ postedBy: req.params.id })
                    .populate("comments.postedBy", "_id name avatar")
                    .limit(10)
                    .exec((err, result) => {
                        if (err) {
                            return res.status(422).json({
                                status: "error",
                                status_code: 422,
                                message: err,
                            });
                        }
                        Post.countDocuments({ postId: req.params._id }).exec(
                            (err, count) => {
                                if (err) {
                                    return res.status(422).json({
                                        status: "error",
                                        status_code: 422,
                                        message: err,
                                    });
                                }

                                res.status(200).json({
                                    status: "success",
                                    status_code: "200",
                                    message: "success",
                                    data: { user, posts: result },
                                    total: count,
                                });
                            }
                        );
                    });
            }
        });
};

exports.follow = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id },
        },
        { new: true }
    ).exec((err, data) => {
        if (err) {
            return res.status(422).json({
                status: "error",
                status_code: 422,
                message: err,
            });
        }

        User.findByIdAndUpdate(
            req.user._id,
            {
                $push: { following: req.body.followId },
            },
            { new: true }
        )
            .select("-password")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({
                        status: "error",
                        status_code: 422,
                        message: err,
                    });
                }
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: { userfollow: data, user: result },
                });
            });
    });
};

exports.unfollow = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $pull: { followers: req.user._id },
        },
        { new: true }
    ).exec((err, data) => {
        if (err) {
            return res.status(422).json({
                status: "error",
                status_code: 422,
                message: err,
            });
        }

        User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { following: req.body.followId },
            },
            { new: true }
        )
            .select("-password")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({
                        status: "error",
                        status_code: 422,
                        message: err,
                    });
                }
                res.status(200).json({
                    status: "success",
                    status_code: "200",
                    message: "success",
                    data: { userfollow: data, user: result },
                });
            });
    });
};

exports.updateAvatar = (req, res) => {
    const file = req.file.path;
    if (/^upload/.test(req.user.avatar)) {
        fs.unlinkSync(req.user.avatar.split(/[\\\/]/).join("\\"));
    }
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: file },
        },
        { new: true }
    )
        .select("-password")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            }
            res.status(200).json({
                status: "success",
                status_code: "200",
                message: "success",
                data: {
                    user: result,
                    isAuth: true,
                },
            });
        });
};

exports.searchUser = (req, res) => {
    let userPattern = new RegExp("^" + req.params.query);
    User.find({ name: { $regex: userPattern } })
        .select("_id name email avatar")
        .then((user) => {
            res.status(200).json({
                status: "success",
                status_code: "200",
                message: "success",
                data: { user: user },
            });
        })
        .catch((err) => {
            return res.status(422).json({
                status: "error",
                status_code: 422,
                message: err,
            });
        });
};
