const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            require: true,
        },
        photos: [
            {
                url: { type: String, require: true },
                pic_id: { type: String },
            },
        ],
        comments: [
            {
                text: String,
                postedBy: { type: ObjectId, ref: "User" },
                date: { type: Date, default: Date.now() },
            },
        ],
        likes: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        updated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
