const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
        },
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            trim: true,
            lowercase: true,
            unique: true,
            require: true,
        },
        phone: {
            type: Number,
            trim: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/clonedata/image/upload/v1595495560/avatars/Irene_kowuad.jpg",
        },
        sex: {
            type: String,
            enaum: ["male", "female"],
            default: "male",
        },
        password: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: "subscriber",
        },
        followers: [{ type: ObjectId, ref: "User" }],
        following: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        //0: admin, 1:user
        role: {
            type: String,
            enum: [0, 1],
            default: 1,
        },
        birthday: {
            type: Date,
        },
        services: {
            facebook: { type: String },
            google: { type: String },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
