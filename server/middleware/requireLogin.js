const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/key");
const User = require("../models/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            status: "error",
            status_code: 401,
            message: "You must be logged in",
        });
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({
                status: "error",
                status_code: 401,
                message: "You must be logged in",
            });
        }

        const { _id } = payload;
        User.findById(_id).then((userData) => {
            req.user = userData;
            next();
        });
    });
};
