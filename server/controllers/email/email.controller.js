const User = require("../../models/user");
const { sendEmail } = require("./email.send");
const msgs = require("./email.msgs");
const templates = require("./email.templates");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../../config/key");
const bcrypt = require("bcrypt");
// The callback that is invoked when the user submits the form on the client.
exports.collectEmail = (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
        .then((user) => {
            // We have a new user! Send them a confirmation email.
            if (!user) {
                //User(doc).save();
                User.create({ email })
                    .then((newUser) =>
                        sendEmail(newUser.email, templates.confirm(newUser._id))
                    )
                    .then(() => res.json({ msg: msgs.confirm }))
                    .catch((err) => console.log(err));
            }

            // We have already seen this email address. But the user has not
            // clicked on the confirmation link. Send another confirmation email.
            else if (user && !user.confirmed) {
                sendEmail(user.email, templates.confirm(user._id)).then(() =>
                    res.json({ msg: msgs.resend })
                );
            }

            // The user has already confirmed this email address
            else {
                res.json({ msg: msgs.alreadyConfirmed });
            }
        })
        .catch((err) => console.log(err));
};

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
exports.confirmEmail = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .then((user) => {
            // A user with that id does not exist in the DB. Perhaps some tricky
            // user tried to go to a different url than the one provided in the
            // confirmation email.
            if (!user) {
                res.json({ msg: msgs.couldNotFind });
            }

            // The user exists but has not been confirmed. We need to confirm this
            // user and let them know their email address has been confirmed.
            else if (user && !user.confirmed) {
                User.findByIdAndUpdate(id, { confirmed: true })
                    .then(() => res.json({ msg: msgs.confirmed }))
                    .catch((err) => console.log(err));
            }

            // The user has already confirmed this email address.
            else {
                res.json({ msg: msgs.alreadyConfirmed });
            }
        })
        .catch((err) => console.log(err));
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email })
        .exec()
        .then((result) => {
            let token = jwt.sign({ email: email }, JWT_KEY, {
                expiresIn: 60 * 5,
            });

            sendEmail(email, templates.resetPassword(token))
                .then(() => {
                    res.json({
                        status: "success",
                        status_code: 200,
                        message: msgs.forgotPassword,
                        token,
                    });
                })
                .catch((err) => {
                    return res.status(404).json({
                        status: "error",
                        status_code: 404,
                        message: err,
                    });
                });
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ status: "error", status_code: 404, message: err });
        });
};

exports.confirmPassword = (req, res) => {
    const { password, token } = req.body;
    jwt.verify(token, JWT_KEY, (err, payload) => {
        if (err) {
            return res.status(404).json({
                status: "error",
                status_code: 404,
                message: err,
            });
        }
        const { email } = payload;
        bcrypt
            .hash(password, 12)
            .then((hassPassword) => {
                console.log(hassPassword);
                User.findOneAndUpdate(
                    { email },
                    { $set: { password: hassPassword } },
                    { new: true }
                )
                    .exec()
                    .then((result) => {
                        res.json({
                            status: "success",
                            status_code: 200,
                            message: "Change password success",
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
                return res.status(422).json({
                    status: "error",
                    status_code: 422,
                    message: err,
                });
            });
    });
};
