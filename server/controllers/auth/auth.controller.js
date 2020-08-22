const bcrypt = require("bcrypt");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../../config/key");
const _ = require("lodash");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const salt = 12;

/**********************************************************************************
 * Đăng ký tài khoản(Signup account)
 * **********************************************************************************/
exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.status(422).json({
            status: "error",
            status_code: 422,
            msg: "Please add all the fields",
        });
    } else {
        User.findOne({ email: email })
            .then((saveUser) => {
                if (saveUser) {
                    return res.status(422).json({
                        status: "error",
                        status_code: 422,
                        message: "user already exits with that email",
                    });
                }
                bcrypt.hash(password, salt).then((hashPassword) => {
                    const user = new User({
                        email,
                        password: hashPassword,
                        name,
                    });

                    user.save()
                        .then((user) => {
                            res.status(200).json({
                                status: "success",
                                status_code: 200,
                                message: "save success",
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ error: err });
                        });
                });
            })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
    }
};

/**************************************************************************************
 * Đăng nhập bằng taig khoản email, password thông thường(login with email and password)
 * *************************************************************************************/

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            status: "error",
            status_code: 422,
            message: "please add email or password",
        });
    } else {
        User.findOne({ email: email })
            .then((saveUser) => {
                if (!saveUser) {
                    return res.status(422).json({
                        status: "error",
                        status_code: 422,
                        message: "Invalid Email or Password",
                    });
                }
                bcrypt.compare(password, saveUser.password).then((doMatch) => {
                    if (doMatch) {
                        const token = jwt.sign(
                            {
                                _id: saveUser._id,
                            },
                            JWT_KEY,
                            { expiresIn: "7d" }
                        );

                        let user = JSON.parse(JSON.stringify(saveUser));
                        delete user.password;

                        res.status(200).json({
                            status: "success",
                            status_code: 200,
                            message: "login success",
                            data: {
                                token,
                                user: user,
                                isAuth: true,
                            },
                        });
                    } else {
                        return res.status(422).json({
                            status: "error",
                            status_code: 422,
                            message: "Invalid email or password",
                        });
                    }
                });
            })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
    }
};

/**************************************************************************************
 * Đăng nhập bằng  facebook (login with facebook)
 * *************************************************************************************/

exports.loginFacebook = (req, res) => {
    const { userID, accessToken } = req.body;
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,gender,email,picture&access_token=${accessToken}`;

    fetch(url, {
        method: "get",
    })
        .then((response) => response.json())
        .then((response) => {
            const { name, email, picture } = response;
            if (!picture) {
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: "Đã xảy ra lỗi",
                });
            }
            let { url } = picture.data;

            User.findOne({ email: email }).exec((err, dataUser) => {
                if (dataUser) {
                    let token = jwt.sign({ _id: dataUser._id }, JWT_KEY, {
                        expiresIn: "7d",
                    });
                    let user = JSON.parse(JSON.stringify(dataUser));
                    delete user.password;

                    return res.status(200).json({
                        status: "success",
                        status_code: 200,
                        message: "Login sucess",
                        data: {
                            token: token,
                            user: user,
                            isAuth: true,
                        },
                    });
                } else {
                    bcrypt
                        .hash("123456789", salt)
                        .then((hashPassword) => {
                            const user = new User({
                                email,
                                password: hashPassword,
                                name,
                                avatar: url,
                            });

                            user.save()
                                .then((user) => {
                                    console.log(user);
                                    let token = jwt.sign(
                                        { _id: user._id },
                                        JWT_KEY,
                                        { expiresIn: "7d" }
                                    );
                                    let data = JSON.parse(JSON.stringify(user));
                                    delete data.password;
                                    return res.status(200).json({
                                        status: "success",
                                        status_code: 200,
                                        message: "Login sucess",
                                        data: {
                                            token: token,
                                            user: data,
                                            isAuth: true,
                                        },
                                    });
                                })
                                .catch((err) => {
                                    return res.status(500).json({ error: err });
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

/**************************************************************************************
 * Đăng nhập bằng google+(login with google+)
 * *************************************************************************************/

exports.loginGoogle = (req, res) => {
    const { tokenId } = req.body;
    client
        .verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        .then((response) => {
            const { email, email_verified, name, picture } = response.payload;

            if (email_verified) {
                User.findOne({ email: email }).exec((err, data) => {
                    if (err) {
                        return res.status(422).json({
                            status: "error",
                            status_code: 422,
                            message: "error",
                        });
                    } else {
                        if (data) {
                            let token = jwt.sign({ _id: data._id }, JWT_KEY, {
                                expiresIn: "7d",
                            });
                            let user = JSON.parse(JSON.stringify(data));
                            delete user.password;
                            return res.status(200).json({
                                status: "success",
                                status_code: 200,
                                message: "Login sucess",
                                data: {
                                    token: token,
                                    user: user,
                                    isAuth: true,
                                },
                            });
                        } else {
                            let password = "pass" + email;
                            bcrypt
                                .hash(password, salt)
                                .then((hashPassword) => {
                                    console.log(hashPassword);
                                    const user = new User({
                                        name,
                                        email,
                                        verify: email_verified,
                                        avatar: picture,
                                        password: hashPassword,
                                    });
                                    user.save()
                                        .then((data) => {
                                            let token = jwt.sign(
                                                { _id: data._id },
                                                JWT_KEY,
                                                { expiresIn: "7d" }
                                            );
                                            let user = JSON.parse(
                                                JSON.stringify(data)
                                            );
                                            delete user.password;
                                            return res.status(200).json({
                                                status: "success",
                                                status_code: 200,
                                                message: "Login sucess",
                                                data: {
                                                    token: token,
                                                    user: user,
                                                    isAuth: true,
                                                },
                                            });
                                        })
                                        .catch((err) => {
                                            return res.status(422).json({
                                                status: "error",
                                                status_code: 422,
                                                message: err,
                                            });
                                        });
                                })
                                .catch((err) => {
                                    res.status(422).json({ error: err });
                                });
                        }
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(422).json({ error: err });
        });
};

/**************************************************************************************
 * Đăng nhập bằng github
 * *************************************************************************************/
