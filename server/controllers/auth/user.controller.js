const User = require("../../models/user");

exports.isAuth = (req, res) => {
    if (req.user) {
        let user = JSON.parse(JSON.stringify(req.user));
        delete user.password;

        res.status(200).json({
            status: "susscess",
            status_code: 200,
            message: "success",
            data: { user: user, isAuth: true },
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
