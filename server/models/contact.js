const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const contactSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: "User",
        },
        contactId: {
            type: ObjectId,
            ref: "User",
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
