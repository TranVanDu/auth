const User = require("../../models/user");
const Post = require("../../models/post");
const fs = require("fs");
const bcrypt = require("bcrypt");
const salt = 12;

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

exports.updateAvatar = async (req, res) => {
    try {
        const file = req.file.path;
        const { avatar } = req.user;
        if (/^uploads/.test(avatar)) {
            fs.unlinkSync(avatar);
        }

        let user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { avatar: file },
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            status: "success",
            status_code: "200",
            message: "success",
            data: {
                user,
                isAuth: true,
            },
        });
    } catch (error) {
        return res.status(422).json({
            status: "error",
            status_code: 422,
            message: error,
        });
    }
};

exports.searchUser = (req, res) => {
    let userPattern = new RegExp(req.query.name, "gi");
    console.log(userPattern);
    User.find({ name: { $regex: userPattern } })
        .select("_id name email avatar")
        .then((user) => {
            res.status(200).json({
                status: "success",
                status_code: "200",
                message: "success",
                data: { users: user },
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

exports.updateProfile = async (req, res) => {
    let data = req.body;
    try {
        if (req.user) {
            if (data.email || data.password || data.role || data.avatar) {
                delete data.email;
                delete data.password;
                delete data.role;
                delete data.avatar;
            }

            let user = await User.findByIdAndUpdate(req.user._id, data, {
                new: true,
            }).select("-password");

            res.json({
                status: "success",
                status_code: 200,
                message: "update success",
                data: { user },
            });
        } else {
            return res.status(401).json({
                status: "error",
                status_code: 401,
                message: "You must be login",
            });
        }
    } catch (error) {
        return res
            .status(422)
            .json({ status: "error", status_code: 422, message: error });
    }
};

exports.changePassword = async (req, res) => {
    let { old_password, new_password } = req.body;
    try {
        if (req.user) {
            let user = await User.findOne({ _id: req.user._id });

            bcrypt.compare(old_password, user.password).then((domatch) => {
                if (domatch) {
                    bcrypt.hash(new_password, salt).then((hashPassword) => {
                        User.findByIdAndUpdate(
                            req.user._id,
                            { $set: { password: hashPassword } },
                            { new: true }
                        )
                            .select("-password")
                            .then((result) => {
                                res.json({
                                    status: "success",
                                    status_code: 200,
                                    message: "Change password success",
                                    data: { user: result },
                                });
                            })
                            .catch((err) => {
                                return res.status(422).json({
                                    status: "error",
                                    status_code: 422,
                                    message: err,
                                });
                            });
                    });
                } else {
                    return res.status(422).json({
                        status: "error",
                        status_code: 422,
                        message: "Old password not match",
                    });
                }
            });
        } else {
            return res.status(401).json({
                status: "error",
                status_code: 401,
                message: "You must be login",
            });
        }
    } catch (error) {
        return res
            .status(422)
            .json({ status: "error", status_code: 422, message: error });
    }
};
