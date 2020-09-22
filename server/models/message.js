const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageTypes = ['text', 'image', 'file', 'notification'];
const conversationTypes = ['Conversation', 'ChatGroup'];
const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: ObjectId,
            ref: 'User',
        },
        receiver: {
            type: ObjectId,
            required: true,
            refPath: 'conversationType',
        },
        conversationType: {
            type: String,
            enum: conversationTypes,
            default: 'Conversation',
        },
        type: {
            type: String,
            enum: messageTypes,
            default: 'text',
        },
        message: {
            type: String,
            maxlength: 1000,
            min: 1,
        },

        is_read: {
            type: Boolean,
            enum: [true, false],
            default: false,
        },

        images: [String],
        files: [
            {
                name: String,
                path: String,
            },
        ],
        conversationId: {
            type: ObjectId,
            refPath: 'conversationType',
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
