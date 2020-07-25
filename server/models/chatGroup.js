const mongoose = require(mongoose);
const { ObjectId } = mongoose.Schema.Types;
const chatGroupSchema = new mongoose.scheme(
    {
        name: {
            type: String,
        },
        admin: {
            type: String,
        },
        members: [{ type: ObjectId, ref: "User" }],
        picture: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);

module.exports = ChatGroup;
