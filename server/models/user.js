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
                "https://media-a.laodong.vn/Storage/NewsPortal/2020/3/12/790444/Irene.jpg",
        },
        sex: {
            type: String,
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
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
