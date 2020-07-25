const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
    {
        text: String,
        file: {
            type: String,
        },
        postId: { type: ObjectId, ref: "Post" },
        postedBy: { type: ObjectId, ref: "User" },
        date: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
