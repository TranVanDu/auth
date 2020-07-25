const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageTypes = ["text", "image", "file", "notification"];
const conversationTypes = ["User", "ChatGroup"];
const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: ObjectId,
            ref: "User",
        },
        receiver: {
            type: ObjectId,
            required: true,
        },
        conversationType: {
            type: String,
            enum: conversationTypes,
            default: "User",
        },
        type: {
            type: String,
            enum: messageTypes,
            default: "text",
        },
        message: {
            type: String,
            maxlength: 1000,
            min: 1,
        },
        images: [String],
        files: [
            {
                name: String,
                path: String,
            },
        ],
        conversationId: { type: String },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
